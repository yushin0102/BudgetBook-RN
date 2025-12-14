import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import SectionTitle from '~/features/expenseInput/components/SectionTitle';
import { CATEGORIES } from '~/features/expenseInput/types/config';
import { TemplateCategoryId } from '~/features/expenseInput/types/template';

type Props = {
    selectedCategoryId: TemplateCategoryId | null;
    onSelectCategory: (catId: TemplateCategoryId) => void;
};

export const ExpenseCategorySelector: React.FC<Props> = ({ selectedCategoryId, onSelectCategory }) => {
    const handlePress = (catId: TemplateCategoryId) => {
        onSelectCategory(catId);
    };

    return (
        <Container>
            <SectionTitle>支出類別</SectionTitle>
            <Grid>
                {CATEGORIES.map(cat => {
                    const isActive = selectedCategoryId === cat.id;
                    return (
                        <CategoryButton
                            key={cat.id}
                            activeOpacity={0.8}
                            onPress={() => handlePress(cat.id)}
                            $accent={cat.color}
                            $isActive={isActive}
                        >
                            {isActive && (
                                <ActiveBadge $accent={cat.color}>
                                    <MaterialIcons name="check" size={16} color="#FFFFFF" />
                                </ActiveBadge>
                            )}
                            <MaterialIcons name={cat.icon as any} size={32} color={isActive ? cat.color : '#555555'} />
                            <Label $isActive={isActive}>{cat.label}</Label>
                        </CategoryButton>
                    );
                })}
            </Grid>
        </Container>
    );
};

const Container = styled.View`
    margin-top: 24px;
    margin-bottom: 24px;
    padding-horizontal: 22px;
`;

const Grid = styled.View`
    margin-top: 8px;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
`;

const CategoryButton = styled.TouchableOpacity<{ $accent: string; $isActive?: boolean }>`
    width: 30%;
    padding: 24px;
    border-radius: 16px;

    /* keep white card; highlight via border */
    background-color: #ffffff;
    border-width: ${p => (p.$isActive ? '2px' : '1px')};
    border-color: ${p => (p.$isActive ? p.$accent : 'rgba(0,0,0,0.06)')};

    justify-content: center;
    align-items: center;

    shadow-color: #000;
    shadow-opacity: 0.06;
    shadow-radius: 10px;
    shadow-offset: 0px 3px;
    elevation: 2;
`;

const ActiveBadge = styled.View<{ $accent: string }>`
    position: absolute;
    top: 10px;
    right: 10px;

    width: 26px;
    height: 26px;
    border-radius: 13px;

    background-color: ${p => p.$accent};
    align-items: center;
    justify-content: center;

    /* tiny ring so it reads well on white */
    border-width: 2px;
    border-color: #ffffff;
`;

const Label = styled.Text<{ $isActive?: boolean }>`
    margin-top: 8px;
    font-size: 16px;
    font-weight: 500;
    color: ${p => (p.$isActive ? p.theme.colors.black[80] : '#333333')};
`;
