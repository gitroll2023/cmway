'use client';

import { useEffect, useRef } from 'react';
import type { StoreLocation } from '@/lib/types';

interface StoreMapProps {
  stores: StoreLocation[];
  selectedStore?: StoreLocation | null;
  onStoreSelect?: (store: StoreLocation) => void;
  className?: string;
}

const StoreMapClient = ({ stores, selectedStore, onStoreSelect, className = '' }: StoreMapProps) => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Create map if it doesn't exist
      if (!mapRef.current) {
        const mapContainer = document.getElementById('store-map');
        if (!mapContainer) return;

        mapRef.current = L.map('store-map').setView([35.1595952, 126.8514757], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);
      }

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add markers for stores
      const validStores = stores.filter(store => store.coordinates);
      
      validStores.forEach(store => {
        const color = {
          headquarters: '#dc2626',
          branch: '#2563eb',
          warehouse: '#7c3aed',
          showroom: '#059669'
        }[store.type] || '#6b7280';

        const icon = L.divIcon({
          html: `
            <div style="
              background-color: ${color};
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 2px solid white;
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            ">
              <div style="
                transform: rotate(45deg);
                text-align: center;
                line-height: 28px;
                color: white;
                font-size: 16px;
              ">📍</div>
            </div>
          `,
          className: 'custom-div-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([store.coordinates!.latitude, store.coordinates!.longitude], { icon })
          .addTo(mapRef.current);

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600;">
              ${store.name?.ko || store.name?.en || 'Unnamed Store'}
            </h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">
              ${store.address?.ko || store.address?.en || ''}
            </p>
            ${store.contact?.phone ? `
              <p style="margin: 0; color: #666; font-size: 14px;">
                전화: ${store.contact.phone}
              </p>
            ` : ''}
          </div>
        `);

        marker.on('click', () => {
          onStoreSelect?.(store);
        });

        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers
      if (validStores.length > 0) {
        const bounds = validStores.map(store => [
          store.coordinates!.latitude,
          store.coordinates!.longitude
        ] as [number, number]);
        
        if (bounds.length === 1) {
          mapRef.current.setView(bounds[0], 16);
        } else {
          mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [stores, onStoreSelect]);

  // Update view when selected store changes
  useEffect(() => {
    if (mapRef.current && selectedStore?.coordinates) {
      mapRef.current.setView(
        [selectedStore.coordinates.latitude, selectedStore.coordinates.longitude],
        17
      );
    }
  }, [selectedStore]);

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      <div 
        id="store-map"
        className="w-full h-full rounded-lg"
        style={{ zIndex: 0 }}
      />
      
      {/* Store Info Overlay */}
      {selectedStore && (
        <div className="absolute top-4 left-4 right-4 z-10 max-w-md">
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

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-3 text-xs">
          <div className="font-semibold text-gray-700 mb-2">범례</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>본사</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>지점</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span>물류센터</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
              <span>쇼룸</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMapClient;