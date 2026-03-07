export const formatCurrency = (n: number) => {
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    return `${sign}$${abs.toLocaleString()}`;
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
