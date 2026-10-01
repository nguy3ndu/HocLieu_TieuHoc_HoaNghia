import React, { useState, useRef } from 'react';
import { UploadProgress, DriveConfigState, DriveFile } from '../types';
import { uploadDriveFile, DriveApiError } from '../services/driveService';
import { GRADES_DATA } from '../data/mockCurriculum';
import confetti from 'canvas-confetti';
import {
  X,
  Upload,
  FileText,
  Presentation,
  CheckCircle2,
  AlertCircle,
  Folder,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string | null;
  driveConfig: DriveConfigState;
  onUploadSuccess: (newFile: DriveFile) => void;
  initialGrade?: number;
}

const SUBJECT_OPTIONS = [
  'Toán',
  'Tiếng Việt',
  'Tiếng Anh',
  'Khoa học',
  'Tự nhiên & Xã hội',
  'Lịch sử & Địa lý',
  'Đạo đức',
  'Tin học',
  'Mỹ thuật & Âm nhạc',
  'Hoạt động trải nghiệm',
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  accessToken,
  driveConfig,
  onUploadSuccess,
  initialGrade = 1,
}) => {
  if (!isOpen) return null;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetGrade, setTargetGrade] = useState<number>(initialGrade > 0 ? initialGrade : 1);
  const [targetSubject, setTargetSubject] = useState<string>('Toán');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Upload progress tracking
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    if (!lessonTitle) {
      // Auto populate clean title from filename
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      setLessonTitle(cleanName);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (!accessToken) {
      setErrorMessage('Vui lòng đăng nhập bằng tài khoản Google để tải bài giảng lên Google Drive!');
      setUploadStatus('error');
      return;
    }

    // Determine target folder ID
    const targetFolderId = driveConfig.gradeFolderIds[targetGrade] || driveConfig.rootFolderId;

    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadPercent(0);
      setErrorMessage(null);

      // Perform real Google Drive multipart upload with progress tracking
      const uploadedFile = await uploadDriveFile(
        selectedFile,
        targetFolderId,
        accessToken,
        targetGrade,
        targetSubject,
        (percent) => {
          setUploadPercent(percent);
        }
      );

      // Set extra metadata
      uploadedFile.name = lessonTitle || selectedFile.name;
      uploadedFile.description = description || `Bài giảng ${targetSubject} Lớp ${targetGrade}`;
      uploadedFile.subject = targetSubject;
      uploadedFile.grade = targetGrade;

      setUploadStatus('success');
      setUploadPercent(100);

      // Trigger confetti celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback if canvas not available
      }

      setTimeout(() => {
        onUploadSuccess(uploadedFile);
        handleReset();
        onClose();
      }, 1800);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadStatus('error');
      if (err instanceof DriveApiError && err.statusCode === 403) {
        setErrorMessage(
          'Email của bạn không có quyền Chỉnh sửa (Editor) trên thư mục Google Drive của trường. Vui lòng liên hệ Thầy/Cô quản trị để được cấp quyền tải lên!'
        );
      } else {
        setErrorMessage(
          err.message || 'Đã có lỗi xảy ra trong quá trình tải lên. Vui lòng kiểm tra lại kết nối mạng.'
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setLessonTitle('');
    setDescription('');
    setUploadPercent(0);
    setUploadStatus('idle');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border-4 border-emerald-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/40">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">
                Tải Lên Bài Giảng Điện Tử
              </h3>
              <p className="text-xs text-emerald-100 font-semibold">
                Dành cho Giáo viên Trường Tiểu Học Hòa Nghĩa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Message / Error Banner */}
          {uploadStatus === 'error' && errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs sm:text-sm font-bold flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block text-rose-900">
                  Không thể tải lên tài liệu!
                </span>
                <p className="mt-1 leading-relaxed text-rose-700">{errorMessage}</p>
                <div className="mt-2 text-[11px] text-rose-600 bg-rose-100/60 p-2 rounded-lg font-normal">
                  💡 Gợi ý: Yêu cầu quản trị viên Google Drive của trường cấp quyền "Người chỉnh sửa" (Editor) cho tài khoản Gmail của thầy cô.
                </div>
              </div>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-center space-y-2 animate-in zoom-in-95">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                🎉
              </div>
              <h4 className="text-base font-black text-emerald-900">
                Tải lên Google Drive thành công rực rỡ!
              </h4>
              <p className="text-xs text-emerald-700 font-semibold">
                Bài giảng đã được lưu vào thư mục Khối Lớp {targetGrade} và sẵn sàng cho các em học sinh học tập!
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Dropzone */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Chọn file từ máy tính (.pptx, .pdf, .docx):</span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  Tối đa 50MB
                </span>
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-3 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pptx,.ppt,.pdf,.docx,.doc,.xlsx,.mp4"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-3 text-left">
                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                      {selectedFile.name.endsWith('.pptx') || selectedFile.name.endsWith('.ppt') ? (
                        <Presentation className="w-6 h-6" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 font-semibold">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Bấm để đổi file khác
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-inner text-xl">
                      📁
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-700">
                      Kéo thả file bài giảng vào đây, hoặc{' '}
                      <span className="text-emerald-600 underline">bấm để chọn file</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-semibold">
                      Hỗ trợ Slide PowerPoint (.pptx), Bài giảng PDF (.pdf), Giáo án (.docx)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Target Grade and Subject Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Grade Selection */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Khối Lớp đích (Thư mục Drive):
                </label>
                <select
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 font-bold text-xs text-slate-800 focus:outline-none"
                >
                  {GRADES_DATA.map((g) => (
                    <option key={g.grade} value={g.grade}>
                      {g.name} - {g.subTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Môn học:
                </label>
                <select
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 font-bold text-xs text-slate-800 focus:outline-none"
                >
                  {SUBJECT_OPTIONS.map((subj) => (
                    <option key={subj} value={subj}>
                      Môn {subj}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lesson Title Input */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Tên bài giảng hiển thị:
              </label>
              <input
                type="text"
                placeholder="VD: Toán 2 - Bài 14: Bảng nhân 5"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 font-bold text-xs text-slate-800 focus:outline-none"
                required
              />
            </div>

            {/* Description textarea */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Ghi chú / Hướng dẫn bài học (tùy chọn):
              </label>
              <textarea
                rows={2}
                placeholder="Mục tiêu bài học, yêu cầu chuẩn bị đồ dùng..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 font-medium text-xs text-slate-800 focus:outline-none resize-none"
              />
            </div>

            {/* Upload Progress Bar (when uploading) */}
            {isUploading && (
              <div className="space-y-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between text-xs font-black text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Đang tải lên Google Drive của trường...</span>
                  </span>
                  <span>{uploadPercent}%</span>
                </div>
                <div className="w-full h-3 bg-emerald-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-3 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Đang gửi dữ liệu...' : 'Bắt đầu tải lên Drive'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
