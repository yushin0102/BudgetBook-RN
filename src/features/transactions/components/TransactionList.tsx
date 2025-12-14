import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';

import { TransactionCard } from '~/features/transactions/components/TransactionCard';
import { UndoDeleteBanner } from '~/features/transactions/components/UndoDeleteBanner';
import type Transaction from '~/features/transactions/types/transaction';

type FlashListHandle = {
    scrollToOffset: (params: { offset: number; animated?: boolean }) => void;
};

type IProps = {
    items: Transaction[];
    onPressEdit: (id: string, amount: number) => void;
    onPressDelete: (tx: Transaction) => void;
    onPressRestore?: (tx: Transaction) => void;
};

export const TransactionList = ({ items, onPressEdit, onPressDelete, onPressRestore }: IProps) => {
    const flatListRef = useRef<FlashListHandle | null>(null);
    const [undoVisible, setUndoVisible] = useState(false);
    const [lastDeleted, setLastDeleted] = useState<Transaction | null>(null);
    const undoTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleDelete = (tx: Transaction) => {
        if (undoTimerRef.current) {
            clearTimeout(undoTimerRef.current);
            undoTimerRef.current = null;
        }
        setLastDeleted(tx);
        onPressDelete(tx);
        setUndoVisible(true);

        undoTimerRef.current = setTimeout(() => {
            setUndoVisible(false);
            undoTimerRef.current = null;
        }, 3000);
    };

    const handleUndo = () => {
        if (!lastDeleted) return;
        if (undoTimerRef.current) {
            clearTimeout(undoTimerRef.current);
            undoTimerRef.current = null;
        }
        onPressRestore?.(lastDeleted);
        setUndoVisible(false);
        setLastDeleted(null);
    };

    useEffect(() => {
        if (!items.length) return;
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }, [items]);

    if (!items.length) {
        return (
            <>
                <EmptyWrap>
                    <EmptyText>尚無任何記錄</EmptyText>
                </EmptyWrap>
                <UndoDeleteBanner visible={undoVisible} deletedTitle={lastDeleted?.note || ''} onUndo={handleUndo} />
            </>
        );
    }

    return (
        <>
            <FlashList
                ref={instance => (flatListRef.current = instance as any)}
                data={items}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TransactionCard tx={item} onPressEdit={onPressEdit} onPressDelete={() => handleDelete(item)} />
                )}
                contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 18 }}
            />
            <UndoDeleteBanner visible={undoVisible} deletedTitle={lastDeleted?.note || ''} onUndo={handleUndo} />
        </>
    );
};

const EmptyWrap = styled.View`
    padding: 32px;
    align-items: center;
    justify-content: center;
`;

const EmptyText = styled.Text`
    color: #999;
    font-size: 15px;
`;
