'use client';

import dynamic from 'next/dynamic';
import type { StoreLocation } from '@/lib/types';

interface StoreMapProps {
  stores: StoreLocation[];
  selectedStore?: StoreLocation | null;
  onStoreSelect?: (store: StoreLocation) => void;
  className?: string;
}

const StoreMapComponent = dynamic(
  () => import('./store-map'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-gray-500">지도를 로딩중입니다...</p>
        </div>
      </div>
    )
  }
);

const StoreMap = (props: StoreMapProps) => {
  return <StoreMapComponent {...props} />;
};

export default StoreMap;