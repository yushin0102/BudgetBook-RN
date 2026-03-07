import React, { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled, { useTheme } from 'styled-components/native';

export const SettingScreen = ({ onPressEditCategoryBudgets }: { onPressEditCategoryBudgets?: () => void }) => {
    const theme = useTheme();

    const [monthlyBudget, setMonthlyBudget] = useState('30000');
    const [dailyLimit, setDailyLimit] = useState('1000');

    return (
        <Wrap>
            <Card>
                <CardHeader>
                    <HeaderLeft>
                        <HeaderIconWrap>
                            <MaterialIcons name="attach-money" size={20} color={theme.colors.main.primary} />
                        </HeaderIconWrap>
                        <HeaderTitle>預算設定</HeaderTitle>
                    </HeaderLeft>
                </CardHeader>

                <Row>
                    <RowLabel>月度預算</RowLabel>
                    <NumberInputWrap>
                        <NumberInput
                            value={monthlyBudget}
                            onChangeText={setMonthlyBudget}
                            placeholder="0"
                            keyboardType="number-pad"
                        />
                    </NumberInputWrap>
                </Row>

                <Row>
                    <RowLabel>每日消費限制</RowLabel>
                    <NumberInputWrap>
                        <NumberInput
                            value={dailyLimit}
                            onChangeText={setDailyLimit}
                            placeholder="0"
                            keyboardType="number-pad"
                        />
                    </NumberInputWrap>
                </Row>
                <EditWrap>
                    <EditButtonText>編輯分類預算</EditButtonText>
                    <EditButton onPress={onPressEditCategoryBudgets} activeOpacity={0.85}>
                        <View style={{ flex: 1 }} />
                        <MaterialIcons name="account-balance-wallet" size={20} color={theme.colors.secondary.coral} />
                        <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color={theme.colors.secondary.coral}
                            style={{ marginLeft: -8 }}
                        />
                    </EditButton>
                </EditWrap>
            </Card>

            <Spacer />
        </Wrap>
    );
};

const Wrap = styled.View`
    padding: 18px;
`;

const Spacer = styled.View`
    height: 16px;
`;

const Card = styled.View`
    border-radius: 22px;
    padding: 18px;
    background-color: ${({ theme }) => theme.colors.white};
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.06);
`;

const CardHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
`;

const HeaderLeft = styled.View`
    flex-direction: row;
    align-items: center;
`;

const HeaderIconWrap = styled.View`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 138, 128, 0.12);
    margin-right: 10px;
`;

const HeaderTitle = styled.Text`
    font-size: 18px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.black[85]};
`;

const Row = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-vertical: 12px;
`;

const RowLabel = styled.Text`
    font-size: 16px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.black[80]};
`;

const NumberInputWrap = styled.View`
    width: 120px;
    height: 44px;
    border-radius: 22px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.18);
    padding-horizontal: 14px;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.white};
`;

const NumberInput = styled(TextInput)`
    font-size: 18px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.black[85]};
    text-align: right;
`;

const EditWrap = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const EditButton = styled.TouchableOpacity`
    height: 52px;
    border-radius: 18px;
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;

const EditButtonText = styled.Text`
    font-size: 15px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.black[80]};
`;
