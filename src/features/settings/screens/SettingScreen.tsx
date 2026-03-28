import React, { useState } from 'react';
import { View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled, { useTheme } from 'styled-components/native';

import { BudgetEditModal } from '~/features/settings/components/BudgetEditModal';
import { useBudgetStore } from '~/store/useBudgetStore';

export const SettingScreen = () => {
    const theme = useTheme();

    // ─── 從 Zustand store 讀取 ───
    const monthlyTotalBudget = useBudgetStore(s => s.monthlyTotalBudget);
    const dailySpendingLimit = useBudgetStore(s => s.dailySpendingLimit);

    // ─── Modal 控制 ───
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <Wrap>
            <Card>
                <CardHeader>
                    <HeaderLeft>
                        <HeaderIconWrap>
                            <MaterialIcons name="attach-money" size={20} color={theme.colors.main.primary} />
                        </HeaderIconWrap>
                        <HeaderTitle>當前預算設定</HeaderTitle>
                    </HeaderLeft>
                </CardHeader>

                <Row>
                    <RowLabel>總預算</RowLabel>
                    <DisplayNumberWrap>
                        <DisplayNumber>${monthlyTotalBudget.toLocaleString()}</DisplayNumber>
                    </DisplayNumberWrap>
                </Row>

                <Row>
                    <RowLabel>每日限制</RowLabel>
                    <DisplayNumberWrap>
                        <DisplayNumber>${dailySpendingLimit.toLocaleString()}</DisplayNumber>
                    </DisplayNumberWrap>
                </Row>

                <EditWrap>
                    <EditButtonText>自訂預算與分類上限</EditButtonText>
                    <EditButton onPress={() => setModalVisible(true)} activeOpacity={0.85}>
                        <View style={{ flex: 1 }} />
                        <MaterialIcons name="tune" size={20} color={theme.colors.secondary.coral} />
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

            {/* ── 全方位預算設定 Modal ── */}
            <BudgetEditModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        </Wrap>
    );
};

// ─── Styled Components ───

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

const DisplayNumberWrap = styled.View`
    height: 40px;
    justify-content: center;
    padding-horizontal: 8px;
`;

const DisplayNumber = styled.Text`
    font-size: 18px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.black[60]};
    text-align: right;
`;

const EditWrap = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
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
