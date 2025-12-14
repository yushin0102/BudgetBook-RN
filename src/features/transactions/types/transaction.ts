import { TemplateCategoryId, TransactionType } from '~/features/expenseInput/types/template';

export default interface Transaction {
    id: string; // Firestore doc id 或本地 uuid
    userId: string; // 目前可以寫 'mock-user'
    mode: TransactionType; // 'expense' | 'income'
    amount: number; //
    note: string; // '星巴克咖啡'
    date: string; //(YYYY-MM-DD)
    categoryId: TemplateCategoryId; // 'food' | 'commute' | 'salary' ...
    templateId?: string | null; // 由哪個 QuickTemplate 建立，可選
    createdAt: number; // Date.now()
    updatedAt?: number; // 可選：更新時改
}
