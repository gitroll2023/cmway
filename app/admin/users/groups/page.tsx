'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Shield,
  Award,
  Star,
  TrendingUp,
  Percent,
  Gift
} from 'lucide-react';

interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  benefits: string[];
  discountRate: number;
  minPurchaseAmount: number;
  color: string;
  icon: any;
  autoUpgrade: boolean;
  upgradeCondition?: {
    purchaseAmount?: number;
    orderCount?: number;
  };
}

const mockGroups: UserGroup[] = [
  {
    id: '1',
    name: '일반회원',
    description: '기본 회원 그룹',
    memberCount: 1250,
    benefits: ['기본 적립금 1%', '생일 쿠폰'],
    discountRate: 0,
    minPurchaseAmount: 0,
    color: 'gray',
    icon: Users,
    autoUpgrade: true,
    upgradeCondition: {
      purchaseAmount: 500000
    }
  },
  {
    id: '2',
    name: 'VIP',
    description: '우수 고객 그룹',
    memberCount: 320,
    benefits: ['적립금 3%', '생일 쿠폰', '무료배송', '우선 고객센터'],
    discountRate: 5,
    minPurchaseAmount: 500000,
    color: 'purple',
    icon: Star,
    autoUpgrade: true,
    upgradeCondition: {
      purchaseAmount: 2000000
    }
  },
  {
    id: '3',
    name: 'VVIP',
    description: '최우수 고객 그룹',
    memberCount: 85,
    benefits: ['적립금 5%', '생일 쿠폰', '무료배송', '우선 고객센터', '전용 상담사', '특별 할인'],
    discountRate: 10,
    minPurchaseAmount: 2000000,
    color: 'yellow',
    icon: Award,
    autoUpgrade: false
  }
];

export default function UserGroupsPage() {
  const [groups, setGroups] = useState<UserGroup[]>(mockGroups);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newBenefit, setNewBenefit] = useState('');

  const handleAddGroup = () => {
    const newGroup: UserGroup = {
      id: Date.now().toString(),
      name: '새 그룹',
      description: '',
      memberCount: 0,
      benefits: [],
      discountRate: 0,
      minPurchaseAmount: 0,
      color: 'gray',
      icon: Users,
      autoUpgrade: false
    };
    setEditingGroup(newGroup);
    setIsAddingGroup(true);
  };

  const handleSaveGroup = () => {
    if (editingGroup) {
      if (isAddingGroup) {
        setGroups([...groups, editingGroup]);
        setIsAddingGroup(false);
      } else {
        setGroups(groups.map(g => g.id === editingGroup.id ? editingGroup : g));
      }
      setEditingGroup(null);
    }
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('이 그룹을 삭제하시겠습니까? 회원들은 기본 그룹으로 이동됩니다.')) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit && editingGroup) {
      setEditingGroup({
        ...editingGroup,
        benefits: [...editingGroup.benefits, newBenefit]
      });
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    if (editingGroup) {
      setEditingGroup({
        ...editingGroup,
        benefits: editingGroup.benefits.filter((_, i) => i !== index)
      });
    }
  };

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      gray: 'bg-gray-100 text-gray-700 border-gray-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">회원 그룹 관리</h1>
            <p className="text-gray-600">회원 등급과 혜택을 설정합니다.</p>
          </div>
          <button
            onClick={handleAddGroup}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            그룹 추가
          </button>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const Icon = group.icon;
            const isEditing = editingGroup?.id === group.id;

            return (
              <motion.div
                key={group.id}
                layout
                className={`bg-white rounded-lg shadow-sm border-2 ${
                  isEditing ? 'border-emerald-500' : 'border-gray-200'
                } overflow-hidden`}
              >
                {isEditing ? (
                  /* Edit Mode */
                  <div className="p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        그룹명
                      </label>
                      <input
                        type="text"
                        value={editingGroup.name}
                        onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        설명
                      </label>
                      <textarea
                        value={editingGroup.description}
                        onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          할인율 (%)
                        </label>
                        <input
                          type="number"
                          value={editingGroup.discountRate}
                          onChange={(e) => setEditingGroup({ ...editingGroup, discountRate: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          최소 구매액
                        </label>
                        <input
                          type="number"
                          value={editingGroup.minPurchaseAmount}
                          onChange={(e) => setEditingGroup({ ...editingGroup, minPurchaseAmount: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        혜택
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newBenefit}
                          onChange={(e) => setNewBenefit(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                          placeholder="혜택 추가"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          onClick={handleAddBenefit}
                          className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        {editingGroup.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            <span>{benefit}</span>
                            <button
                              onClick={() => handleRemoveBenefit(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingGroup.autoUpgrade}
                          onChange={(e) => setEditingGroup({ ...editingGroup, autoUpgrade: e.target.checked })}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700">자동 승급</span>
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveGroup}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        저장
                      </button>
                      <button
                        onClick={() => {
                          setEditingGroup(null);
                          setIsAddingGroup(false);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div className={`p-4 ${getColorClasses(group.color)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-8 h-8" />
                          <div>
                            <h3 className="font-bold text-lg">{group.name}</h3>
                            <p className="text-sm opacity-80">{group.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{group.memberCount}</div>
                          <div className="text-xs opacity-80">회원</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Benefits */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Gift className="w-4 h-4" />
                          혜택
                        </h4>
                        <ul className="space-y-1">
                          {group.benefits.map((benefit, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <Percent className="w-3 h-3" />
                            할인율
                          </div>
                          <div className="font-semibold text-gray-900">{group.discountRate}%</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <TrendingUp className="w-3 h-3" />
                            최소 구매액
                          </div>
                          <div className="font-semibold text-gray-900">₩{group.minPurchaseAmount.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Auto Upgrade */}
                      {group.autoUpgrade && (
                        <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                          <div className="text-xs text-blue-700 font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            자동 승급 조건
                          </div>
                          {group.upgradeCondition?.purchaseAmount && (
                            <div className="text-xs text-blue-600 mt-1">
                              구매액 ₩{group.upgradeCondition.purchaseAmount.toLocaleString()} 이상
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingGroup(group)}
                          className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}