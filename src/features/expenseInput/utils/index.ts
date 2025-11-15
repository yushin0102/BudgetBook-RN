export const pad2 = (n: number) => n.toString().padStart(2, '0');
export const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
export const toISO = (y: number, m: number, d: number) => `${y}-${pad2(m)}-${pad2(d)}`;
export const todayISO = () => {
    const t = new Date();
    return toISO(t.getFullYear(), t.getMonth() + 1, t.getDate());
};
export const yesterdayISO = () => {
    const t = new Date();
    t.setDate(t.getDate() - 1);
    return toISO(t.getFullYear(), t.getMonth() + 1, t.getDate());
};
export const parseISO = (iso: string) => {
    // 安全解析 YYYY-MM-DD
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) {
        const t = new Date();
        return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() };
    }
    const y = Number(m[1]);
    const mm = Number(m[2]);
    const d = Number(m[3]);
    return { y, m: mm, d };
};

/**
 * @param iso YYYY-MM-DD
 * @returns 轉換成「今天」、「昨天」或原始日期字串
 */
export const formatDateLabel = (iso: string) => {
    if (!iso) return '';
    const today = new Date();
    const target = new Date(iso);

    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();

    const isToday = target.getFullYear() === y && target.getMonth() === m && target.getDate() === d;

    const yesterday = new Date(today);
    yesterday.setDate(d - 1);

    const isYesterday =
        target.getFullYear() === yesterday.getFullYear() &&
        target.getMonth() === yesterday.getMonth() &&
        target.getDate() === yesterday.getDate();

    if (isToday) return '今天';
    if (isYesterday) return '昨天';
    return iso; // fallback: 原始 YYYY-MM-DD
};
