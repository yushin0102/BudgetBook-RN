import { useCallback, useState } from 'react';

import type { Period } from '~/features/analysis/types/analysis';

export const useAnalysisPeriod = () => {
    const [period, setPeriod] = useState<Period>('month');
    const setWeek = useCallback(() => setPeriod('week'), []);
    const setMonth = useCallback(() => setPeriod('month'), []);
    return { period, setPeriod, setWeek, setMonth };
};
