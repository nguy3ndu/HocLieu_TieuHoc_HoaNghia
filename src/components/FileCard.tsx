import React from 'react';
import { DriveFile } from '../types';
import {
  FileText,
  Presentation,
  Download,
  Eye,
  Calendar,
  HardDrive,
  UserCheck,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface FileCardProps {
  file: DriveFile;
  onPreview: (file: DriveFile) => void;
  onDownload: (file: DriveFile) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onPreview, onDownload }) => {
  const isPowerPoint =
    file.mimeType.includes('presentation') ||
    file.name.toLowerCase().endsWith('.pptx') ||
    file.name.toLowerCase().endsWith('.ppt');
  const isPdf =
    file.mimeType.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
  const isWord =
    file.mimeType.includes('word') ||
    file.name.toLowerCase().endsWith('.docx') ||
    file.name.toLowerCase().endsWith('.doc');

  const getFormatBadge = () => {
    if (isPowerPoint) {
      return {
        label: 'PowerPoint Slide',
        bg: 'bg-orange-50 text-orange-700 border-orange-300',
        badgeBg: 'bg-orange-600',
        icon: <Presentation className="w-5 h-5 text-orange-600" />,
      };
    }
    if (isPdf) {
      return {
        label: 'Tài liệu PDF',
        bg: 'bg-rose-50 text-rose-700 border-rose-300',
        badgeBg: 'bg-rose-600',
        icon: <FileText className="w-5 h-5 text-rose-600" />,
      };
    }
    if (isWord) {
      return {
        label: 'Văn bản Word',
        bg: 'bg-blue-50 text-blue-700 border-blue-300',
        badgeBg: 'bg-blue-600',
        icon: <FileText className="w-5 h-5 text-blue-600" />,
      };
    }
    return {
      label: 'Tập tin',
      bg: 'bg-slate-50 text-slate-700 border-slate-300',
      badgeBg: 'bg-slate-600',
      icon: <FileText className="w-5 h-5 text-slate-600" />,
    };
  };

  const format = getFormatBadge();

  // Format file size
  const formatSize = (bytes?: number | string) => {
    if (!bytes) return '1.2 MB';
    const num = Number(bytes);
    if (isNaN(num)) return '1.5 MB';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Gần đây';
    try {
      const d = new Date(dateString);
      return `Ngày ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    } catch {
      return 'Gần đây';
    }
  };

  // Friendly subject color
  const getSubjectColor = (subj: string) => {
    switch (subj) {
      case 'Toán':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tiếng Việt':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Tiếng Anh':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Khoa học':
      case 'Tự nhiên & Xã hội':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Tin học':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Đạo đức':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-amber-100/80 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 relative">
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${getSubjectColor(
                file.subject
              )}`}
            >
              {file.subject}
            </span>
            <span className="text-[11px] font-extrabold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
              Lớp {file.grade}
            </span>
          </div>

          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${format.bg} flex items-center gap-1`}
          >
            {format.label}
          </span>
        </div>

        {/* File Name & Preview Icon */}
        <div className="flex items-start space-x-3 my-2">
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 group-hover:scale-110 transition-transform">
            {format.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className="text-sm sm:text-base font-extrabold text-slate-800 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2"
              title={file.name}
            >
              {file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
              {file.name}
            </p>
          </div>
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-2 leading-relaxed bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
          {file.description ||
            `Tài liệu bài giảng điện tử chính thức dành cho học sinh Khối ${file.grade} Trường Tiểu học Hòa Nghĩa.`}
        </p>

        {/* Metadata info */}
        <div className="mt-3.5 space-y-1.5 text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-slate-600">
              <UserCheck className="w-3.5 h-3.5 mr-1 text-amber-500 inline" />
              {file.author || 'Tổ chuyên môn TH Hòa Nghĩa'}
            </span>
            <span className="flex items-center text-slate-500">
              <HardDrive className="w-3.5 h-3.5 mr-1 text-slate-400 inline" />
              {formatSize(file.size)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400 inline" />
              {formatDate(file.modifiedTime)}
            </span>
            {file.downloads && (
              <span className="text-emerald-600 font-bold">
                📥 {file.downloads} lượt tải
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: Preview & Download */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t-2 border-dashed border-amber-100">
        <button
          onClick={() => onPreview(file)}
          className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center space-x-1.5 border border-amber-300 transition-all active:scale-95 shadow-sm"
        >
          <Eye className="w-4 h-4 text-amber-600" />
          <span>Xem trước</span>
        </button>

        <button
          onClick={() => onDownload(file)}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-orange-200 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Tải file về</span>
        </button>
      </div>
    </div>
  );
};
