import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import { CATEGORY_MAP, CATEGORY_META } from '~/features/expenseInput/types/config';
import type ExpenseDraft from '~/features/expenseInput/types/template';
import { QuickTemplate, TemplateCategoryId } from '~/features/expenseInput/types/template';
import { formatDateLabel } from '~/features/expenseInput/utils';

type HeaderSummaryProps = {
    activeTemplate: QuickTemplate | null;
    draft: ExpenseDraft;
};

export const HeaderSummary = ({ activeTemplate, draft }: HeaderSummaryProps) => {
    const amountText = `${draft.mode ? '-' : ''}$${draft?.amount}`;

    const categoryId = (draft.categoryId as TemplateCategoryId) ?? 'other';
    const meta = CATEGORY_META[categoryId] ?? CATEGORY_META.other;

    const category = draft.categoryId ? CATEGORY_MAP[draft.categoryId] : null;
    const categoryLabelText = draft.note ? draft.note : (activeTemplate?.note ?? '');

    const categoryTitle = category?.label ? category.label : (activeTemplate?.note ?? '未分類');

    return (
        <ContentWrapper>
            <Container colors={['#FFE0CC', '#FFF6E5', '#E6F4FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <LeftWrap>
                    <IconView $bg={meta.badgeBg}>
                        <MaterialIcons name={meta.icon as any} size={24} color="#FFFFFF" />
                    </IconView>
                    <TextWrap>
                        <CategoryTitle>{categoryTitle}</CategoryTitle>
                        <CategoryText>{categoryLabelText}</CategoryText>
                    </TextWrap>
                </LeftWrap>

                <RightWrap>
                    <AmountText $negative={draft.mode}>{amountText}</AmountText>
                    <DateText>{formatDateLabel(draft.date)}</DateText>
                </RightWrap>
            </Container>
        </ContentWrapper>
    );
};

const ContentWrapper = styled.View`
    margin-top: 20px;
    padding-horizontal: 18px;
`;

const Container = styled(LinearGradient)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    overflow: hidden;
    border-radius: 22px;
    min-height: 105px;
    /* iOS 陰影 */
    shadow-color: #000;
    shadow-opacity: 0.08;
    shadow-radius: 10px;
    shadow-offset: 0px 4px;
    /* Android 陰影 */
    elevation: 2;
`;
const LeftWrap = styled(View)`
    padding-left: 18px;
    flex-direction: row;
    align-items: center;
    width: 60%;
`;
const TextWrap = styled(View)`
    padding-left: 4px;
`;

const IconView = styled(View)<{ $bg: string }>`
    background-color: ${({ $bg }) => $bg};
    border-radius: 20px;
    padding: 6px;
    margin-right: 10px;
    justify-content: center;
    align-items: center;
`;

const RightWrap = styled(View)`
    align-items: flex-end;
    padding-right: 18px;
`;

const CategoryTitle = styled.Text`
    color: ${({ theme }) => theme.colors.black[90]};
    font-size: 20px;
    font-weight: 700;
`;

const CategoryText = styled.Text`
    color: ${({ theme }) => theme.colors.black[60]};
    padding-top: 4px;
    font-size: 16px;
    font-weight: 300;
`;

const AmountText = styled.Text<{ $negative: 'expense' | 'income' }>`
    font-size: 20px;
    font-weight: 700;
    color: ${p => (p.$negative === 'expense' ? '#FF8A80' : '#69F0AE')};
`;

const DateText = styled.Text`
    margin-top: 6px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.black[70]};
`;
