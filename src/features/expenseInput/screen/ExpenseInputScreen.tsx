import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import { ExpenseCategorySelector } from '~/features/expenseInput/components/ExpenseCategorySelector';
import { ExpenseForm } from '~/features/expenseInput/components/ExpenseForm';
import { HeaderSummary } from '~/features/expenseInput/components/HeaderSummary';
import { QuickTemplates } from '~/features/expenseInput/components/QuickTemplates';
import { useExpenseEditor } from '~/features/expenseInput/hooks/useExpenseEditor';
import { useQuickTemplates } from '~/features/expenseInput/hooks/useQuickTemplates';
import { MOCK_TEMPLATES } from '~/features/expenseInput/types/config';
import type ExpenseDraft from '~/features/expenseInput/types/template';
import { todayISO } from '~/features/expenseInput/utils';
import { useTransactionStore } from '~/store/useTransactionStore';

export const ExpenseInputScreen = () => {
    const { templates, addTemplate, removeTemplate } = useQuickTemplates(MOCK_TEMPLATES);
    const { draft, setMode, setAmount, setNote, setDate, setCategory, applyTemplate, resetDraft } = useExpenseEditor();

    const activeTemplate = useMemo(
        () => templates.find(t => t.id === draft.templateId) ?? null,
        [templates, draft.templateId],
    );

    const handleChangeDraft = useCallback(
        (patch: Partial<ExpenseDraft>) => {
            if (patch.mode) setMode(patch.mode);
            if (patch.amount !== undefined) setAmount(patch.amount);
            if (patch.note !== undefined) setNote(patch.note);
            if (patch.date) setDate(patch.date);
        },
        [setMode, setAmount, setNote, setDate],
    );

    const addTransaction = useTransactionStore(s => s.addTransaction);

    const handleSave = () => {
        if (!draft.categoryId) {
            // showToast('請先選擇支出類別');
            return;
        }
        console.log('🔥payload最終要傳出去的api參數', draft);
        addTransaction({
            mode: draft.mode,
            amount: draft.amount ?? 0,
            note: draft.note ?? '',
            dateISO: draft.date ?? todayISO?.() ?? new Date().toISOString().split('T')[0],
            categoryId: draft.categoryId as any,
        });

        resetDraft(); // 送出後清空
    };

    useEffect(() => {
        console.log('draft', draft);
    }, [draft]);

    return (
        <ContentWrapper>
            <ScrollView>
                {!!draft?.amount && <HeaderSummary draft={draft} activeTemplate={activeTemplate} />}

                <ExpenseForm draft={draft} onChangeDraft={handleChangeDraft} onSubmit={handleSave} />

                <QuickTemplates
                    templates={templates}
                    onTemplateAdded={addTemplate}
                    onTemplateDeleted={removeTemplate}
                    activeTemplateId={draft.templateId}
                    onApplyTemplate={tpl => {
                        applyTemplate(tpl);
                        if (tpl.note !== undefined) {
                            setNote(tpl.note);
                        }
                    }}
                />

                <ExpenseCategorySelector
                    selectedCategoryId={draft.categoryId}
                    onSelectCategory={catId => setCategory(catId)}
                />
            </ScrollView>
        </ContentWrapper>
    );
};

const ContentWrapper = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.black[0]};
`;
