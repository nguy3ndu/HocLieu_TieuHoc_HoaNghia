import React from 'react';
import { User } from 'firebase/auth';
import {
  BookOpen,
  Upload,
  LogOut,
  FolderCog,
  Search,
  School,
  Sparkles,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';

interface NavbarProps {
  user: User | null;
  isLoggingIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGrade: number;
  onSelectGrade: (grade: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isLoggingIn,
  onLogin,
  onLogout,
  onOpenUpload,
  onOpenSettings,
  searchQuery,
  onSearchChange,
  selectedGrade,
  onSelectGrade,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm">
      {/* Top cheerful school ribbon */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white text-xs py-1 px-4 font-bold flex items-center justify-between shadow-inner">
        <div className="flex items-center space-x-2">
          <School className="w-3.5 h-3.5 inline animate-bounce" />
          <span>PHÒNG GD&ĐT QUẬN DƯƠNG KINH • TRƯỜNG TIỂU HỌC HÒA NGHĨA</span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-[11px]">
          <span>🎒 Năm học 2025 - 2026</span>
          <span>•</span>
          <span>🌈 Thi đua dạy tốt - Học tốt</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & School Branding */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onSelectGrade(0)}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-200 group-hover:scale-105 transition-transform border-2 border-white ring-2 ring-amber-300">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  Tiểu Học Hòa Nghĩa
                </span>
                <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" /> Google Drive
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1 group-hover:text-amber-600 transition-colors">
                Kho Học Liệu Số
                <Sparkles className="w-4 h-4 text-amber-500 inline" />
              </h1>
            </div>
          </div>

          {/* Quick Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm bài giảng, môn học, tác giả..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/50 hover:bg-amber-50 focus:bg-white text-sm text-slate-800 rounded-full border-2 border-amber-200 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200/50 transition-all font-medium placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-200/60 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action buttons & User profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Drive Config button */}
            <button
              onClick={onOpenSettings}
              title="Cài đặt kết nối Google Drive của trường"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-xs font-bold border border-slate-200 hover:border-amber-300 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <FolderCog className="w-4 h-4 text-amber-600" />
              <span className="hidden lg:inline">Cài đặt Drive</span>
            </button>

            {user ? (
              <>
                {/* Upload Button for teachers */}
                <button
                  onClick={onOpenUpload}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-200 hover:shadow-lg flex items-center space-x-1.5 transition-all transform active:scale-95 border border-emerald-400"
                >
                  <Upload className="w-4 h-4" />
                  <span>Tải bài giảng lên</span>
                </button>

                {/* Logged in User Card */}
                <div className="flex items-center bg-amber-50/80 pl-2 pr-1 py-1 rounded-2xl border-2 border-amber-200 shadow-sm">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Avatar'}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm ring-1 ring-amber-300 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-300 text-amber-800 flex items-center justify-center font-bold text-sm">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}

                  <div className="hidden sm:block ml-2 mr-2 text-left">
                    <p className="text-xs font-extrabold text-slate-800 leading-tight max-w-[120px] truncate">
                      {user.displayName || 'Thành viên'}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full inline-block">
                      Giáo viên / Học sinh
                    </span>
                  </div>

                  <button
                    onClick={onLogout}
                    title="Đăng xuất khỏi tài khoản"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              /* Google Sign In Button */
              <button
                onClick={onLogin}
                disabled={isLoggingIn}
                className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                {/* Official Google SVG Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"
                  />
                </svg>
                <div className="text-left">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-700 group-hover:text-amber-700 transition-colors">
                    {isLoggingIn ? 'Đang kết nối...' : 'Đăng nhập Google'}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
