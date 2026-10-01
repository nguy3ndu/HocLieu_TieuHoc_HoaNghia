import React from 'react';
import { ShieldAlert, RefreshCw, Mail, CheckCircle2, X } from 'lucide-react';
import { User } from 'firebase/auth';

interface AccessDeniedNoticeProps {
  user: User | null;
  onDismiss: () => void;
  onSwitchAccount: () => void;
  onUseSampleRepo: () => void;
}

export const AccessDeniedNotice: React.FC<AccessDeniedNoticeProps> = ({
  user,
  onDismiss,
  onSwitchAccount,
  onUseSampleRepo,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border-4 border-rose-300 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto shadow-inner border-2 border-rose-200 animate-bounce">
            🚫
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Thông Báo Quyền Truy Cập (403 Forbidden)
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-2">
              Bạn chưa có quyền xem thư mục này
            </h3>
          </div>

          <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200 text-left space-y-2 text-xs text-rose-900">
            <p className="font-bold">
              Tài khoản hiện tại: <span className="font-mono text-rose-700 underline">{user?.email || 'Chưa xác định'}</span>
            </p>
            <p className="text-slate-600 leading-relaxed">
              Thư mục Google Drive này của Trường Tiểu Học Hòa Nghĩa được cài đặt ở chế độ <strong>Hạn chế (Restricted)</strong> để bảo vệ kho học liệu và an toàn thông tin cho học sinh.
            </p>
          </div>

          {/* Steps to resolve */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-left space-y-2">
            <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
              <span>💡 Cách khắc phục:</span>
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li>
                <strong>Học sinh / Phụ huynh:</strong> Vui lòng nhắn tin cho Giáo viên chủ nhiệm để thêm email của bạn vào danh sách được xem thư mục (Quyền Viewer).
              </li>
              <li>
                <strong>Thầy cô giáo:</strong> Nhờ quản trị viên Google Drive của trường cấp quyền chỉnh sửa (Quyền Editor).
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={onUseSampleRepo}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md shadow-amber-200 transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xem tài liệu mẫu công khai</span>
            </button>

            <button
              onClick={onSwitchAccount}
              className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Đổi tài khoản Gmail khác</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
