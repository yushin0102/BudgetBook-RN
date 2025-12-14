import { useCallback, useState } from 'react';

export type ModeFilter = 'all' | 'income' | 'expense';

export const useTransactionFilters = (initialMode: ModeFilter = 'all') => {
    const [modeFilter, setModeFilter] = useState<ModeFilter>(initialMode);
    const [query, setQuery] = useState('');

    const onChangeModeFilter = useCallback((mode: ModeFilter) => {
        setModeFilter(mode);
    }, []);

    const onChangeQuery = useCallback((text: string) => {
        setQuery(text);
    }, []);

    return {
        modeFilter,
        query,
        onChangeModeFilter,
        onChangeQuery,
    };
};
