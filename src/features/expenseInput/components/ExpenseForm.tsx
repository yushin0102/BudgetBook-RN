import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import { DatePickerModal } from '~/features/expenseInput/components/DatePickerModal';
import type ExpenseDraft from '~/features/expenseInput/types/template';
import theme from '~/styles/theme';

type Props = {
    draft: ExpenseDraft;
    onChangeDraft: (patch: Partial<ExpenseDraft>) => void;
    onSubmit: () => void;
};
export const ExpenseForm = ({ draft, onChangeDraft, onSubmit }: Props) => {
    const [dateVisible, setDateVisible] = useState(false);
    const todayISO = new Date().toISOString().split('T')[0];
    const displayDate = draft.date === todayISO ? '今天' : draft.date;

    const isExpense = draft.mode === 'expense';
    const toggleMode = () => onChangeDraft({ mode: isExpense ? 'income' : 'expense' });
    const iconName = isExpense ? 'remove' : 'add';
    const iconColor = isExpense ? theme.colors.secondary.coral : theme.colors.secondary.mint;
    const buttonLabel = isExpense ? '支出' : '收入';

    return (
        <ContentWrapper>
            <Container>
                <LeftWrap>
                    <SectionTitleText>記一筆</SectionTitleText>
                    <SectionInfo>輕鬆記錄每一筆花費</SectionInfo>
                </LeftWrap>

                <RightWrap>
                    <SwitchTypeButton onPress={toggleMode} $isExpense={isExpense} activeOpacity={0.7}>
                        <MaterialIcons size={18} name={iconName} color={iconColor} />
                        <ButtonText $isExpense={isExpense}>{buttonLabel}</ButtonText>
                    </SwitchTypeButton>
                </RightWrap>
            </Container>

            <FormContainer>
                <InputField>
                    <MaterialIcons name="attach-money" size={32} color={theme.colors.black[50]} />
                    <InputContent
                        value={String(draft.amount)}
                        maxLength={6}
                        placeholder="輸入金額"
                        keyboardType="number-pad"
                        onChange={e => {
                            onChangeDraft({ amount: Number(e.nativeEvent.text) });
                        }}
                    />
                </InputField>
                <SubmitButton $isFilled={!!draft.categoryId} activeOpacity={0.8} onPress={onSubmit}>
                    <SubmitMaterialIconsButton name="check" size={20} $isFilled={!!draft.categoryId} />
                </SubmitButton>
            </FormContainer>

            <FormContainer>
                <InputField style={{ marginTop: 12 }}>
                    <RemarkInput
                        maxLength={15}
                        value={draft.note}
                        placeholder="備註 (例：咖啡85)"
                        onChange={e => {
                            onChangeDraft({ note: e.nativeEvent.text });
                        }}
                    />
                </InputField>
            </FormContainer>
            <View style={{ marginBottom: 12 }} />
            <ButtonWrap onPress={() => setDateVisible(true)}>
                <MaterialIcons name="calendar-today" size={16} color={theme.colors.black[70]} />
                <DateInfoText>選擇日期：</DateInfoText>
                <DateOptionsText>{displayDate}</DateOptionsText>
            </ButtonWrap>
            <DatePickerModal
                visible={dateVisible}
                value={draft.date}
                onConfirm={iso => {
                    onChangeDraft({ date: iso });
                    setDateVisible(false);
                }}
                onCancel={() => setDateVisible(false)}
            />
        </ContentWrapper>
    );
};

const ContentWrapper = styled.View`
    margin-top: 24px;
    padding-horizontal: 22px;
`;

const Container = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const SectionTitleText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    line-height: 28px;
    color: ${({ theme }) => theme.colors.black[80]};
    margin-bottom: 12px;
`;

const SectionInfo = styled.Text`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.black[60]};
`;

const LeftWrap = styled(View)``;

const RightWrap = styled(View)``;

const SwitchTypeButton = styled(TouchableOpacity)<{ $isExpense: boolean }>`
    border-width: 1px;
    border-color: ${({ theme, $isExpense }) =>
        $isExpense ? theme.colors.secondary.coral : theme.colors.secondary.mint};
    background-color: ${({ theme, $isExpense }) =>
        $isExpense ? theme.colors.transparentMain.primary : theme.colors.transparentMain.success};
    border-radius: 20px;
    padding-vertical: 8px;
    padding-horizontal: 16px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

const ButtonText = styled(Text)<{ $isExpense: boolean }>`
    color: ${({ theme, $isExpense }) => ($isExpense ? theme.colors.main.primary : theme.colors.main.success)};
    font-size: 14px;
    font-weight: 800;
`;

const FormContainer = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const InputField = styled(View)`
    border-width: 1px;
    border-color: #e5e7eb;
    border-radius: 18px;
    padding-horizontal: 8px;
    padding-vertical: 10px;
    margin-top: 12px;
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

const InputContent = styled(TextInput)`
    flex: 1;
    text-align: center;
    font-size: 24px;
    color: ${({ theme }) => theme.colors.black[90]};
`;

const SubmitButton = styled(TouchableOpacity)<{ $isFilled: boolean }>`
    background-color: ${({ theme, $isFilled }) => ($isFilled ? theme.colors.main.primary : theme.colors.black[10])};
    border-radius: 16px;
    padding-vertical: 14px;
    padding-horizontal: 6px;
    justify-content: center;
    align-items: center;
    margin-left: 12px;
    margin-top: 12px;
`;

const SubmitMaterialIconsButton = styled(MaterialIcons)<{ $isFilled: boolean }>`
    color: ${({ theme, $isFilled }) => ($isFilled ? theme.colors.white : theme.colors.black[40])};
`;

const RemarkInput = styled(TextInput)`
    flex: 1;
    font-size: 16px;
    font-weight: 500;
    padding-left: 8px;
`;

const ButtonWrap = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`;

const DateInfoText = styled.Text`
    color: ${({ theme }) => theme.colors.black[70]};
    font-size: 14px;
    margin-left: 6px;
`;

const DateOptionsText = styled.Text`
    color: ${({ theme }) => theme.colors.black[70]};
    font-size: 14px;
    margin-left: 4px;
`;
