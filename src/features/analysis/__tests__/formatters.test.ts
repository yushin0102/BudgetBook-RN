/**
 * 金額格式化與 clamp 工具函式測試
 */
import { clamp01, formatCurrency } from '~/features/analysis/utils/formatters';

describe('formatCurrency', () => {
    it('should format positive number with $ prefix', () => {
        expect(formatCurrency(1500)).toBe('$1,500');
    });

    it('should format 0 as $0', () => {
        expect(formatCurrency(0)).toBe('$0');
    });

    it('should format negative number with -$ prefix', () => {
        expect(formatCurrency(-800)).toBe('-$800');
    });

    it('should format large numbers with comma separators', () => {
        expect(formatCurrency(80000)).toBe('$80,000');
    });
});

describe('clamp01', () => {
    it('should clamp values below 0 to 0', () => {
        expect(clamp01(-0.5)).toBe(0);
    });

    it('should clamp values above 1 to 1', () => {
        expect(clamp01(1.3)).toBe(1);
    });

    it('should pass through values between 0 and 1', () => {
        expect(clamp01(0.5)).toBe(0.5);
    });

    it('should return 0 for exactly 0', () => {
        expect(clamp01(0)).toBe(0);
    });

    it('should return 1 for exactly 1', () => {
        expect(clamp01(1)).toBe(1);
    });
});
