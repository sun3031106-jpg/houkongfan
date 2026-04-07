import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'red' | 'amber' | 'indigo' | 'purple';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = '确认',
  cancelText = '取消',
  confirmColor = 'amber',
}) => {
  if (!isOpen) return null;

  const confirmColorClasses = {
    red: 'bg-red-600 hover:bg-red-700 border-red-500',
    amber: 'bg-amber-500 hover:bg-amber-600 border-amber-400',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 border-indigo-500',
    purple: 'bg-purple-600 hover:bg-purple-700 border-purple-500',
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-slate-700 max-w-md w-full mx-4 transition-all duration-500 transform scale-100 hover:scale-[1.02]">
        <h2 className="text-2xl font-bold text-amber-400 mb-4 text-center">{title}</h2>
        <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600 mb-6">
          <p className="text-slate-300 text-lg leading-relaxed text-center whitespace-pre-wrap">{message}</p>
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={onCancel}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 border border-slate-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`${confirmColorClasses[confirmColor]} text-slate-900 font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 border`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;