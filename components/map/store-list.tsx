'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, Wifi, Car, Accessibility, Users, ChevronDown } from 'lucide-react';
import type { StoreLocation } from '@/lib/types';

interface StoreListProps {
  stores: StoreLocation[];
  selectedStore?: StoreLocation | null;
  onStoreSelect?: (store: StoreLocation) => void;
  searchTerm?: string;
  selectedType?: string;
}

const storeTypeLabels = {
  headquarters: '본사',
  branch: '지점',
  warehouse: '물류센터',
  showroom: '쇼룸'
};

const storeTypeColors = {
  headquarters: 'bg-red-100 text-red-800 border-red-200',
  branch: 'bg-blue-100 text-blue-800 border-blue-200',
  warehouse: 'bg-purple-100 text-purple-800 border-purple-200',
  showroom: 'bg-green-100 text-green-800 border-green-200'
};

const getWeekdayInKorean = (day: string) => {
  const days = {
    monday: '월',
    tuesday: '화',
    wednesday: '수',
    thursday: '목',
    friday: '금',
    saturday: '토',
    sunday: '일'
  };
  return days[day as keyof typeof days] || day;
};

const StoreCard = ({ 
  store, 
  isSelected, 
  onClick 
}: { 
  store: StoreLocation; 
  isSelected: boolean; 
  onClick: () => void 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const features = [];
  if (store.features?.parking) features.push({ icon: Car, label: '주차가능' });
  if (store.features?.wifi) features.push({ icon: Wifi, label: 'WiFi' });
  if (store.features?.wheelchair_accessible) features.push({ icon: Accessibility, label: '휠체어접근' });
  if (store.features?.public_transport) features.push({ icon: Users, label: '대중교통' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {store.name?.ko || store.name?.en || 'Unnamed Store'}
          </h3>
          <span className={`inline-block px-2 py-1 text-xs rounded-full border ${
            storeTypeColors[store.type] || 'bg-gray-100 text-gray-800 border-gray-200'
          }`}>
            {storeTypeLabels[store.type] || store.type}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
          <span>{store.address?.ko || store.address?.en || ''}</span>
        </div>

        {store.contact?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{store.contact.phone}</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            {/* Operating Hours */}
            {store.hours && Object.keys(store.hours).length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">운영시간</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600 ml-6">
                  {Object.entries(store.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span>{getWeekdayInKorean(day)}요일</span>
                      <span>
                        {hours?.closed ? '휴무' : `${hours?.open} - ${hours?.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-4">
                <span className="font-medium text-gray-900 block mb-2">편의시설</span>
                <div className="flex flex-wrap gap-2">
                  {features.map(({ icon: Icon, label }, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      <Icon className="w-3 h-3" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {store.services && store.services.length > 0 && (
              <div className="mb-4">
                <span className="font-medium text-gray-900 block mb-2">서비스</span>
                <div className="flex flex-wrap gap-2">
                  {store.services.map((service, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {store.description && (store.description.ko || store.description.en) && (
              <div>
                <span className="font-medium text-gray-900 block mb-2">상세정보</span>
                <p className="text-sm text-gray-600">
                  {store.description.ko || store.description.en}
                </p>
              </div>
            )}

            {/* Contact Info */}
            {(store.contact?.email || store.manager) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="font-medium text-gray-900 block mb-2">담당자 정보</span>
                <div className="space-y-1 text-sm text-gray-600">
                  {store.manager && (
                    <div>
                      <span className="font-medium">담당자:</span> {store.manager.name}
                      {store.manager?.phone && (
                        <span className="block text-gray-500">{store.manager.phone}</span>
                      )}
                    </div>
                  )}
                  {store.contact?.email && (
                    <div>
                      <span className="font-medium">이메일:</span> {store.contact.email}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function StoreList({ stores, selectedStore, onStoreSelect, searchTerm, selectedType }: StoreListProps) {
  // Filter stores based on search term and type
  const filteredStores = stores.filter(store => {
    const matchesSearch = !searchTerm || 
      (store.name?.ko && store.name.ko.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (store.name?.en && store.name.en.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (store.address?.ko && store.address.ko.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (store.address?.en && store.address.en.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !selectedType || store.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          매장 목록 ({filteredStores.length}개)
        </h3>
      </div>

      <AnimatePresence>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              isSelected={selectedStore?.id === store.id}
              onClick={() => onStoreSelect?.(store)}
            />
          ))}
          
          {filteredStores.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>검색 조건에 맞는 매장이 없습니다.</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}