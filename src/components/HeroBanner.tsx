import React from 'react';
import { Sparkles, BookOpen, Star, Award, Heart, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onExplore: () => void;
  onOpenUpload: () => void;
  isLoggedIn: boolean;
  totalFiles: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExplore,
  onOpenUpload,
  isLoggedIn,
  totalFiles,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 p-6 sm:p-10 text-white shadow-xl shadow-amber-300/30 border-4 border-white mb-8">
      {/* Decorative cheerful background elements */}
      <div className="absolute top-2 right-12 w-20 h-20 bg-white/20 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-6 right-1/4 text-yellow-200 animate-bounce pointer-events-none select-none text-2xl">
        ⭐
      </div>
      <div className="absolute bottom-4 left-1/3 text-white/40 pointer-events-none select-none text-xl animate-pulse">
        ✏️
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Greeting & Call to actions */}
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/25 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 text-xs sm:text-sm font-extrabold tracking-wide">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>KHO BÀI GIẢNG ĐIỆN TỬ DÙNG CHUNG • TH HÒA NGHĨA</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-sm">
            Học tập hứng khởi, <br className="hidden sm:inline" />
            ươm mầm tương lai tươi sáng! 🌟
          </h2>

          <p className="text-white/90 text-sm sm:text-base font-semibold max-w-2xl leading-relaxed">
            Nơi lưu trữ và chia sẻ các bài giảng PowerPoint sinh động, phiếu bài tập PDF chất lượng cao
            từ Khối 1 đến Khối 5. Kết nối trực tiếp và đồng bộ với Google Drive của nhà trường.
          </p>

          {/* Key tags */}
          <div className="flex flex-wrap gap-2 pt-1 pb-2">
            <span className="inline-flex items-center text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-200" /> Trình chiếu PowerPoint (.pptx)
            </span>
            <span className="inline-flex items-center text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-200" /> Tài liệu PDF in ấn
            </span>
            <span className="inline-flex items-center text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-200" /> Xem trực tiếp không cần cài đặt
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExplore}
              className="px-6 py-3 bg-white text-orange-600 hover:text-orange-700 hover:bg-amber-50 font-black rounded-2xl shadow-lg shadow-black/10 hover:shadow-xl transition-all active:scale-95 text-sm flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Khám phá bài học ngay</span>
            </button>

            {isLoggedIn && (
              <button
                onClick={onOpenUpload}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-95 text-sm flex items-center space-x-2 border-2 border-emerald-400"
              >
                <span>➕ Tải lên bài giảng mới</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Cheerful School Mascot & Badges */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4">
          {/* Mascot Box */}
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border-2 border-white/50 text-center w-full max-w-xs shadow-lg transform hover:-rotate-1 transition-transform">
            <div className="w-20 h-20 mx-auto mb-3 bg-amber-100 rounded-3xl border-4 border-white shadow-inner flex items-center justify-center text-4xl select-none animate-float">
              🦉
            </div>
            <h4 className="text-base font-extrabold text-white">Bé Cú Thông Thái</h4>
            <p className="text-xs text-amber-100 font-bold mt-1">
              "Mỗi ngày một bài học hay, rạng ngời tri thức Hòa Nghĩa!"
            </p>
            <div className="mt-3 flex items-center justify-center space-x-1 text-yellow-200">
              <Star className="w-4 h-4 fill-yellow-300" />
              <Star className="w-4 h-4 fill-yellow-300" />
              <Star className="w-4 h-4 fill-yellow-300" />
              <Star className="w-4 h-4 fill-yellow-300" />
              <Star className="w-4 h-4 fill-yellow-300" />
            </div>
          </div>

          {/* Quick stats badge */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-center">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30">
              <span className="block text-2xl font-black text-white">{totalFiles}+</span>
              <span className="text-[11px] font-bold text-amber-100">Bài giảng số</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30">
              <span className="block text-2xl font-black text-white">5</span>
              <span className="text-[11px] font-bold text-amber-100">Khối Lớp (1 - 5)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
