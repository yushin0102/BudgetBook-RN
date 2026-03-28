import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import { CATEGORY_CONFIGS } from '~/features/expenseInput/types/config';
import { useBudgetStore } from '~/store/useBudgetStore';
import theme from '~/styles/theme';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export const BudgetEditModal = ({ visible, onClose }: Props) => {
    // ─── Store ───
    const storeMonthly = useBudgetStore(s => s.monthlyTotalBudget);
    const storeDaily = useBudgetStore(s => s.dailySpendingLimit);
    const storeCategories = useBudgetStore(s => s.categoryBudgets);
    const batchUpdateCategoryBudgets = useBudgetStore(s => s.batchUpdateCategoryBudgets);
    const updateTotalBudget = useBudgetStore(s => s.updateTotalBudget);
    const updateDailyLimit = useBudgetStore(s => s.updateDailyLimit);
    const resetToDefault = useBudgetStore(s => s.resetToDefault);

    // ─── Local Drafts ───
    const [draftMonthly, setDraftMonthly] = useState(String(storeMonthly));
    const [draftDaily, setDraftDaily] = useState(String(storeDaily));
    const [draftCategory, setDraftCategory] = useState<Record<string, string>>({});

    // 每次 Modal 開啟時，將 store 值同步到 draft
    useEffect(() => {
        if (visible) {
            setDraftMonthly(String(storeMonthly));
            setDraftDaily(String(storeDaily));
            const cats: Record<string, string> = {};
            for (const key of Object.keys(storeCategories)) {
                cats[key] = String(storeCategories[key]);
            }
            setDraftCategory(cats);
        }
    }, [visible, storeMonthly, storeDaily, storeCategories]);

    const handleCatChange = useCallback((id: string, text: string) => {
        setDraftCategory(p => ({ ...p, [id]: text.replace(/[^\d]/g, '') }));
    }, []);

    const handleSave = useCallback(() => {
        const total = Number(draftMonthly);
        if (!Number.isNaN(total)) updateTotalBudget(total);

        const daily = Number(draftDaily);
        if (!Number.isNaN(daily)) updateDailyLimit(daily);

        const cats: Record<string, number> = {};
        for (const [key, val] of Object.entries(draftCategory)) {
            const n = Number(val);
            cats[key] = Number.isNaN(n) ? 0 : n;
        }
        batchUpdateCategoryBudgets(cats);

        onClose();
    }, [draftMonthly, draftDaily, draftCategory, updateTotalBudget, updateDailyLimit, batchUpdateCategoryBudgets, onClose]);

    const handleReset = useCallback(() => {
        resetToDefault();
        // store 已 reset，下次 render 透過 useEffect 會自動同步 draft
    }, [resetToDefault]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Backdrop />
                </TouchableWithoutFeedback>

                <SheetContainer>
                    <Sheet>
                        <HandleBar />

                        <HeaderRow>
                            <HeaderTitle>預算配置</HeaderTitle>
                        </HeaderRow>

                        <BodyScrollView showsVerticalScrollIndicator={false}>
                            {/* ── Global Limits ── */}
                            <SectionTitle>整體預算</SectionTitle>
                            
                            <GlobalRow>
                                <GlobalLeft>
                                    <MaterialIcons name="calendar-month" size={24} color={theme.colors.main.primary} />
                                    <View>
                                        <GlobalLabel>月度總額</GlobalLabel>
                                        <GlobalSub>整個月份的可用加總</GlobalSub>
                                    </View>
                                </GlobalLeft>
                                <GlobalRight>
                                    <DollarSign>$</DollarSign>
                                    <BudgetInput
                                        value={draftMonthly}
                                        onChangeText={t => setDraftMonthly(t.replace(/[^\d]/g, ''))}
                                        keyboardType="number-pad"
                                        maxLength={8}
                                        selectTextOnFocus
                                    />
                                </GlobalRight>
                            </GlobalRow>

                            <GlobalRow>
                                <GlobalLeft>
                                    <MaterialIcons name="wb-sunny" size={24} color={theme.colors.secondary.mint} />
                                    <View>
                                        <GlobalLabel>每日限制</GlobalLabel>
                                        <GlobalSub>每天的理想花費上限</GlobalSub>
                                    </View>
                                </GlobalLeft>
                                <GlobalRight>
                                    <DollarSign>$</DollarSign>
                                    <BudgetInput
                                        value={draftDaily}
                                        onChangeText={t => setDraftDaily(t.replace(/[^\d]/g, ''))}
                                        keyboardType="number-pad"
                                        maxLength={7}
                                        selectTextOnFocus
                                    />
                                </GlobalRight>
                            </GlobalRow>

                            <SectionGap />

                            {/* ── Categories ── */}
                            <SectionTitle>各項分類上限</SectionTitle>
                            {CATEGORY_CONFIGS.map(cat => (
                                <CategoryRow key={cat.id}>
                                    <CategoryLeft>
                                        <CategoryIconCircle $bg={cat.badgeBg}>
                                            <MaterialIcons name={cat.icon as any} size={22} color="#FFFFFF" />
                                        </CategoryIconCircle>
                                        <CategoryInfo>
                                            <CategoryName>{cat.label}</CategoryName>
                                        </CategoryInfo>
                                    </CategoryLeft>

                                    <CategoryRight>
                                        <DollarSign>$</DollarSign>
                                        <BudgetInput
                                            value={draftCategory[cat.id] ?? '0'}
                                            onChangeText={text => handleCatChange(cat.id, text)}
                                            keyboardType="number-pad"
                                            maxLength={7}
                                            selectTextOnFocus
                                        />
                                    </CategoryRight>
                                </CategoryRow>
                            ))}
                        </BodyScrollView>

                        {/* ── Footer: 儲存 + 重設 ── */}
                        <FooterArea>
                            <SaveButton
                                colors={theme.colors.gradients.coral}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                onTouchEnd={handleSave}
                            >
                                <MaterialIcons name="save" size={20} color="#FFFFFF" />
                                <SaveText>儲存設定</SaveText>
                            </SaveButton>

                            <ResetButton onPress={handleReset} activeOpacity={0.7}>
                                <MaterialIcons name="refresh" size={20} color={theme.colors.black[60]} />
                                <ResetText>重設預設值</ResetText>
                            </ResetButton>
                        </FooterArea>
                    </Sheet>
                </SheetContainer>
            </KeyboardAvoidingView>
        </Modal>
    );
};


