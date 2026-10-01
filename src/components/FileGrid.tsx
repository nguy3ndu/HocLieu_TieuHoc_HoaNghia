import React, { useState, useMemo } from 'react';
import { DriveFile, SubjectName } from '../types';
import { SUBJECT_LIST } from '../data/mockCurriculum';
import { FileCard } from './FileCard';
import {
  Filter,
  Presentation,
  FileText,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';

interface FileGridProps {
  files: DriveFile[];
  selectedGrade: number;
  searchQuery: string;
  onPreview: (file: DriveFile) => void;
  onDownload: (file: DriveFile) => void;
  onOpenUpload: () => void;
  isLoading: boolean;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  selectedGrade,
  searchQuery,
  onPreview,
  onDownload,
  onOpenUpload,
  isLoading,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Tất cả môn');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'ppt' | 'pdf' | 'word'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('newest');

  // Filter and sort files
  const filteredFiles = useMemo(() => {
    return files
      .filter((file) => {
        // Grade filter
        if (selectedGrade !== 0 && file.grade !== selectedGrade) {
          return false;
        }

        // Subject filter
        if (selectedSubject !== 'Tất cả môn' && file.subject !== selectedSubject) {
          return false;
        }

        // Format filter
        if (selectedFormat === 'ppt') {
          const isPpt =
            file.mimeType.includes('presentation') ||
            file.name.toLowerCase().endsWith('.pptx') ||
            file.name.toLowerCase().endsWith('.ppt');
          if (!isPpt) return false;
        } else if (selectedFormat === 'pdf') {
          const isPdf =
            file.mimeType.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
          if (!isPdf) return false;
        } else if (selectedFormat === 'word') {
          const isDoc =
            file.mimeType.includes('word') ||
            file.name.toLowerCase().endsWith('.docx') ||
            file.name.toLowerCase().endsWith('.doc');
          if (!isDoc) return false;
        }

        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchName = file.name.toLowerCase().includes(q);
          const matchSubject = file.subject.toLowerCase().includes(q);
          const matchAuthor = (file.author || '').toLowerCase().includes(q);
          const matchDesc = (file.description || '').toLowerCase().includes(q);
          if (!matchName && !matchSubject && !matchAuthor && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return (
            new Date(b.modifiedTime || 0).getTime() -
            new Date(a.modifiedTime || 0).getTime()
          );
        }
        if (sortBy === 'popular') {
          return (b.downloads || 0) - (a.downloads || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [files, selectedGrade, selectedSubject, selectedFormat, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filtering Toolbar */}
      <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-sm space-y-4">
        {/* Subject pills row */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-slate-700 mb-2.5">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Lọc theo môn học:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {SUBJECT_LIST.map((subject) => {
              const active = selectedSubject === subject;
              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all border-2 ${
                    active
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-amber-50/50 hover:bg-amber-100/70 text-slate-700 border-amber-200/60'
                  }`}
                >
                  {subject}
                </button>
              );
            })}
          </div>
        </div>

        {/* Format tabs and Sort dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* File Format Buttons */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSelectedFormat('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                selectedFormat === 'all'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tất cả file</span>
            </button>
            <button
              onClick={() => setSelectedFormat('ppt')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                selectedFormat === 'ppt'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-orange-600'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>PowerPoint (.pptx)</span>
            </button>
            <button
              onClick={() => setSelectedFormat('pdf')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                selectedFormat === 'pdf'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tài liệu PDF</span>
            </button>
          </div>

          {/* Sort selection */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-600">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:outline-none focus:border-amber-400 text-xs"
            >
              <option value="newest">Mới cập nhật nhất</option>
              <option value="popular">Nhiều lượt tải nhất</option>
              <option value="name">Tên bài học (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Status Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
          <span>
            {selectedGrade === 0 ? 'Tất cả bài giảng' : `Bài giảng Khối Lớp ${selectedGrade}`}
          </span>
          <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300">
            {filteredFiles.length} tài liệu
          </span>
        </h3>

        {searchQuery && (
          <span className="text-xs text-slate-500 font-semibold">
            Kết quả tìm kiếm cho: <span className="font-bold text-amber-700">"{searchQuery}"</span>
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-5 border-2 border-amber-100 animate-pulse space-y-4 shadow-sm"
            >
              <div className="h-5 bg-amber-100/60 rounded-full w-2/3" />
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-14 bg-slate-100 rounded-xl" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-9 bg-amber-100/50 rounded-xl" />
                <div className="h-9 bg-orange-100/50 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredFiles.length > 0 ? (
        /* File Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onPreview={onPreview}
              onDownload={onDownload}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 border-2 border-dashed border-amber-200 text-center max-w-lg mx-auto shadow-sm my-8">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
            🔍
          </div>
          <h4 className="text-lg font-black text-slate-800">Không tìm thấy bài giảng phù hợp</h4>
          <p className="text-xs text-slate-500 font-semibold mt-1 max-w-xs mx-auto">
            Không có file bài giảng nào khớp với điều kiện lọc hiện tại. Thầy cô có thể tải lên tài liệu mới!
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedSubject('Tất cả môn');
                setSelectedFormat('all');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-colors"
            >
              Đặt lại bộ lọc
            </button>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-colors"
            >
              Tải bài giảng lên
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
