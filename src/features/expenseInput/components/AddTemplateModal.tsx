import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, TextInput as RNTextInput, TouchableWithoutFeedback, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled, { useTheme } from 'styled-components/native';

import { CATEGORIES } from '~/features/expenseInput/types/config';
import { QuickTemplate, TemplateCategoryId } from '~/features/expenseInput/types/template';

type Props = {
    visible: boolean;
    onClose: () => void;
    onConfirm: (t: QuickTemplate) => void;
};

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export default function AddTemplateModal({ visible, onClose, onConfirm }: Props) {
    const theme = useTheme();
    const fade = useRef(new Animated.Value(0)).current;
    const slide = useRef(new Animated.Value(50)).current;

    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState<TemplateCategoryId>('food');
    const [noteError, setNoteError] = useState<string | null>(null);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true }),
                Animated.spring(slide, { toValue: 0, useNativeDriver: true }),
            ]).start();
        } else {
            fade.setValue(0);
            slide.setValue(50);
        }
    }, [visible]);

    const disabled = useMemo(() => {
        const n = Number(amount);
        return !note.trim() || Number.isNaN(n) || n <= 0;
    }, [note, amount]);

    const handleConfirm = () => {
        const n = Math.round(Number(amount));
        if (disabled) return;

        const trimmed = note.trim();
        if (trimmed.length > 15) {
            setNoteError('範本名稱最多 15 個字');
            return;
        }

        onConfirm({
            id: genId(),
            note: trimmed,
            amount: n,
            categoryId,
        });
        setNote('');
        setAmount('');
        setCategoryId('food'); // 預設類別
        setNoteError(null);
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <Backdrop as={Animated.View} style={{ opacity: fade }} />
            </TouchableWithoutFeedback>
            <CenteredContainer>
                <Sheet as={Animated.View} style={{ transform: [{ translateY: slide }], opacity: fade }}>
                    <HeaderRow>
                        <Title>新增快速範本</Title>
                        <CloseBtn onPress={onClose}>
                            <MaterialIcons name="close" size={22} color={theme.colors.black[60]} />
                        </CloseBtn>
                    </HeaderRow>

                    <Label>範本名稱</Label>
                    <Input
                        placeholder="例如：固定健身房"
                        value={note}
                        onChangeText={text => {
                            setNote(text);
                            if (noteError) setNoteError(null);
                        }}
                        maxLength={20}
                        keyboardType="default"
                    />
                    {noteError && <ErrorText>{noteError}</ErrorText>}

                    <Label>金額</Label>
                    <Input
                        placeholder="50"
                        value={amount}
                        onChangeText={t => setAmount(t.replace(/[^\d]/g, ''))}
                        keyboardType="number-pad"
                        maxLength={6}
                    />

                    <Label>類別</Label>
                    <CategoryGrid>
                        {CATEGORIES.map(c => {
                            const selected = c.id === categoryId;
                            return (
                                <CategoryBtn
                                    key={c.id}
                                    $selected={selected}
                                    $bg={selected ? c.color : '#F5F5F5'}
                                    onPress={() => setCategoryId(c.id)}
                                    activeOpacity={0.8}
                                >
                                    <IconBadge $bg={selected ? '#FFFFFF' : '#EDEDED'}>
                                        <MaterialIcons
                                            name={c.icon as any}
                                            size={22}
                                            color={selected ? theme.colors.black[60] : theme.colors.black[50]}
                                        />
                                    </IconBadge>
                                    <CategoryText $selected={selected}>{c.label}</CategoryText>
                                </CategoryBtn>
                            );
                        })}
                    </CategoryGrid>

                    <FooterRow>
                        <Ghost onPress={onClose} activeOpacity={0.7}>
                            <GhostText>取消</GhostText>
                        </Ghost>
                        <Primary disabled={disabled} onPress={handleConfirm} activeOpacity={0.7}>
                            <PrimaryText>確定新增</PrimaryText>
                        </Primary>
                    </FooterRow>
                </Sheet>
            </CenteredContainer>
        </Modal>
    );
}

const Backdrop = styled.View`
    position: absolute;
    inset: 0;
    background-color: ${({ theme }) => theme.colors.blackOpacity[50]};
`;

const CenteredContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const Sheet = styled.View`
    width: 90%;
    align-self: center;
    background-color: #fff;
    border-radius: 20px;
    padding: 16px 16px 12px 16px;
    shadow-color: #000;
    shadow-opacity: 0.12;
    shadow-radius: 14px;
    shadow-offset: 0px 6px;
    elevation: 6;
`;

const HeaderRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 4px 4px 10px 4px;
`;

const Title = styled.Text`
    font-size: 20px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.black[90]};
`;

const CloseBtn = styled.TouchableOpacity`
    padding: 6px;
`;

const Label = styled.Text`
    margin: 6px 4px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.black[40]};
`;

const Input = styled.TextInput`
    height: 46px;
    border-radius: 12px;
    background-color: #f7f7f7;
    padding: 0 14px;
    margin-bottom: 12px;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.black[90]};
`;

const CategoryGrid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
`;

const CategoryBtn = styled.TouchableOpacity<{ $selected: boolean; $bg: string }>`
    width: 30%;
    padding: 16px;
    border-radius: 18px;
    justify-content: center;
    align-items: center;
    background-color: ${({ $bg }) => $bg};
    margin-bottom: 12px;
`;

const IconBadge = styled.View<{ $bg: string }>`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    background-color: ${({ $bg }) => $bg};
    margin-bottom: 8px;
`;

const CategoryText = styled.Text<{ $selected: boolean }>`
    font-size: 16px;
    font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
    color: ${({ $selected, theme }) => ($selected ? theme.colors.black[80] : theme.colors.black[50])};
`;

const FooterRow = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
`;

const Ghost = styled.TouchableOpacity`
    flex: 1;
    padding-vertical: 12px;
    border-radius: 12px;
    background-color: #fff;
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.black[20]};
    justify-content: center;
    align-items: center;
`;

const GhostText = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.black[60]};
`;

const Primary = styled.TouchableOpacity<{ disabled?: boolean }>`
    flex: 1;
    padding-vertical: 12px;
    border-radius: 12px;
    justify-content: center;
    align-items: center;
    background-color: ${({ disabled }) => (disabled ? '#ffbdb7' : '#FF8A80')};
`;

const PrimaryText = styled.Text`
    font-size: 16px;
    color: #fff;
    font-weight: 800;
`;

const ErrorText = styled.Text`
    margin: 4px 4px 0;
    font-size: 12px;
    color: #e53935;
`;