const Backdrop = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.45);
`;

const SheetContainer = styled.View`
    position: absolute;
    top: 10%;
    bottom: 0;
    left: 0;
    right: 0;
`;

const Sheet = styled.View`
    background-color: #f7f8f9;
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
    padding: 12px 20px 0 20px;
    height: 85%; /* 類全螢幕高度 */

    /* iOS shadow */
    shadow-color: #000;
    shadow-opacity: 0.12;
    shadow-radius: 20px;
    shadow-offset: 0px -4px;
    elevation: 10;
`;

const HandleBar = styled.View`
    width: 40px;
    height: 4px;
    border-radius: 2px;
    background-color: ${({ theme }) => theme.colors.black[30]};
    align-self: center;
    margin-bottom: 24px;
`;

const HeaderRow = styled.View`
    margin-bottom: 16px;
    align-items: flex-start;
`;

const HeaderTitle = styled.Text`
    font-size: 24px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.black[90]};
`;

const BodyScrollView = styled(ScrollView)`
    flex: 1;
`;

const SectionTitle = styled.Text`
    font-size: 16px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.black[60]};
    margin-bottom: 12px;
    margin-left: 2px;
`;

const SectionGap = styled.View`
    height: 24px;
`;

const GlobalRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 16px 18px;
    border-radius: 20px;
    margin-bottom: 12px;

    /* Shadow */
    shadow-color: #000;
    shadow-opacity: 0.03;
    shadow-radius: 8px;
    shadow-offset: 0px 2px;
    elevation: 1;
`;

const GlobalLeft = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 16px;
`;

const GlobalLabel = styled.Text`
    font-size: 18px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.black[85]};
`;

const GlobalSub = styled.Text`
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.black[50]};
    margin-top: 2px;
`;

const GlobalRight = styled.View`
    flex-direction: row;
    align-items: center;
`;

const CategoryRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 14px 18px;
    border-radius: 18px;
    margin-bottom: 12px;

    shadow-color: #000;
    shadow-opacity: 0.03;
    shadow-radius: 6px;
    shadow-offset: 0px 2px;
    elevation: 1;
`;

const CategoryLeft = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

const CategoryIconCircle = styled.View<{ $bg: string }>`
    width: 44px;
    height: 44px;
    border-radius: 22px;
    align-items: center;
    justify-content: center;
    background-color: ${({ $bg }) => $bg};
    margin-right: 14px;
`;

const CategoryInfo = styled.View``;

const CategoryName = styled.Text`
    font-size: 17px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.black[85]};
`;

const CategoryRight = styled.View`
    flex-direction: row;
    align-items: center;
`;

const DollarSign = styled.Text`
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.black[40]};
    margin-right: 6px;
`;

const BudgetInput = styled.TextInput`
    width: 100px;
    height: 40px;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.08);
    padding: 0 14px;
    font-size: 18px;
    font-weight: 800;
    text-align: right;
    color: ${({ theme }) => theme.colors.black[85]};
    background-color: #fcfcfc;
`;

const FooterArea = styled.View`
    padding: 16px 0 32px 0;
`;

const SaveButton = styled(LinearGradient)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    margin-bottom: 12px;
    min-height: 48px;

`;

const SaveText = styled.Text`
    color: #ffffff;
    font-size: 18px;
    font-weight: 800;
    margin-left: 8px;
`;

const ResetButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border-radius: 20px;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
`;

const ResetText = styled.Text`
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.black[60]};
    margin-left: 8px;
`;
