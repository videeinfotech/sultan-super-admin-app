
import React, { useEffect, useState, createContext, useContext } from 'react';

interface ConfirmOptions {
    message: string;
    onConfirm: () => void;
    title?: string;
}

interface ToastContextType {
    showToast: (type: 'success' | 'failed' | 'info', message: string) => void;
    confirm: (options: ConfirmOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'failed' | 'info' } | null>(null);
    const [confirmData, setConfirmData] = useState<ConfirmOptions | null>(null);

    const showToast = (type: 'success' | 'failed' | 'info', message: string) => {
        setToast({ message, type });
    };

    const confirm = (options: ConfirmOptions) => {
        setConfirmData(options);
    };

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <ToastContext.Provider value={{ showToast, confirm }}>
            {children}
            {toast && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[360px] animate-in slide-in-from-top duration-500 transition-all">
                    <div className={`
                        px-4 py-3 rounded-2xl shadow-xl backdrop-blur-xl flex items-center gap-3 border
                        ${toast.type === 'success' ? 'bg-[#10b981]/90 border-[#34d399]/30 text-white' :
                            toast.type === 'failed' ? 'bg-[#ef4444]/90 border-[#f87171]/30 text-white' :
                                'bg-[#3b82f6]/90 border-[#60a5fa]/30 text-white'}
                    `}>
                        <div className="size-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined !text-[20px]">
                                {toast.type === 'success' ? 'verified' : toast.type === 'failed' ? 'dangerous' : 'info'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold leading-tight">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-base">close</span>
                        </button>
                    </div>
                </div>
            )}

            {confirmData && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-[320px] bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                        <div className="size-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h3 className="text-xl font-black mb-2">{confirmData.title || 'Are you sure?'}</h3>
                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">{confirmData.message}</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => { confirmData.onConfirm(); setConfirmData(null); }}
                                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setConfirmData(null)}
                                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-500 py-4 rounded-2xl font-black active:scale-95 transition-transform"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};
