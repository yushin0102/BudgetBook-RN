import type { CategoryConfig } from '../types/analysis';

export const CATEGORY_CONFIGS: CategoryConfig[] = [
    { id: 'food', label: '餐飲', color: '#FFE0B2', icon: 'restaurant' },
    { id: 'commute', label: '交通', color: '#82B1FF', icon: 'directions-car' },
    { id: 'shopping', label: '購物', color: '#CBB8FF', icon: 'shopping-bag' },
    { id: 'saving', label: '存錢', color: '#A5F1D6', icon: 'savings' },
    { id: 'other', label: '其他', color: '#E0E0E0', icon: 'more-horiz' },
];
