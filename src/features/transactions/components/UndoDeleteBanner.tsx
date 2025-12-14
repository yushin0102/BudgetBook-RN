import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';

type Props = {
    visible: boolean;
    deletedTitle: string;
    onUndo: () => void;
};

export const UndoDeleteBanner = ({ visible, deletedTitle, onUndo }: Props) => {
    if (!visible) return null;

    return (
        <BannerContainer>
            <MessageText numberOfLines={1}>已刪除「{deletedTitle}」</MessageText>

            <UndoButton activeOpacity={0.7} onPress={onUndo}>
                <MaterialIcons name="undo" size={18} color="#FFAB91" />
                <UndoText>撤銷</UndoText>
            </UndoButton>
        </BannerContainer>
    );
};

const BannerContainer = styled.View`
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 24px;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: 16px 18px;
    border-radius: 24px;
    background-color: #fff7ea;
    border-width: 1px;
    border-color: #ffe0b2;

    /* iOS shadow */
    shadow-color: #000000;
    shadow-opacity: 0.06;
    shadow-radius: 10px;
    shadow-offset: 0px 4px;

    /* Android shadow */
    elevation: 3;
`;

const MessageText = styled.Text`
    flex: 1;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.black[70]};
`;

const UndoButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    margin-left: 16px;
`;

const UndoText = styled.Text`
    font-size: 14px;
    margin-left: 4px;
    color: #ffab91;
    font-weight: 600;
`;
