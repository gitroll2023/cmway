'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { StoreLocation } from '@/lib/types';

// Fix for default markers in react-leaflet - only run on client side
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface StoreMapProps {
  stores: StoreLocation[];
  selectedStore?: StoreLocation | null;
  onStoreSelect?: (store: StoreLocation) => void;
  className?: string;
}

// Custom icon for stores
const createStoreIcon = (type: string) => {
  const color = {
    headquarters: '#dc2626', // red-600
    branch: '#2563eb',       // blue-600
    warehouse: '#7c3aed',    // violet-600
    showroom: '#059669'      // emerald-600
  }[type] || '#6b7280';

  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to handle map bounds fitting
function MapController({ stores, selectedStore }: { stores: StoreLocation[], selectedStore?: StoreLocation | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedStore?.coordinates) {
      map.setView([selectedStore.coordinates.latitude, selectedStore.coordinates.longitude], 16);
    } else if (stores.length > 0) {
      const validStores = stores.filter(store => store.coordinates);
      if (validStores.length === 1) {
        map.setView([validStores[0].coordinates!.latitude, validStores[0].coordinates!.longitude], 12);
      } else if (validStores.length > 1) {
        const bounds = validStores.map(store => [store.coordinates!.latitude, store.coordinates!.longitude] as [number, number]);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, stores, selectedStore]);

  return null;
}

export default function StoreMap({ stores, selectedStore, onStoreSelect, className = '' }: StoreMapProps) {
  const mapRef = useRef<any>(null);

  // Default center (Seoul, Korea)
  const defaultCenter: [number, number] = [37.5665, 126.9780];

  const validStores = stores.filter(store => store.coordinates);

  return (
    <div className={`relative w-full h-full min-h-[400px] rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={10}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController stores={validStores} selectedStore={selectedStore} />

        {validStores.map((store) => (
          <Marker
            key={store.id}
            position={[store.coordinates!.latitude, store.coordinates!.longitude]}
            icon={createStoreIcon(store.type)}
            eventHandlers={{
              click: () => {
                onStoreSelect?.(store);
              },
            }}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {store.name?.ko || store.name?.en || 'Unnamed Store'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {store.address?.ko || store.address?.en || ''}
                </p>
                {store.contact?.phone && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">전화:</span> {store.contact.phone}
                  </p>
                )}
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    {
                      headquarters: 'bg-red-100 text-red-800',
                      branch: 'bg-blue-100 text-blue-800',
                      warehouse: 'bg-purple-100 text-purple-800',
                      showroom: 'bg-green-100 text-green-800'
                    }[store.type] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {
                      {
                        headquarters: '본사',
                        branch: '지점',
                        warehouse: '물류센터',
                        showroom: '쇼룸'
                      }[store.type] || store.type
                    }
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}