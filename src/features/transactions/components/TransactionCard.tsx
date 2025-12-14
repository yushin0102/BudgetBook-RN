import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import { CATEGORY_MAP } from '~/features/expenseInput/types/config';
import { formatDateLabel } from '~/features/expenseInput/utils';
import type Transaction from '~/features/transactions/types/transaction';

type IProps = {
    tx: Transaction;
    onPressEdit: (id: string, amount: number) => void;
    onPressDelete: () => void;
};

export const TransactionCard = ({ tx, onPressEdit, onPressDelete }: IProps) => {
    const category = CATEGORY_MAP[tx.categoryId];
    const isExpense = tx.mode === 'expense';
    const iconName = isExpense ? 'remove' : 'add';
    const sign = isExpense ? '-' : '+';
    const displayNote = tx.note || category?.label || '';
    const [showInput, setShowInput] = useState(false);
    const [draftAmount, setDraftAmount] = useState(String(Math.abs(tx.amount)));

    const handleOnEditPress = () => {
        setShowInput(!showInput);
    };

    const handleSavePress = () => {
        const next = Number(draftAmount.replace(/,/g, ''));
        if (!Number.isNaN(next)) {
            onPressEdit(tx.id, next);
            setShowInput(false);
        }
    };

    const handleCloseEditPress = () => {
        setDraftAmount(String(Math.abs(tx.amount)));
        setShowInput(false);
    };

    return (
        <CardContainer>
            <LeftSection>
                <IconCircle style={{ backgroundColor: category?.badgeBg ?? '#FFE0B2' }}>
                    <MaterialIcons size={22} name={iconName} color={'#FFFFFF'} />
                </IconCircle>

                <TextBlock>
                    <TitleRow>
                        <TitleText numberOfLines={2}>{displayNote}</TitleText>
                        {category && (
                            <CategoryTag>
                                <CategoryTagText>{category.label}</CategoryTagText>
                            </CategoryTag>
                        )}
                    </TitleRow>

                    <DateRow>
                        <MaterialIcons name="calendar-today" size={16} color="#B0B0B0" />
                        <DateText>{formatDateLabel(tx.date)}</DateText>
                    </DateRow>
                </TextBlock>
            </LeftSection>

            <RightSection>
                <AmountView>
                    {showInput ? (
                        <EditRow>
                            <AmountTextInput
                                $isExpense={isExpense}
                                keyboardType="number-pad"
                                value={draftAmount}
                                onChangeText={setDraftAmount}
                            />
                            <SaveCancelRow>
                                <SaveIconButton onPress={handleSavePress}>
                                    <MaterialIcons name="check" size={16} color="white" />
                                </SaveIconButton>
                                <TouchableOpacity onPress={handleCloseEditPress}>
                                    <MaterialIcons name="close" size={16} color="#999999" />
                                </TouchableOpacity>
                            </SaveCancelRow>
                        </EditRow>
                    ) : (
                        <AmountText $isExpense={isExpense}>
                            {sign}${Math.abs(tx.amount).toLocaleString()}
                        </AmountText>
                    )}
                </AmountView>

                <ActionsRow>
                    <ActionButton activeOpacity={0.7} onPress={handleOnEditPress}>
                        <MaterialIcons name="edit" size={16} color="#82B1FF" />
                        <ActionText $variant="edit">編輯</ActionText>
                    </ActionButton>

                    <ActionButton activeOpacity={0.7} onPress={onPressDelete}>
                        <MaterialIcons name="delete-outline" size={16} color="#FF8A80" />
                        <ActionText $variant="delete">刪除</ActionText>
                    </ActionButton>
                </ActionsRow>
            </RightSection>
        </CardContainer>
    );
};

const CardContainer = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 12px 16px 22px 16px;
    margin-bottom: 16px;
    border-radius: 24px;
    background-color: #ffffff;

    /* iOS shadow */
    shadow-color: #000000;
    shadow-opacity: 0.06;
    shadow-radius: 12px;
    shadow-offset: 0px 4px;

    /* Android shadow */
    elevation: 3;
`;

const LeftSection = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

const IconCircle = styled.View`
    width: 48px;
    height: 48px;
    border-radius: 28px;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
`;

const TextBlock = styled.View`
    flex: 1;
`;

const TitleRow = styled.View`
    flex-direction: row;
    align-items: center;
`;

const TitleText = styled.Text`
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.black[70]};
`;

const CategoryTag = styled.View`
    align-self: flex-start;
    margin-left: 8px;
    padding: 4px 10px;
    border-radius: 999px;
    background-color: ${({ theme }) => theme.colors.black[10]};
`;

const CategoryTagText = styled.Text`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.black[70]};
`;

const DateRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
`;

const DateText = styled.Text`
    margin-left: 6px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.black[70]};
`;

const RightSection = styled.View`
    flex-direction: column;
    flex: 1;
`;

const AmountView = styled.View`
    align-items: flex-end;
`;
const AmountTextInput = styled.TextInput<{ $isExpense: boolean }>`
    font-size: 16px;
    font-weight: 700;
    text-align: right;
    background-color: ${({ theme }) => theme.colors.black[30]};
    padding: 2px 8px 2px 10px;
    border-radius: 8px;
    color: ${({ $isExpense, theme }) => ($isExpense ? theme.colors.main.primary : theme.colors.main.success)};
`;

const SaveIconButton = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.colors.main.success};
    border-radius: 20px;
    margin-right: 6px;
    padding: 3px;
`;

const AmountText = styled.Text<{ $isExpense: boolean }>`
    font-size: 16px;
    font-weight: 700;
    text-align: right;
    padding: 2px 0px;
    color: ${({ $isExpense, theme }) => ($isExpense ? theme.colors.main.primary : theme.colors.main.success)};
`;

const ActionsRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin-top: 22px;
`;

const ActionButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    margin-left: 22px;
`;

const ActionText = styled.Text<{ $variant: 'edit' | 'delete' }>`
    font-size: 14px;
    margin-left: 2px;
    color: ${({ $variant, theme }) =>
        $variant === 'edit' ? theme.colors.main.secondary : theme.colors.secondary.coral};
`;

const EditRow = styled.View`
    flex-direction: row;
    align-items: center;
`;

const SaveCancelRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-left: 8px;
`;
