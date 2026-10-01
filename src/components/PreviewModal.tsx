import React, { useState } from 'react';
import { DriveFile } from '../types';
import {
  X,
  Download,
  ExternalLink,
  Presentation,
  FileText,
  Maximize2,
  Calendar,
  User,
  HardDrive,
  Award,
  Sparkles,
} from 'lucide-react';

interface PreviewModalProps {
  file: DriveFile | null;
  onClose: () => void;
  onDownload: (file: DriveFile) => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  file,
  onClose,
  onDownload,
}) => {
  if (!file) return null;

  const [isLoadingIframe, setIsLoadingIframe] = useState(true);

  const isPowerPoint =
    file.mimeType.includes('presentation') ||
    file.name.toLowerCase().endsWith('.pptx') ||
    file.name.toLowerCase().endsWith('.ppt');
  const isPdf =
    file.mimeType.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');

  // Generate preview URL
  // If it's a Google Drive file, embed link is https://drive.google.com/file/d/{id}/preview
  // Or webViewLink
  let previewUrl = file.webViewLink;
  if (!previewUrl || previewUrl.includes('sample_ppt') || file.isMock) {
    if (isPdf) {
      // Use standard browser PDF preview
      previewUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    } else {
      // For mock powerpoint, use a safe preview or Google Docs viewer demo
      previewUrl = 'https://docs.google.com/presentation/d/e/2PACX-1vT3r.../embed?start=false&loop=false';
    }
  } else if (file.id && !file.isMock) {
    previewUrl = `https://drive.google.com/file/d/${file.id}/preview`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl border-4 border-amber-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-4 sm:px-6 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center space-x-3 min-w-0 pr-4">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/40">
              {isPowerPoint ? (
                <Presentation className="w-5 h-5 text-white" />
              ) : (
                <FileText className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-100 bg-white/20 px-2 py-0.5 rounded-full inline-block">
                Môn {file.subject} • Khối Lớp {file.grade}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white truncate drop-shadow-sm">
                {file.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDownload(file)}
              className="px-3.5 py-1.5 rounded-xl bg-white text-orange-600 hover:bg-amber-50 font-black text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Tải về máy</span>
            </button>

            {file.webViewLink && (
              <a
                href={file.webViewLink}
                target="_blank"
                rel="noreferrer"
                title="Mở trong tab mới trên Google Drive"
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition-all text-xs flex items-center"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-rose-500 hover:text-white text-white font-bold transition-all ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
          {/* If file is mock PowerPoint or iframe cannot be directly embedded */}
          {file.isMock && isPowerPoint ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-amber-50/50 to-orange-50/50 overflow-y-auto">
              {/* Illustrated Presentation Slide Simulator */}
              <div className="w-full max-w-3xl aspect-[16/9] bg-white rounded-3xl shadow-xl border-4 border-amber-300 p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
                
                {/* School Header on Slide */}
                <div className="flex items-center justify-between border-b-2 border-amber-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🏫</span>
                    <span className="text-xs font-black text-slate-700 uppercase">
                      Trường Tiểu Học Hòa Nghĩa
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    Môn {file.subject} • Lớp {file.grade}
                  </span>
                </div>

                {/* Slide Main Content */}
                <div className="my-auto space-y-4 py-4">
                  <div className="inline-block p-3 bg-amber-100 text-amber-800 rounded-2xl text-2xl font-black mb-2 animate-bounce">
                    ✨ BÀI GIẢNG ĐIỆN TỬ
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                    {file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                  </h2>
                  <p className="text-sm font-semibold text-slate-600 max-w-xl mx-auto leading-relaxed">
                    {file.description ||
                      'Bài giảng tích hợp trò chơi tương tác, câu hỏi trắc nghiệm và hình ảnh trực quan giúp các em học sinh tiếp thu bài học dễ dàng.'}
                  </p>

                  <div className="flex items-center justify-center space-x-4 pt-2 text-xs font-bold text-slate-500">
                    <span className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1 text-amber-600 inline" />
                      {file.author || 'Tổ chuyên môn TH Hòa Nghĩa'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Award className="w-3.5 h-3.5 mr-1 text-emerald-600 inline" />
                      Giáo án chuẩn GDPT 2018
                    </span>
                  </div>
                </div>

                {/* Slide Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-semibold">
                  <span>Trang 1 / 18 • Slide Giới thiệu & Mục tiêu bài học</span>
                  <span className="text-amber-600 font-bold">Thầy cô và các em bấm "Tải về" để mở toàn bộ file trong PowerPoint</span>
                </div>
              </div>

              {/* Callout action */}
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => onDownload(file)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-lg shadow-orange-200 hover:shadow-xl transition-all active:scale-95 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải bài giảng PowerPoint (.pptx) về máy</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Iframe for Google Drive or PDF embed */
            <div className="flex-1 w-full h-full relative">
              {isLoadingIframe && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                  <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs font-extrabold text-slate-600">
                    Đang nạp bản xem trước tài liệu...
                  </p>
                </div>
              )}
              <iframe
                src={previewUrl}
                title={file.name}
                className="w-full h-full border-none"
                onLoad={() => setIsLoadingIframe(false)}
                allow="autoplay"
              />
            </div>
          )}
        </div>

        {/* Modal Footer with metadata */}
        <div className="bg-amber-50/80 border-t border-amber-200 px-6 py-3 flex flex-wrap items-center justify-between text-xs text-slate-600 font-medium gap-2">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-slate-700">Tác giả: {file.author || 'Tổ chuyên môn'}</span>
            <span>•</span>
            <span>Định dạng: {file.mimeType.split('/').pop() || 'Tài liệu'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              ✓ Đã kiểm duyệt chuyên môn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
