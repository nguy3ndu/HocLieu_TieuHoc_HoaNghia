import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from './services/firebaseAuth';
import { DriveFile, DriveConfigState } from './types';
import { MOCK_CURRICULUM_FILES } from './data/mockCurriculum';
import { listDriveFiles, DriveApiError } from './services/driveService';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { GradeSelector } from './components/GradeSelector';
import { FileGrid } from './components/FileGrid';
import { PreviewModal } from './components/PreviewModal';
import { UploadModal } from './components/UploadModal';
import { DriveSettingsModal } from './components/DriveSettingsModal';
import { AccessDeniedNotice } from './components/AccessDeniedNotice';
import {
  BookOpen,
  School,
  Heart,
  Phone,
  MapPin,
  Sparkles,
  Award,
  Layers,
  CheckCircle,
} from 'lucide-react';

const DEFAULT_DRIVE_CONFIG: DriveConfigState = {
  rootFolderId: '',
  gradeFolderIds: {
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  },
  isUsingMockIfEmpty: true,
};

export default function App() {
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Drive Configuration State
  const [driveConfig, setDriveConfig] = useState<DriveConfigState>(() => {
    try {
      const saved = localStorage.getItem('th_hoanghia_drive_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_DRIVE_CONFIG;
  });

  // App & Navigation State
  const [selectedGrade, setSelectedGrade] = useState<number>(0); // 0 = all
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [files, setFiles] = useState<DriveFile[]>(MOCK_CURRICULUM_FILES);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [apiError, setApiError] = useState<DriveApiError | null>(null);

  // Modals state
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState<boolean>(false);

  // Initialize Firebase Auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Save drive config to localStorage
  const handleSaveConfig = (newConfig: DriveConfigState) => {
    setDriveConfig(newConfig);
    try {
      localStorage.setItem('th_hoanghia_drive_config', JSON.stringify(newConfig));
    } catch (e) {
      // ignore
    }
    // Reload files with new folder IDs
    loadAllFiles(newConfig, accessToken);
  };

  // Load files from Google Drive folders
  const loadAllFiles = useCallback(
    async (config: DriveConfigState, token: string | null) => {
      // If no token or no folder configured, display mock data
      const hasAnyDriveFolder =
        Boolean(config.rootFolderId) ||
        Object.values(config.gradeFolderIds).some((id) => Boolean(id));

      if (!token || !hasAnyDriveFolder) {
        setFiles(MOCK_CURRICULUM_FILES);
        return;
      }

      setIsLoadingFiles(true);
      setApiError(null);

      try {
        const fetchedFiles: DriveFile[] = [];

        // Check if individual grade folders configured
        for (let g = 1; g <= 5; g++) {
          const targetFolder = config.gradeFolderIds[g] || config.rootFolderId;
          if (targetFolder) {
            try {
              const gradeFiles = await listDriveFiles(targetFolder, token, g);
              fetchedFiles.push(...gradeFiles);
            } catch (err: any) {
              if (err instanceof DriveApiError && err.statusCode === 403) {
                setApiError(err);
                setIsAccessDeniedOpen(true);
              }
              console.warn(`Could not load files for Grade ${g}:`, err.message);
            }
          }
        }

        if (fetchedFiles.length > 0) {
          if (config.isUsingMockIfEmpty) {
            // Mix real files with sample curriculum
            setFiles([...fetchedFiles, ...MOCK_CURRICULUM_FILES]);
          } else {
            setFiles(fetchedFiles);
          }
        } else if (config.isUsingMockIfEmpty) {
          setFiles(MOCK_CURRICULUM_FILES);
        } else {
          setFiles([]);
        }
      } catch (err: any) {
        console.error('Error fetching drive files:', err);
        if (err instanceof DriveApiError && err.statusCode === 403) {
          setApiError(err);
          setIsAccessDeniedOpen(true);
        }
      } finally {
        setIsLoadingFiles(false);
      }
    },
    []
  );

  // Trigger file load when token or config changes
  useEffect(() => {
    loadAllFiles(driveConfig, accessToken);
  }, [accessToken, driveConfig, loadAllFiles]);

  // Handle Google Sign In
  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        loadAllFiles(driveConfig, res.accessToken);
      }
    } catch (err: any) {
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setFiles(MOCK_CURRICULUM_FILES);
  };

  // Handle Upload Success
  const handleUploadSuccess = (newFile: DriveFile) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  // Handle Download
  const handleDownload = (file: DriveFile) => {
    if (file.webContentLink) {
      window.open(file.webContentLink, '_blank');
      return;
    }

    if (file.webViewLink && !file.isMock) {
      window.open(file.webViewLink, '_blank');
      return;
    }

    // Fallback for mock demo download
    const blob = new Blob(
      [
        `BÀI GIẢNG ĐIỆN TỬ - TRƯỜNG TIỂU HỌC HÒA NGHĨA\r\n\r\n` +
        `Tên tài liệu: ${file.name}\r\n` +
        `Khối Lớp: ${file.grade}\r\n` +
        `Môn học: ${file.subject}\r\n` +
        `Tác giả: ${file.author || 'Tổ Chuyên Môn TH Hòa Nghĩa'}\r\n` +
        `Mô tả bài học: ${file.description || ''}\r\n\r\n` +
        `Chúc các em học sinh Tiểu học Hòa Nghĩa học tập thật tốt và đạt nhiều hoa điểm 10!`
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.endsWith('.pptx') || file.name.endsWith('.pdf') ? file.name : `${file.name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // File count per grade
  const fileCountByGrade = React.useMemo(() => {
    const counts: { [grade: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    files.forEach((f) => {
      if (counts[f.grade] !== undefined) {
        counts[f.grade]++;
      }
    });
    return counts;
  }, [files]);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800">
      {/* Navigation Header */}
      <Navbar
        user={user}
        isLoggingIn={isLoggingIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGrade={selectedGrade}
        onSelectGrade={setSelectedGrade}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Elementary School Hero Banner */}
        <HeroBanner
          onExplore={() => {
            const el = document.getElementById('grades-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          isLoggedIn={Boolean(user)}
          totalFiles={files.length}
        />

        {/* Grade Selector Section */}
        <section id="grades-section">
          <GradeSelector
            selectedGrade={selectedGrade}
            onSelectGrade={setSelectedGrade}
            fileCountByGrade={fileCountByGrade}
          />
        </section>

        {/* Filter and File Card Grid */}
        <section className="mb-12">
          <FileGrid
            files={files}
            selectedGrade={selectedGrade}
            searchQuery={searchQuery}
            onPreview={(file) => setPreviewFile(file)}
            onDownload={handleDownload}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            isLoading={isLoadingFiles}
          />
        </section>

        {/* School Motto & Activity Highlights for kids */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-md mb-8 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl shrink-0">
                🎯
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800">Mục Tiêu Chất Lượng</h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  100% bài giảng bám sát chuẩn Chương trình Giáo dục phổ thông mới 2018.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shrink-0">
                ⭐
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800">Học Tập Vui Vẻ</h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Slide tương tác, trò chơi học tập giúp các em say mê khám phá tri thức.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
                🔒
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800">An Toàn Tuyệt Đối</h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Lưu trữ trên Google Drive nội bộ của trường, phân quyền học sinh và giáo viên.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Cheerful Elementary School Footer */}
      <footer className="bg-white border-t-2 border-amber-200 text-slate-600 text-xs py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* School Identity */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                    Trường Tiểu Học Hòa Nghĩa
                  </h4>
                  <p className="text-[11px] text-amber-700 font-bold">
                    Quận Dương Kinh, Thành phố Hải Phòng
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Kho học liệu số phục vụ công tác giảng dạy của thầy cô và việc tự học, ôn luyện của
                các em học sinh từ Lớp 1 đến Lớp 5.
              </p>
            </div>

            {/* School Contact & Address */}
            <div className="space-y-2">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider text-amber-800">
                Thông Tin Liên Hệ
              </h5>
              <p className="flex items-center text-slate-500">
                <MapPin className="w-4 h-4 mr-2 text-rose-500 shrink-0" />
                <span>Phường Hòa Nghĩa, Quận Dương Kinh, TP. Hải Phòng</span>
              </p>
              <p className="flex items-center text-slate-500">
                <Phone className="w-4 h-4 mr-2 text-emerald-500 shrink-0" />
                <span>(0225) 3.860.xxx • Hotline hỗ trợ giáo viên</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Email liên hệ: c1hoanghia.duongkinh@haiphong.edu.vn
              </p>
            </div>

            {/* System Status & Motto */}
            <div className="space-y-2">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider text-amber-800">
                Khẩu Hiệu Nhà Trường
              </h5>
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-bold text-xs italic leading-relaxed">
                "Thầy mẫu mực - Trò chăm ngoan - Trường lớp hạnh phúc - Ươm mầm tương lai!"
              </div>
              <p className="text-[11px] text-slate-400 font-medium flex items-center">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1 inline" />
                Hệ thống kết nối Google Drive API v3 an toàn
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>© 2026 Trường Tiểu Học Hòa Nghĩa. Bảo lưu mọi quyền.</span>
            <span className="flex items-center">
              Thiết kế dành tặng thầy cô và các bạn nhỏ Hòa Nghĩa thân yêu{' '}
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1 inline" />
            </span>
          </div>
        </div>
      </footer>

      {/* Preview Modal for PowerPoint / PDF */}
      <PreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownload}
      />

      {/* Upload Modal for Teachers */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        accessToken={accessToken}
        driveConfig={driveConfig}
        onUploadSuccess={handleUploadSuccess}
        initialGrade={selectedGrade}
      />

      {/* Drive Folder Settings & 1-Click Setup Modal */}
      <DriveSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={driveConfig}
        onSaveConfig={handleSaveConfig}
        accessToken={accessToken}
      />

      {/* Access Denied (403 Forbidden) Notice Modal */}
      {isAccessDeniedOpen && (
        <AccessDeniedNotice
          user={user}
          onDismiss={() => setIsAccessDeniedOpen(false)}
          onSwitchAccount={() => {
            setIsAccessDeniedOpen(false);
            handleLogin();
          }}
          onUseSampleRepo={() => {
            setIsAccessDeniedOpen(false);
            setFiles(MOCK_CURRICULUM_FILES);
          }}
        />
      )}
    </div>
  );
}
