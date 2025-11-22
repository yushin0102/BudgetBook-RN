export type TemplateCategoryId =
    | 'food'
    | 'transport'
    | 'shopping'
    | 'saving'
    | 'other'
    | 'commute'
    | 'fitness'
    | 'breakfast';

export type QuickTemplate = {
    id: string;
    note: string;
    amount: number;
    categoryId: TemplateCategoryId;
};

export type TransactionType = 'expense' | 'income';

export default interface ExpenseDraft {
    mode: TransactionType;
    amount: number;
    note: string;
    date: string; // YYYY-MM-DD
    categoryId: TemplateCategoryId | null;
    templateId: string | null; // 使用的是哪個快速範本（可為 null）
}
