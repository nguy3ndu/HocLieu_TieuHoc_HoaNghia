export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number | string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
  grade: number; // 1 to 5
  subject: string; // 'Toán', 'Tiếng Việt', 'Tiếng Anh', etc.
  author?: string;
  downloads?: number;
  description?: string;
  isMock?: boolean;
}

export type SubjectName = 
  | 'Tất cả môn'
  | 'Toán'
  | 'Tiếng Việt'
  | 'Tiếng Anh'
  | 'Tự nhiên & Xã hội'
  | 'Khoa học'
  | 'Lịch sử & Địa lý'
  | 'Đạo đức'
  | 'Tin học'
  | 'Mỹ thuật & Âm nhạc'
  | 'Hoạt động trải nghiệm';

export interface GradeInfo {
  grade: number;
  name: string;
  subTitle: string;
  color: string;
  accentColor: string;
  badgeBg: string;
  icon: string;
  driveFolderId?: string;
}

export interface DriveConfigState {
  rootFolderId: string;
  gradeFolderIds: { [grade: number]: string };
  isUsingMockIfEmpty: boolean;
}

export interface UploadProgress {
  fileName: string;
  fileSize: number;
  grade: number;
  subject: string;
  percent: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}
