'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Store, Users, Award } from 'lucide-react';
import Image from 'next/image';

export default function ParallaxSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  // 전국 주요 지점 위치 - 광주 중심 (실제 지도 좌표)
  const locations = [
    { id: 'gwangju', name: '광주 본사', x: '40%', y: '66%', stores: 15, delay: 0, isMain: true },
    { id: 'seoul', name: '서울', x: '50%', y: '28%', stores: 25, delay: 0.3 },
    { id: 'gyeonggi', name: '경기', x: '48%', y: '32%', stores: 18, delay: 0.4 },
    { id: 'incheon', name: '인천', x: '45%', y: '30%', stores: 8, delay: 0.5 },
    { id: 'gangwon', name: '강원', x: '65%', y: '25%', stores: 5, delay: 0.7 },
    { id: 'chungnam', name: '충남', x: '40%', y: '45%', stores: 7, delay: 0.5 },
    { id: 'daejeon', name: '대전', x: '48%', y: '47%', stores: 7, delay: 0.4 },
    { id: 'chungbuk', name: '충북', x: '55%', y: '42%', stores: 6, delay: 0.5 },
    { id: 'daegu', name: '대구', x: '68%', y: '53%', stores: 10, delay: 0.3 },
    { id: 'gyeongbuk', name: '경북', x: '70%', y: '43%', stores: 8, delay: 0.6 },
    { id: 'busan', name: '부산', x: '73%', y: '65%', stores: 12, delay: 0.4 },
    { id: 'ulsan', name: '울산', x: '75%', y: '60%', stores: 6, delay: 0.5 },
    { id: 'gyeongnam', name: '경남', x: '65%', y: '63%', stores: 9, delay: 0.6 },
    { id: 'jeonnam', name: '전남', x: '30%', y: '78%', stores: 8, delay: 0.2 },
    { id: 'jeonbuk', name: '전북', x: '35%', y: '60%', stores: 7, delay: 0.3 },
    { id: 'jeju', name: '제주', x: '33%', y: '88%', stores: 3, delay: 0.8 },
  ];

  const stats = [
    { icon: Store, value: '100+', label: '전국 매장' },
    { icon: Users, value: '50만+', label: '누적 고객' },
    { icon: Award, value: '30년', label: '전통과 신뢰' },
    { icon: MapPin, value: '광주 본사', label: '건강의 중심' },
  ];

  return (
    <section ref={ref} className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background Map Effect */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-green-50 opacity-50" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-green-600 font-medium mb-4 text-lg tracking-wider">
            AROUND THE KOREA
          </h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            광주에서 시작한 건강, <strong className="text-green-600">전국으로</strong>
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            광주 본사를 중심으로 전국 각지에<br className="hidden md:block" />
            CMWay의 건강한 가치를 전달하고 있습니다.
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-16"
        >
          {/* Korea Map with Locations */}
          <div className="relative h-[600px] bg-gradient-to-br from-slate-100 to-gray-200 rounded-2xl overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/images/Map_of_South_Korea-blank.svg"
                alt="Korea Map"
                width={500}
                height={600}
                className="opacity-40 scale-110"
                style={{ filter: 'grayscale(100%) brightness(0.8) contrast(1.2)' }}
              />
            </div>


            {/* Location Points - Only Gwangju */}
            {locations.filter(loc => loc.isMain).map((location, index) => (
              <motion.div
                key={location.id}
                className="absolute group"
                style={{ left: location.x, top: location.y }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                {/* Static Ring for Main Location */}
                <div className="absolute -inset-4 rounded-full ring-2 ring-red-400 ring-opacity-40" />

                {/* Location Dot */}
                <div className="relative z-10 w-5 h-5 rounded-full bg-red-600 ring-2 ring-red-400 
                  shadow-lg cursor-pointer transition-transform hover:scale-150">
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg whitespace-nowrap">
                      <div className="font-bold text-sm">{location.name}</div>
                      <div className="text-xs text-gray-300">{location.stores}개 매장</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 
                          border-transparent border-t-gray-900" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Label */}
                <motion.div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <div className="font-bold text-red-600 text-sm whitespace-nowrap bg-white/90 px-2 py-1 rounded shadow">
                    {location.name}
                  </div>
                </motion.div>
              </motion.div>
            ))}

            {/* Legend */}
            <motion.div 
              className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-600 ring-1 ring-red-400"></div>
                <span className="text-sm text-gray-700 font-medium">본사 (광주)</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                bg-gradient-to-r from-green-100 to-blue-100 mb-4">
                <stat.icon className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/stores"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 
              text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 
              transform hover:scale-105"
          >
            가까운 매장 찾기
            <MapPin className="ml-2 w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}