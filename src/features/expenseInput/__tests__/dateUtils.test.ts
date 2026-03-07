/**
 * 日期工具函式測試
 */
import { daysInMonth, formatDateLabel, pad2, parseISO, toISO } from '~/features/expenseInput/utils';

describe('pad2', () => {
    it('should pad single digit to two digits', () => {
        expect(pad2(1)).toBe('01');
        expect(pad2(9)).toBe('09');
    });

    it('should keep two-digit numbers as-is', () => {
        expect(pad2(10)).toBe('10');
        expect(pad2(31)).toBe('31');
    });
});

describe('daysInMonth', () => {
    it('should return 31 for January', () => {
        expect(daysInMonth(2026, 1)).toBe(31);
    });

    it('should return 28 for Feb in non-leap year', () => {
        expect(daysInMonth(2025, 2)).toBe(28);
    });

    it('should return 29 for Feb in leap year', () => {
        expect(daysInMonth(2024, 2)).toBe(29);
    });

    it('should return 30 for April', () => {
        expect(daysInMonth(2026, 4)).toBe(30);
    });
});

describe('toISO', () => {
    it('should format to YYYY-MM-DD', () => {
        expect(toISO(2026, 3, 7)).toBe('2026-03-07');
    });

    it('should pad month and day', () => {
        expect(toISO(2026, 1, 5)).toBe('2026-01-05');
    });
});

describe('parseISO', () => {
    it('should parse valid ISO date string', () => {
        const result = parseISO('2026-03-07');
        expect(result).toEqual({ y: 2026, m: 3, d: 7 });
    });

    it('should fallback to today for invalid strings', () => {
        const result = parseISO('invalid');
        const now = new Date();
        expect(result.y).toBe(now.getFullYear());
        expect(result.m).toBe(now.getMonth() + 1);
    });
});

describe('formatDateLabel', () => {
    it('should return 今天 for today ISO string', () => {
        const today = new Date().toISOString().split('T')[0];
        expect(formatDateLabel(today)).toBe('今天');
    });

    it('should return 昨天 for yesterday', () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const yesterday = d.toISOString().split('T')[0];
        expect(formatDateLabel(yesterday)).toBe('昨天');
    });

    it('should return ISO string for other dates', () => {
        expect(formatDateLabel('2025-01-01')).toBe('2025-01-01');
    });

    it('should return empty string for empty input', () => {
        expect(formatDateLabel('')).toBe('');
    });
});
