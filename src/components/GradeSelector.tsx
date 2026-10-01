import React from 'react';
import { GRADES_DATA } from '../data/mockCurriculum';
import { Sparkles, Layers, Folder } from 'lucide-react';

interface GradeSelectorProps {
  selectedGrade: number; // 0 = all grades, 1-5 = specific grade
  onSelectGrade: (grade: number) => void;
  fileCountByGrade: { [grade: number]: number };
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  selectedGrade,
  onSelectGrade,
  fileCountByGrade,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span>Khối Lớp Học Tập</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
              Chọn khối lớp
            </span>
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Bấm chọn khối lớp tương ứng với thư mục lưu trữ trên Google Drive
          </p>
        </div>

        {/* View All Button */}
        <button
          onClick={() => onSelectGrade(0)}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border-2 ${
            selectedGrade === 0
              ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:bg-amber-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Xem tất cả khối lớp</span>
        </button>
      </div>

      {/* Grid of Grade cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {GRADES_DATA.map((item) => {
          const isSelected = selectedGrade === item.grade;
          const count = fileCountByGrade[item.grade] || 0;

          return (
            <button
              key={item.grade}
              onClick={() => onSelectGrade(item.grade)}
              className={`relative overflow-hidden text-left p-4 rounded-3xl transition-all duration-200 transform hover:-translate-y-1 group border-3 ${
                isSelected
                  ? `bg-white border-amber-500 shadow-xl shadow-amber-200/60 ring-4 ring-amber-200/50 scale-[1.02]`
                  : `bg-white/80 hover:bg-white border-slate-200/80 hover:border-amber-300 shadow-sm hover:shadow-md`
              }`}
            >
              {/* Top Accent color line */}
              <div className={`h-2 w-full rounded-full bg-gradient-to-r ${item.color} mb-3`} />

              <div className="flex items-start justify-between">
                <span className="text-3xl select-none group-hover:scale-125 transition-transform duration-200">
                  {item.icon}
                </span>
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-700'
                  }`}
                >
                  <Folder className="w-3 h-3 inline" />
                  {count} bài
                </span>
              </div>

              <div className="mt-3">
                <h4
                  className={`text-base font-black tracking-tight leading-tight ${
                    isSelected ? 'text-amber-700' : 'text-slate-800'
                  }`}
                >
                  {item.name}
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold line-clamp-1 mt-0.5">
                  {item.subTitle}
                </p>
              </div>

              {isSelected && (
                <div className="mt-2.5 flex items-center space-x-1 text-[11px] font-bold text-amber-600 bg-amber-50 rounded-lg px-2 py-0.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Đang xem thư mục này</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
