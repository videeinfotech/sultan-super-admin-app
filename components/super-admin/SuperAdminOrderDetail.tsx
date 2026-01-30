
import React from 'react';

interface Props {
  orderId: string | null;
  onBack: () => void;
}

const SuperAdminOrderDetail: React.FC<Props> = ({ orderId, onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto">
      <header className="sticky top-0 z-10 flex items-center bg-white dark:bg-background-dark border-b dark:border-gray-800 p-4 justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
          <h2 className="text-lg font-bold">Order #{orderId || 'ORD-8829'}</h2>
        </div>
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase">Delivered</div>
      </header>

      <main className="space-y-2">
        <div className="bg-white dark:bg-background-dark p-4">
          <h3 className="text-2xl font-bold">Order Overview</h3>
          <p className="text-sm text-[#616f89] mt-1">Placed on Oct 12, 2023 at 10:30 AM</p>
        </div>

        <div className="bg-white dark:bg-background-dark p-4 flex gap-4 items-center">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">storefront</span>
          </div>
          <div>
            <p className="text-base font-medium">Main Street Store</p>
            <p className="text-sm text-[#616f89]">Branch ID: MS-001 • Downtown District</p>
          </div>
        </div>

        <div className="bg-white dark:bg-background-dark p-4">
          <h3 className="font-bold mb-4">Tracking History</h3>
          <div className="space-y-6 relative ml-3">
            <div className="absolute left-[-1.5px] top-1 h-full w-[2px] bg-primary"></div>
            <div className="flex gap-4 items-start relative">
              <span className="material-symbols-outlined text-primary bg-white dark:bg-background-dark z-10 ml-[-12px] fill-1">check_circle</span>
              <div>
                <p className="text-sm font-bold">Order Placed</p>
                <p className="text-xs text-[#616f89]">Oct 12, 10:30 AM</p>
              </div>
            </div>
            <div className="flex gap-4 items-start relative">
              <span className="material-symbols-outlined text-primary bg-white dark:bg-background-dark z-10 ml-[-12px] fill-1">check_circle</span>
              <div>
                <p className="text-sm font-bold">Delivered</p>
                <p className="text-xs text-[#616f89]">Oct 14, 11:30 AM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-background-dark p-4">
          <h3 className="font-bold mb-4">Items (2)</h3>
          <div className="divide-y dark:divide-gray-800">
            <div className="py-3 flex gap-4">
              <img src="https://picsum.photos/seed/item1/100/100" className="size-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-bold">Zoom Pegasus 39</p>
                <p className="text-xs text-[#616f89]">SKU: NIKE-ZP39-RED-10</p>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-xs text-[#616f89]">Qty: 1</span>
                  <span className="text-sm font-bold">$120.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-background-dark p-4 space-y-3">
          <h3 className="font-bold pb-2">Payment Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-[#616f89]">Subtotal</span>
            <span className="font-medium">$205.00</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t dark:border-gray-800 pt-3">
            <span>Grand Total</span>
            <span className="text-primary">$234.41</span>
          </div>
          <div className="mt-4 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="material-symbols-outlined text-gray-500">credit_card</span>
            <span className="text-xs text-[#616f89]">Paid via VISA ending in •••• 4242</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminOrderDetail;
