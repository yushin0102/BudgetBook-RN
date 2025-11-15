import React, { useCallback, useState } from 'react';
import { LayoutAnimation, Platform, UIManager, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

import AddTemplateModal from '~/features/expenseInput/components/AddTemplateModal';
import SectionTitle from '~/features/expenseInput/components/SectionTitle';
import { CATEGORY_STYLE } from '~/features/expenseInput/types/config';
import { QuickTemplate } from '~/features/expenseInput/types/template';
import theme from '~/styles/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const animateLayout = () => {
    LayoutAnimation.configureNext({
        duration: 400,
        update: { type: LayoutAnimation.Types.easeInEaseOut },
        create: { type: LayoutAnimation.Types.easeIn, property: LayoutAnimation.Properties.opacity },
        delete: { type: LayoutAnimation.Types.easeOut, property: LayoutAnimation.Properties.scaleXY },
    });
};

type Props = {
    templates: QuickTemplate[];
    onApplyTemplate: (tpl: QuickTemplate) => void;
    onTemplateAdded: (tpl: QuickTemplate) => void;
    onTemplateDeleted: (id: string) => void;
};

export const QuickTemplates = ({ templates, onApplyTemplate, onTemplateAdded, onTemplateDeleted }: Props) => {
    const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const handleConfirmTemplate = useCallback(
        (tpl: QuickTemplate) => {
            animateLayout();
            onTemplateAdded(tpl);
            setIsAddTemplateOpen(false);
        },
        [onTemplateAdded],
    );

    return (
        <>
            <Container>
                <SectionTitle>快速範本</SectionTitle>

                <ChipsWrap>
                    {templates?.map(tpl => (
                        <Chip
                            key={tpl.id}
                            activeOpacity={0.7}
                            $bgColor={CATEGORY_STYLE[tpl.categoryId]?.bg}
                            onPress={() => {
                                if (deleteTargetId) {
                                    // 若目前處於刪除目標選取狀態，點擊切換/關閉刪除目標
                                    setDeleteTargetId(prev => (prev === tpl.id ? null : tpl.id));
                                    return;
                                }
                                onApplyTemplate(tpl);
                            }}
                            onLongPress={() => setDeleteTargetId(tpl.id)}
                        >
                            {deleteTargetId === tpl.id && (
                                <IconBadge>
                                    <CloseBtn
                                        onPress={() => {
                                            animateLayout();
                                            onTemplateDeleted(tpl.id);
                                            setDeleteTargetId(null);
                                        }}
                                    >
                                        <MaterialIcons name="close" size={16} color={theme.colors.black[60]} />
                                    </CloseBtn>
                                </IconBadge>
                            )}

                            <ChipText style={{ color: CATEGORY_STYLE[tpl.categoryId]?.text }}>
                                {`${tpl.note} $${tpl.amount}`}
                            </ChipText>
                        </Chip>
                    ))}

                    <AddButton
                        activeOpacity={0.5}
                        onPress={() => {
                            setDeleteTargetId(null);
                            setIsAddTemplateOpen(true);
                        }}
                    >
                        <MaterialIcons name="add" size={18} color={theme.colors.black[60]} />
                        <AddText>新增範本</AddText>
                    </AddButton>
                </ChipsWrap>
            </Container>
            <AddTemplateModal
                visible={isAddTemplateOpen}
                onClose={() => setIsAddTemplateOpen(false)}
                onConfirm={handleConfirmTemplate}
            />
        </>
    );
};

const Container = styled.View`
    margin-top: 24px;
    padding-horizontal: 22px;
`;

const ChipsWrap = styled.View`
    margin-top: 8px;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: space-between;
    min-height: 100px;
`;

const Chip = styled.TouchableOpacity<{ $bgColor: string }>`
    width: 48%;
    height: 48px;
    border-radius: 999px;
    padding-horizontal: 14px;
    justify-content: center;
    background-color: ${p => p.$bgColor};
    shadow-color: #000;
    shadow-opacity: 0.08;
    shadow-radius: 8px;
    shadow-offset: 0px 2px;
    elevation: 2;
`;

const ChipText = styled.Text`
    font-size: 14px;
    font-weight: 700;
`;

const AddButton = styled.TouchableOpacity`
    width: 48%;
    height: 48px;
    border-radius: 999px;
    border-width: 1.5px;
    border-style: dashed;
    border-color: ${p => p.theme.colors.black[20]};
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const AddText = styled.Text`
    margin-left: 6px;
    font-size: 14px;
    font-weight: 700;
    color: ${p => p.theme.colors.black[70]};
`;

const CloseBtn = styled.TouchableOpacity``;

const IconBadge = styled.View`
    width: 16px;
    height: 16px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    position: absolute;
    top: 2px;
    right: 8px;
`;
