import { QuickTemplate, TemplateCategoryId } from '~/features/expenseInput/types/template';
import theme from '~/styles/theme';

/**
 * 單一來源的「支出 / 收入類別」定義
 *
 * 說明：
 * - id      ：儲存在 Firebase / AsyncStorage 裡的 categoryId（穩定主鍵）
 * - label   ：給使用者看的中文名稱
 * - icon    ：MaterialIcons 的名稱（UI 用）
 * - badgeBg ：Header / Badge / 大卡片的底色
 * - chipBg  ：小 Chip / 快速範本用的底色（可以跟 badgeBg 不同）
 * - chipText：Chip 上文字顏色
 */
export type CategoryConfig = {
    id: TemplateCategoryId;
    label: string;
    icon: string;
    badgeBg: string;
    chipBg: string;
    chipText: string;
};

//   大卡 / 標章顏色
export const CATEGORY_CONFIGS: CategoryConfig[] = [
    {
        id: 'food',
        label: '餐飲',
        icon: 'restaurant',
        badgeBg: '#FFE0B2',
        chipBg: theme.colors.secondary.sand,
        chipText: theme.colors.black[70],
    },
    {
        id: 'commute',
        label: '交通',
        icon: 'directions-car',
        badgeBg: '#A5F1D6',
        chipBg: theme.colors.secondary.sky,
        chipText: '#FFFFFF',
    },
    {
        id: 'shopping',
        label: '購物',
        icon: 'shopping-bag',
        badgeBg: '#CBB8FF',
        chipBg: theme.colors.secondary.lavender,
        chipText: theme.colors.black[70],
    },
    {
        id: 'saving',
        label: '存錢',
        icon: 'savings',
        badgeBg: '#FFCCBC',
        chipBg: theme.colors.secondary.coral,
        chipText: theme.colors.black[70],
    },
    {
        id: 'other',
        label: '其他',
        icon: 'more-horiz',
        badgeBg: '#FFD180',
        chipBg: theme.colors.black[20],
        chipText: theme.colors.white,
    },
];

/**
 * 以 id 為 key 的查表物件：
 * - 直接拿完整 config（label, icon, 顏色等）
 * - 適合在 HeaderSummary / Badge / Category 標示使用
 */
export const CATEGORY_MAP: Record<TemplateCategoryId, CategoryConfig> = CATEGORY_CONFIGS.reduce(
    (acc, cfg) => {
        acc[cfg.id] = cfg;
        return acc;
    },
    {} as Record<TemplateCategoryId, CategoryConfig>,
);

/**
 * 仍然保留原本的 CATEGORIES 結構，提供給
 * - 類別選擇器（ExpenseCategorySelector）
 * - 只需要 id / label / icon / color 的地方
 */
export const CATEGORIES: { id: TemplateCategoryId; label: string; icon: string; color: string }[] =
    CATEGORY_CONFIGS.map(({ id, label, icon, badgeBg }) => ({
        id,
        label,
        icon,
        color: badgeBg,
    }));

/**
 * QuickTemplates 等 Chip 風格用的 style 表
 */
export const CATEGORY_STYLE: Record<
    TemplateCategoryId,
    {
        chipBg: string;
        chipText: string;
        outline: string; // 外框色（通常 = chipBg）
    }
> = CATEGORY_CONFIGS.reduce(
    (acc, cfg) => {
        acc[cfg.id] = {
            chipBg: cfg.chipBg,
            chipText: cfg.chipText,
            outline: cfg.chipBg,
        };
        return acc;
    },
    {} as Record<TemplateCategoryId, any>,
);

/**
 * Header / Badge 用的 Meta，保留原有 CATEGORY_META 介面，避免你其他檔案全部大改。
 */
export const CATEGORY_META: Record<TemplateCategoryId, { icon: string; badgeBg: string }> = CATEGORY_CONFIGS.reduce(
    (acc, cfg) => {
        acc[cfg.id] = {
            icon: cfg.icon,
            badgeBg: cfg.badgeBg,
        };
        return acc;
    },
    {} as Record<TemplateCategoryId, { icon: string; badgeBg: string }>,
);

/**
 * 開發階段用的假資料範本：Quick Templates
 * 只存 categoryId，不存 icon / color，全部交給 config.ts 這邊決定。
 */
export const MOCK_TEMPLATES: QuickTemplate[] = [
    { id: 't1', note: '固定通勤', amount: 30, categoryId: 'commute' },
    { id: 't2', note: '健身房', amount: 50, categoryId: 'other' },
    { id: 't3', note: '咖啡', amount: 85, categoryId: 'food' },
];
