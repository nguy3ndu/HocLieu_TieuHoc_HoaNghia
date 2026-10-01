import { DriveFile } from '../types';

export class DriveApiError extends Error {
  statusCode: number;
  isPermissionError: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'DriveApiError';
    this.statusCode = statusCode;
    this.isPermissionError = statusCode === 403 || statusCode === 401;
  }
}

/**
 * Fetch files from a specific Google Drive folder
 */
export async function listDriveFiles(
  folderId: string,
  accessToken: string,
  grade: number
): Promise<DriveFile[]> {
  if (!folderId || folderId.trim() === '') {
    return [];
  }

  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent('files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink, description)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100&orderBy=folder,name`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new DriveApiError(
        'Email của bạn chưa được cấp quyền xem thư mục này trên Google Drive của trường. Vui lòng liên hệ Thầy/Cô quản trị để được cấp quyền!',
        403
      );
    }
    if (response.status === 404) {
      throw new DriveApiError(
        'Không tìm thấy thư mục Google Drive với mã ID này. Vui lòng kiểm tra lại cấu hình thư mục.',
        404
      );
    }
    if (response.status === 401) {
      throw new DriveApiError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401);
    }
    const errText = await response.text();
    throw new DriveApiError(`Lỗi kết nối Google Drive (${response.status}): ${errText}`, response.status);
  }

  const data = await response.json();
  const rawFiles = data.files || [];

  return rawFiles.map((file: any) => {
    // Attempt to parse subject from file name or description
    const detectedSubject = detectSubject(file.name, file.description);

    return {
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.size ? Number(file.size) : undefined,
      modifiedTime: file.modifiedTime,
      webViewLink: file.webViewLink,
      webContentLink: file.webContentLink,
      thumbnailLink: file.thumbnailLink,
      iconLink: file.iconLink,
      grade,
      subject: detectedSubject,
      author: 'Giáo viên Trường TH Hòa Nghĩa',
      downloads: Math.floor(Math.random() * 25) + 5,
      isMock: false,
    };
  });
}

/**
 * Upload a file to Google Drive with smooth XMLHttpRequest progress tracking
 */
export function uploadDriveFile(
  file: File,
  folderId: string,
  accessToken: string,
  grade: number,
  subject: string,
  onProgress: (percent: number) => void
): Promise<DriveFile> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      parents: folderId ? [folderId] : [],
      description: `Bài giảng môn ${subject} - Lớp ${grade} (Trường TH Hòa Nghĩa)`,
    };

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          const uploadedFile: DriveFile = {
            id: res.id,
            name: res.name,
            mimeType: res.mimeType,
            grade,
            subject,
            webViewLink: res.webViewLink || `https://drive.google.com/file/d/${res.id}/view`,
            webContentLink: res.webContentLink,
            author: 'Giáo viên trường',
            modifiedTime: new Date().toISOString(),
            size: file.size,
            isMock: false,
          };
          resolve(uploadedFile);
        } catch (e) {
          reject(new Error('Không thể phân tích phản hồi từ Google Drive'));
        }
      } else {
        if (xhr.status === 403) {
          reject(
            new DriveApiError(
              'Tài khoản của bạn không có quyền Chỉnh sửa (Editor) trên thư mục này. Chỉ Giáo viên được cấp quyền Editor mới có thể tải lên tài liệu!',
              403
            )
          );
        } else if (xhr.status === 401) {
          reject(new DriveApiError('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.', 401));
        } else {
          reject(new DriveApiError(`Tải lên thất bại (Mã lỗi ${xhr.status}): ${xhr.responseText}`, xhr.status));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Mất kết nối mạng hoặc lỗi CORS khi tải lên Google Drive.'));
    });

    xhr.open(
      'POST',
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,size'
    );
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    xhr.setRequestHeader('Content-Type', `multipart/related; boundary=${boundary}`);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
      const fileHeaderPart = `${delimiter}Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`;
      
      const encoder = new TextEncoder();
      const metaBytes = encoder.encode(metadataPart);
      const fileHeaderBytes = encoder.encode(fileHeaderPart);
      const closeBytes = encoder.encode(closeDelimiter);

      const totalLength = metaBytes.length + fileHeaderBytes.length + arrayBuffer.byteLength + closeBytes.length;
      const combined = new Uint8Array(totalLength);

      combined.set(metaBytes, 0);
      combined.set(fileHeaderBytes, metaBytes.length);
      combined.set(new Uint8Array(arrayBuffer), metaBytes.length + fileHeaderBytes.length);
      combined.set(closeBytes, metaBytes.length + fileHeaderBytes.length + arrayBuffer.byteLength);

      xhr.send(combined);
    };
    reader.onerror = () => {
      reject(new Error('Không thể đọc file từ máy tính'));
    };
  });
}

/**
 * Creates a folder on Google Drive
 */
export async function createDriveFolder(
  folderName: string,
  parentFolderId: string | null,
  accessToken: string
): Promise<{ id: string; name: string }> {
  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new DriveApiError(`Không thể tạo thư mục '${folderName}': ${errorText}`, response.status);
  }

  return response.json();
}

/**
 * Convenience helper to initialize the complete School Drive structure
 * "Kho Học Liệu - TH Hòa Nghĩa" -> "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"
 */
export async function setupSchoolDriveStructure(accessToken: string): Promise<{
  rootFolderId: string;
  gradeFolderIds: { [grade: number]: string };
}> {
  // 1. Create Root Folder
  const root = await createDriveFolder('Kho Học Liệu - Tiểu Học Hòa Nghĩa', null, accessToken);
  
  // 2. Create Grade 1 to 5 Folders
  const gradeFolderIds: { [grade: number]: string } = {};
  for (let g = 1; g <= 5; g++) {
    const sub = await createDriveFolder(`Lớp ${g} - Bài Giảng Điện Tử`, root.id, accessToken);
    gradeFolderIds[g] = sub.id;
  }

  return {
    rootFolderId: root.id,
    gradeFolderIds,
  };
}

/**
 * Auto-detect subject from filename or description
 */
function detectSubject(name: string, desc?: string): string {
  const text = `${name} ${desc || ''}`.toLowerCase();
  if (text.includes('toán') || text.includes('toan') || text.includes('math')) return 'Toán';
  if (text.includes('tiếng việt') || text.includes('tieng viet') || text.includes('tập đọc') || text.includes('chính tả') || text.includes('luyện từ')) return 'Tiếng Việt';
  if (text.includes('tiếng anh') || text.includes('english') || text.includes('tieng anh')) return 'Tiếng Anh';
  if (text.includes('đạo đức') || text.includes('dao duc')) return 'Đạo đức';
  if (text.includes('tự nhiên') || text.includes('tu nhien') || text.includes('tnxh')) return 'Tự nhiên & Xã hội';
  if (text.includes('khoa học') || text.includes('khoa hoc') || text.includes('science')) return 'Khoa học';
  if (text.includes('lịch sử') || text.includes('địa lý') || text.includes('su dia')) return 'Lịch sử & Địa lý';
  if (text.includes('tin học') || text.includes('tin hoc') || text.includes('computer')) return 'Tin học';
  if (text.includes('mỹ thuật') || text.includes('âm nhạc') || text.includes('am nhac') || text.includes('ve')) return 'Mỹ thuật & Âm nhạc';
  return 'Toán';
}
