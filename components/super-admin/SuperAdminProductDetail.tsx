
import React from 'react';

interface Props {
  productId: string | null;
  onBack: () => void;
}

const SuperAdminProductDetail: React.FC<Props> = ({ productId, onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#dbdfe6] dark:border-gray-800">
        <div className="flex items-center p-4 justify-between">
          <div className="size-10 flex items-center justify-center cursor-pointer" onClick={onBack}>
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </div>
          <h2 className="text-lg font-bold flex-1 text-center">Inventory Detail</h2>
          <div className="w-10 flex justify-end">
            <span className="material-symbols-outlined">ios_share</span>
          </div>
        </div>
      </header>

      <main>
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar p-4 gap-3">
          <img src="https://picsum.photos/seed/shoes1/400/400" className="w-[80%] aspect-square rounded-xl shadow-sm snap-center" />
          <img src="https://picsum.photos/seed/shoes2/400/400" className="w-[80%] aspect-square rounded-xl shadow-sm snap-center" />
        </div>

        <section className="px-4 py-2">
          <h1 className="text-2xl font-extrabold">Classic Leather Sneakers</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium">SKU: CLS-992-WH</p>
            <span className="material-symbols-outlined text-sm text-[#616f89] cursor-pointer">content_copy</span>
          </div>
          <div className="flex gap-3 mt-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full">Footwear</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold uppercase rounded-full">Summer Collection</span>
          </div>
        </section>

        <section className="flex gap-4 p-4">
          <div className="flex-1 p-5 border border-[#dbdfe6] dark:border-gray-800 bg-white dark:bg-gray-900/50 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#616f89] dark:text-gray-400">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              <span className="text-sm font-medium">Total Stock</span>
            </div>
            <p className="text-2xl font-extrabold">249 units</p>
          </div>
          <div className="flex-1 p-5 border border-[#dbdfe6] dark:border-gray-800 bg-white dark:bg-gray-900/50 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#616f89] dark:text-gray-400">
              <span className="material-symbols-outlined text-primary">storefront</span>
              <span className="text-sm font-medium">Active Stores</span>
            </div>
            <p className="text-2xl font-extrabold">3 locations</p>
          </div>
        </section>

        <section className="mt-4 px-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Store Distribution</h3>
            <span className="text-xs font-bold text-primary uppercase">View Map</span>
          </div>
          <div className="rounded-xl border border-[#dbdfe6] dark:border-gray-800 bg-white dark:bg-gray-900/50 divide-y dark:divide-gray-800">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">Downtown Flagship</p>
                <p className="text-[#616f89] text-xs">Aisle 4, Shelf B</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">45 Units</p>
                <p className="text-emerald-500 text-[10px] font-bold uppercase">Healthy</p>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">Eastside Mall</p>
                <p className="text-[#616f89] text-xs">Display Window</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-red-500">4 Units</p>
                <p className="text-red-500 text-[10px] font-bold uppercase">Low Stock</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 px-4">
          <h3 className="text-lg font-bold mb-4">Stock Movement</h3>
          <div className="relative space-y-6">
            <div className="absolute left-2.5 top-2 h-full w-px bg-[#dbdfe6] dark:bg-gray-800"></div>
            <div className="relative flex gap-4 pl-8">
              <div className="absolute left-0 top-1 size-5 rounded-full border-4 border-white dark:border-gray-900 bg-primary z-10"></div>
              <div>
                <p className="text-xs font-bold text-[#616f89] uppercase">Oct 24, 2023 • 09:15 AM</p>
                <p className="text-sm font-bold">Shipment Received</p>
                <p className="text-xs text-[#616f89] mt-0.5">+50 units added via PO #9921</p>
              </div>
            </div>
            <div className="relative flex gap-4 pl-8">
              <div className="absolute left-0 top-1 size-5 rounded-full border-4 border-white dark:border-gray-900 bg-[#dbdfe6] z-10"></div>
              <div>
                <p className="text-xs font-bold text-[#616f89] uppercase">Oct 22, 2023 • 02:30 PM</p>
                <p className="text-sm font-bold">Inter-Store Transfer</p>
                <p className="text-xs text-[#616f89] mt-0.5">-10 units moved to Eastside Mall</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 w-full max-w-[430px] mx-auto bg-white/90 dark:bg-background-dark/90 p-4 border-t dark:border-gray-800 flex justify-center items-center gap-2">
        <span className="material-symbols-outlined text-sm text-[#616f89]">lock</span>
        <span className="text-[10px] font-bold text-[#616f89] uppercase tracking-widest">Read-Only View</span>
      </footer>
    </div>
  );
};

export default SuperAdminProductDetail;
