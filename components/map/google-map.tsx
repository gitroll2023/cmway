'use client';

import { useEffect, useState } from 'react';
import type { StoreLocation } from '@/lib/types';

interface GoogleMapProps {
  stores: StoreLocation[];
  selectedStore?: StoreLocation | null;
  onStoreSelect?: (store: StoreLocation) => void;
  className?: string;
}

const GoogleMap = ({ stores, selectedStore, onStoreSelect, className = '' }: GoogleMapProps) => {
  // 광주광역시 서구 월드컵4강로 186-1 정확한 좌표: 35.152841, 126.869796
  const gwangjuMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1631.2!2d126.869796!3d35.152841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDA5JzEwLjIiTiAxMjbCsDUyJzExLjMiRQ!5e0!3m2!1sko!2skr!4v1`;

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={gwangjuMapUrl}
        className="rounded-lg"
      />
      
      {/* Store Info Overlay */}
      {selectedStore && (
        <div className="absolute top-4 left-4 right-4 z-10 max-w-md pointer-events-none">
          <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-emerald-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {selectedStore.name?.ko || selectedStore.name?.en || ''}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedStore.address?.ko || selectedStore.address?.en || ''}
                </p>
                {selectedStore.contact?.phone && (
                  <p className="text-sm text-emerald-600 font-medium">
                    📞 {selectedStore.contact.phone}
                  </p>
                )}
              </div>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ml-3 ${
                {
                  headquarters: 'bg-red-100 text-red-800',
                  branch: 'bg-blue-100 text-blue-800',
                  warehouse: 'bg-purple-100 text-purple-800',
                  showroom: 'bg-green-100 text-green-800'
                }[selectedStore.type] || 'bg-gray-100 text-gray-800'
              }`}>
                {
                  {
                    headquarters: '본사',
                    branch: '지점',
                    warehouse: '물류센터',
                    showroom: '쇼룸'
                  }[selectedStore.type] || selectedStore.type
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Store List on Map */}
      <div className="absolute bottom-4 left-4 z-10 max-w-xs">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="font-semibold text-gray-700 mb-2 text-sm">매장 목록</div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => onStoreSelect?.(store)}
                className={`w-full text-left p-2 rounded text-xs transition-colors ${
                  selectedStore?.id === store.id 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{store.name?.ko || store.name?.en}</div>
                <div className="text-gray-600 truncate">
                  {store.address?.ko || store.address?.en}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;