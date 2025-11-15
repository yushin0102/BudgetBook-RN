import { QuickTemplate, TemplateCategoryId } from '~/features/expenseInput/types/template';
import theme from '~/styles/theme';

export const CATEGORY_STYLE: Record<TemplateCategoryId, { bg: string; text: string }> = {
    commute: { bg: theme.colors.secondary.sky, text: '#FFFFFF' },
    fitness: { bg: theme.colors.secondary.coral, text: '#FFFFFF' },
    breakfast: { bg: theme.colors.secondary.sand, text: theme.colors.black[70] },
    afternoonTea: { bg: theme.colors.secondary.sand, text: theme.colors.black[70] },
    food: { bg: theme.colors.secondary.sand, text: '#FFFF' },
    transport: { bg: theme.colors.secondary.mint, text: theme.colors.black[70] },
    shopping: { bg: theme.colors.secondary.lavender, text: theme.colors.black[70] },
    coffee: { bg: theme.colors.secondary.coral, text: theme.colors.black[70] },
    other: { bg: theme.colors.black[20], text: theme.colors.black[70] },
    income: { bg: theme.colors.secondary.coral, text: '#FFFFFF' },
};

export const MOCK_TEMPLATES: QuickTemplate[] = [
    { id: 't1', note: '固定通勤', amount: 30, categoryId: 'commute' },
    { id: 't2', note: '健身房', amount: 50, categoryId: 'fitness' },
    { id: 't3', note: '早餐', amount: 85, categoryId: 'breakfast' },
];

export const CATEGORIES: { id: TemplateCategoryId; label: string; icon: string; color: string }[] = [
    { id: 'food', label: '餐飲', icon: 'restaurant', color: '#FFE0B2' },
    { id: 'commute', label: '交通', icon: 'directions-car', color: '#A5F1D6' },
    { id: 'shopping', label: '購物', icon: 'shopping-bag', color: '#CBB8FF' },
    { id: 'coffee', label: '咖啡', icon: 'coffee', color: '#FFCCBC' },
    { id: 'other', label: '其他', icon: 'more-horiz', color: '#E0E0E0' },
    { id: 'income', label: '收入', icon: 'attach-money', color: '#B2DFDB' },
    { id: 'transport', label: '運輸', icon: 'commute', color: '#90CAF9' },
    { id: 'fitness', label: '健身', icon: 'fitness-center', color: '#F48FB1' },
    { id: 'breakfast', label: '早餐', icon: 'free-breakfast', color: '#FFE082' },
    { id: 'afternoonTea', label: '下午茶', icon: 'cake', color: '#FFCC80' },
];
// 以 categoryId 映射到 icon 與色票（建議日後抽到 constants/categoryMeta.ts）
export const CATEGORY_META: Record<TemplateCategoryId | 'other', { icon: string; badgeBg: string }> = {
    // 你可依實際專案 theme 調整顏色
    food: { icon: 'restaurant', badgeBg: '#FFE0B2' },
    transport: { icon: 'directions-car', badgeBg: '#A5F1D6' },
    shopping: { icon: 'shopping-bag', badgeBg: '#CBB8FF' },
    coffee: { icon: 'coffee', badgeBg: '#FFCCBC' },
    other: { icon: 'more-horiz', badgeBg: '#E0E0E0' },
    income: { icon: 'attach-money', badgeBg: '#B2DFDB' },
    commute: { icon: 'commute', badgeBg: '#90CAF9' },
    fitness: { icon: 'fitness-center', badgeBg: '#F48FB1' },
    breakfast: { icon: 'free-breakfast', badgeBg: '#FFE082' },
    afternoonTea: { icon: 'cake', badgeBg: '#FFCC80' },
} as const;

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(cat => [cat.id, cat]));
