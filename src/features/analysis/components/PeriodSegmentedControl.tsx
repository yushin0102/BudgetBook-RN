import React from 'react';
import styled from 'styled-components/native';

import type { Period } from '~/features/analysis/types/analysis';

export const PeriodSegmentedControl = ({ value, onChange }: { value: Period; onChange: (p: Period) => void }) => {
    return (
        <Wrap>
            <Pill $active={value === 'week'} onPress={() => onChange('week')} activeOpacity={0.8}>
                <PillText $active={value === 'week'}>週</PillText>
            </Pill>

            <Pill $active={value === 'month'} onPress={() => onChange('month')} activeOpacity={0.8}>
                <PillText $active={value === 'month'}>月</PillText>
            </Pill>
        </Wrap>
    );
};

const Wrap = styled.View`
    flex-direction: row;
    gap: 10px;
`;

const Pill = styled.TouchableOpacity<{ $active: boolean }>`
    width: 44px;
    height: 35px;
    border-radius: 22px;
    align-items: center;
    justify-content: center;

    background-color: ${({ theme, $active }) => ($active ? theme.colors.main.primary : theme.colors.white)};

    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.08);
`;

const PillText = styled.Text<{ $active: boolean }>`
    font-size: 16px;
    font-weight: 800;
    color: ${({ theme, $active }) => ($active ? theme.colors.white : theme.colors.black[80])};
`;
