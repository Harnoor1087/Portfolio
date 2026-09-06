import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemTitle: string;
  itemType?: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  itemTitle,
  itemType = 'project',
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#080808] border border-white/10 rounded p-6 sm:p-7 shadow-2xl relative"
      >
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-[10px] font-mono uppercase tracking-widest text-rose-400 mb-1">
          DESTRUCTIVE ACTION
        </div>

        <h3 className="text-xl font-bold text-white mb-2 font-sans">
          Delete {itemType === 'project' ? 'Project' : 'Item'}?
        </h3>

        <p className="text-xs sm:text-sm text-white/70 mb-6 leading-relaxed font-light">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold text-white underline decoration-rose-500/50">
            "{itemTitle}"
          </span>
          ? This will remove the record from the database and public portfolio display immediately.
        </p>

        <div className="flex items-center gap-3">
          <button
            id="delete-cancel-btn"
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="delete-confirm-btn"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
