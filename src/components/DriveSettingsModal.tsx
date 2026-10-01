import React, { useState } from 'react';
import { DriveConfigState } from '../types';
import { setupSchoolDriveStructure } from '../services/driveService';
import { GRADES_DATA } from '../data/mockCurriculum';
import {
  X,
  FolderCog,
  Wand2,
  HelpCircle,
  Save,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface DriveSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DriveConfigState;
  onSaveConfig: (newConfig: DriveConfigState) => void;
  accessToken: string | null;
}

export const DriveSettingsModal: React.FC<DriveSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  accessToken,
}) => {
  if (!isOpen) return null;

  const [rootFolderId, setRootFolderId] = useState(config.rootFolderId);
  const [gradeFolderIds, setGradeFolderIds] = useState(config.gradeFolderIds);
  const [isUsingMockIfEmpty, setIsUsingMockIfEmpty] = useState(config.isUsingMockIfEmpty);

  const [isCreatingStructure, setIsCreatingStructure] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleGradeIdChange = (grade: number, id: string) => {
    setGradeFolderIds((prev) => ({
      ...prev,
      [grade]: id.trim(),
    }));
  };

  const handleAutoCreate = async () => {
    if (!accessToken) {
      setStatusMessage({
        type: 'error',
        text: 'Vui lòng đăng nhập Google trước để tạo thư mục tự động trên Drive của bạn!',
      });
      return;
    }

    try {
      setIsCreatingStructure(true);
      setStatusMessage(null);
      const res = await setupSchoolDriveStructure(accessToken);
      setRootFolderId(res.rootFolderId);
      setGradeFolderIds(res.gradeFolderIds);
      setStatusMessage({
        type: 'success',
        text: 'Đã tạo thành công thư mục "Kho Học Liệu - Tiểu Học Hòa Nghĩa" và 5 thư mục Khối Lớp trên Google Drive của bạn!',
      });
    } catch (err: any) {
      console.error('Error creating folder structure:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Không thể tạo thư mục tự động. Vui lòng kiểm tra quyền Google Drive.',
      });
    } finally {
      setIsCreatingStructure(false);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      rootFolderId: rootFolderId.trim(),
      gradeFolderIds,
      isUsingMockIfEmpty,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/40">
              <FolderCog className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">
                Cài Đặt Kho Google Drive Của Trường
              </h3>
              <p className="text-xs text-amber-100 font-semibold">
                Liên kết và phân quyền thư mục lưu trữ cho Tiểu Học Hòa Nghĩa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-start space-x-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border-2 border-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Quick 1-Click Bootstrap Tool */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-3xl border-2 border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🪄</span>
                <h4 className="text-sm font-black text-slate-800">
                  Khởi Tạo Tự Động Thư Mục Trên Google Drive
                </h4>
              </div>
              <span className="text-[11px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                Tiện ích 1-Click
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Chưa có thư mục trên Drive? Nhấn nút dưới đây, hệ thống sẽ tự động tạo thư mục gốc
              <strong> "Kho Học Liệu - Tiểu Học Hòa Nghĩa"</strong> cùng 5 thư mục con từ <strong>Lớp 1 đến Lớp 5</strong> trên Google Drive của bạn!
            </p>

            <button
              onClick={handleAutoCreate}
              disabled={isCreatingStructure}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md shadow-amber-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>
                {isCreatingStructure
                  ? 'Đang tạo thư mục trên Google Drive...'
                  : 'Tự động tạo 5 Thư mục Lớp 1 - 5 ngay trên Drive của tôi'}
              </span>
            </button>
          </div>

          {/* Manual Folder IDs Configuration */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <span>📁 Cấu hình mã ID thư mục thủ công</span>
            </h4>

            {/* Root Folder ID */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                ID Thư mục gốc ("Kho Học Liệu Tiểu Học"):
              </label>
              <input
                type="text"
                value={rootFolderId}
                onChange={(e) => setRootFolderId(e.target.value)}
                placeholder="Ví dụ: 1BxiMVs0XRA5nFMdKvBHKr... (lấy từ thanh địa chỉ Drive)"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-amber-400 font-mono text-xs text-slate-800 focus:outline-none"
              />
            </div>

            {/* Grade 1 to 5 Subfolder IDs */}
            <div className="space-y-2.5">
              <label className="block text-xs font-black text-slate-700">
                ID Thư mục con từng Khối Lớp (Lớp 1 - 5):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GRADES_DATA.map((g) => (
                  <div key={g.grade} className="flex items-center space-x-2">
                    <span className="w-16 text-xs font-bold text-slate-600 shrink-0">
                      Lớp {g.grade}:
                    </span>
                    <input
                      type="text"
                      value={gradeFolderIds[g.grade] || ''}
                      onChange={(e) => handleGradeIdChange(g.grade, e.target.value)}
                      placeholder={`ID thư mục Lớp ${g.grade}`}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-400 font-mono text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle fallback mock display */}
            <div className="pt-2 flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <p className="text-xs font-black text-slate-800">
                  Hiển thị tài liệu bài giảng mẫu chuẩn
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Giữ các bài giảng mẫu đầy đủ trong kho để tham khảo khi chưa có tài liệu mới trên Drive
                </p>
              </div>
              <input
                type="checkbox"
                checked={isUsingMockIfEmpty}
                onChange={(e) => setIsUsingMockIfEmpty(e.target.checked)}
                className="w-5 h-5 rounded-lg text-amber-500 focus:ring-amber-400 cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Guide on permissions */}
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs space-y-2">
            <h5 className="font-black text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Hướng dẫn phân quyền trên Google Drive (Chuẩn an toàn):</span>
            </h5>
            <ol className="list-decimal list-inside text-blue-800 space-y-1 pl-1">
              <li>Mở thư mục trên Google Drive -&gt; Bấm nút <strong>Chia sẻ (Share)</strong>.</li>
              <li>Chế độ chung: Giữ là <strong>Hạn chế (Restricted)</strong>, tuyệt đối không để "Bất kỳ ai có đường liên kết".</li>
              <li>Thêm email Thầy/Cô giáo viên: Chọn quyền <strong>Người chỉnh sửa (Editor)</strong> để được phép tải bài lên.</li>
              <li>Thêm email Học sinh / Phụ huynh: Chọn quyền <strong>Người xem (Viewer)</strong> để chỉ xem và tải về.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md shadow-amber-200 transition-all flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Lưu cấu hình</span>
          </button>
        </div>
      </div>
    </div>
  );
};
