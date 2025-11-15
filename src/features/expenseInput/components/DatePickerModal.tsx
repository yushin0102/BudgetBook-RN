import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styled, { useTheme } from 'styled-components/native';

import {
    DatePickerColumnProps,
    DatePickerModalProps,
    WheelDatePickerProps,
} from '~/features/expenseInput/types/datePicker';
import { daysInMonth, pad2, parseISO, todayISO, toISO, yesterdayISO } from '~/features/expenseInput/utils';
const ITEM_HEIGHT = 40;

export const DatePickerModal = ({ visible, value, onConfirm, onCancel }: DatePickerModalProps) => {
    const { width } = useWindowDimensions();
    const PAGE_WIDTH = width - 50;
    const theme = useTheme();

    // 進場/退場動畫
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(300)).current;

    const initial = useMemo(() => parseISO(value && value.trim() ? value : todayISO()), [value]);
    const [year, setYear] = useState<number>(initial.y);
    const [month, setMonth] = useState<number>(initial.m);
    const [day, setDay] = useState<number>(initial.d);
    const [selectedBtn, setSelectedBtn] = useState<string | null>(null);

    useEffect(() => {
        // spring 讓元素滑動進入
        // timing 讓背景淡入淡出
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
                Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start();
        }
    }, [visible, value]);

    // 月份/年份變化時，若 day 超出該月上限就回落月底
    useEffect(() => {
        const max = daysInMonth(year, month);
        if (day > max) setDay(max);
    }, [year, month]);

    const pickToday = () => {
        const t = parseISO(todayISO());
        setYear(t.y);
        setMonth(t.m);
        setDay(t.d);
        setSelectedBtn('today');
    };
    const pickYesterday = () => {
        const t = parseISO(yesterdayISO());
        setYear(t.y);
        setMonth(t.m);
        setDay(t.d);
        setSelectedBtn('yesterday');
    };

    const handleConfirm = () => onConfirm(toISO(year, month, day));

    return (
        <Modal transparent visible={visible} animationType="none">
            <TouchableWithoutFeedback onPress={onCancel}>
                <AnimatedBackdrop style={{ opacity: fadeAnim }} />
            </TouchableWithoutFeedback>

            <AnimatedContainer style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim }}>
                <ContentInner $PAGE_WIDTH={PAGE_WIDTH}>
                    <HeaderRow>
                        <HeaderTitle>選擇日期</HeaderTitle>
                        <HeaderActions>
                            <GhostBtn onPress={onCancel}>
                                <GhostText>取消</GhostText>
                            </GhostBtn>
                            <PrimaryBtn onPress={handleConfirm}>
                                <PrimaryText>完成</PrimaryText>
                            </PrimaryBtn>
                        </HeaderActions>
                    </HeaderRow>

                    <QuickRow>
                        <QuickBtn onPress={pickToday} $isSelected={selectedBtn === 'today'}>
                            <MaterialIcons name="today" size={16} color={theme.colors.black[70]} />
                            <QuickText>今天</QuickText>
                        </QuickBtn>
                        <QuickBtn onPress={pickYesterday} $isSelected={selectedBtn === 'yesterday'}>
                            <MaterialIcons name="history" size={16} color={theme.colors.black[70]} />
                            <QuickText>昨天</QuickText>
                        </QuickBtn>
                    </QuickRow>

                    <WheelDatePicker
                        year={year}
                        month={month}
                        day={day}
                        onYearChange={setYear}
                        onMonthChange={setMonth}
                        onDayChange={setDay}
                    />
                </ContentInner>
            </AnimatedContainer>
        </Modal>
    );
};

const WheelColumn = ({
    data,
    value,
    onChange,
    format,
    infinite = false,
}: DatePickerColumnProps & { infinite?: boolean }) => {
    const ref = useRef<FlatList<number>>(null);
    const ITEM_HEIGHT = 40;

    // 呈現無限滾動的資料
    const loopData = useMemo(() => {
        if (!infinite) return data;
        const repeat = 100;
        return Array.from({ length: data.length * repeat }, (_, i) => data[i % data.length]);
    }, [data, infinite]);

    const getItemLayout = (_: unknown, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });

    // 初始滾輪位置置中
    useEffect(() => {
        if (!infinite || !ref.current || !loopData.length) return;
        const idxInData = data.indexOf(value) - 1;
        if (idxInData < 0) return;
        requestAnimationFrame(() => {
            ref.current?.scrollToIndex({ index: idxInData, animated: false });
        });
    }, [infinite, loopData, value]);

    const handleEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        const idx = Math.round(offsetY / ITEM_HEIGHT);
        const actualIdx = infinite ? idx % data.length : idx;
        const next = data[(actualIdx + data.length) % data.length];

        // 無限模式下，保持滾輪位置於中間，避免越滾越遠
        // if (infinite) {
        //     const mid = Math.floor(loopData.length / 2);
        //     const midIdx = mid + actualIdx - data.length / 2;
        //     requestAnimationFrame(() => {
        //         ref.current?.scrollToIndex({ index: midIdx, animated: false });
        //     });
        // }

        if (next !== value) onChange(next);
    };

    return (
        <WheelColumnView>
            <FlatList
                ref={ref}
                data={loopData}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => (
                    <ItemTouchable activeOpacity={0.7} onPress={() => onChange(item)}>
                        <WheelItem $active={item === value}>{format ? format(item) : String(item)}</WheelItem>
                    </ItemTouchable>
                )}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                snapToAlignment="center"
                decelerationRate="fast"
                // onMomentumScrollEnd={handleEnd}
                getItemLayout={getItemLayout}
                bounces={false}
            />
        </WheelColumnView>
    );
};

const WheelDatePicker = ({ year, month, day, onYearChange, onMonthChange, onDayChange }: WheelDatePickerProps) => {
    const years = useMemo(() => {
        // 往前後各 1 年
        const nowY = new Date().getFullYear();
        return Array.from({ length: 3 }, (_, i) => nowY - 1 + i);
    }, []);
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
    const days = useMemo(() => Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1), [year, month]);

    return (
        <WheelWrap>
            <WheelColumn data={years} value={year} onChange={onYearChange} />
            <WheelColumn data={months} value={month} onChange={onMonthChange} format={pad2} infinite />
            <WheelColumn data={days} value={day} onChange={onDayChange} format={pad2} infinite />
        </WheelWrap>
    );
};

const AnimatedBackdrop = styled(Animated.View)`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.blackOpacity[50]};
`;

const AnimatedContainer = styled(Animated.View)`
    position: absolute;
    top: 30%;
    align-self: center;
    background-color: white;
    border-radius: 24px;
    elevation: 6; /* Android shadow */
    shadow-color: #000; /* iOS shadow */
    shadow-offset: 0px 2px;
    shadow-opacity: 0.2;
    shadow-radius: 6px;
`;

const ContentInner = styled.View<{ $PAGE_WIDTH: number }>`
    align-self: center;
    width: ${({ $PAGE_WIDTH }) => $PAGE_WIDTH}px;
    padding-bottom: 16px;
`;

const HeaderRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 8px 20px;
`;

const HeaderTitle = styled.Text`
    font-size: 20px;
    font-weight: 700;
`;

const HeaderActions = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 10px;
` as unknown as typeof View;

const GhostBtn = styled.TouchableOpacity`
    padding: 8px 12px;
`;
const GhostText = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.black[70]};
`;

const PrimaryBtn = styled.TouchableOpacity`
    padding: 8px 12px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.main?.primary || '#FF8A80'};
`;
const PrimaryText = styled.Text`
    font-size: 16px;
    color: white;
    font-weight: 700;
`;

const QuickRow = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 0 20px 8px 20px;
` as unknown as typeof View;

const QuickBtn = styled.TouchableOpacity<{ $isSelected: boolean }>`
    padding: 10px 14px;
    border-radius: 999px;
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.black[20]};
    flex-direction: row;
    align-items: center;
    background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.secondary.sand : 'transparent')};
`;
const QuickText = styled.Text`
    margin-left: 6px;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.black[70]};
`;

const WheelWrap = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 8px 24px 12px 24px;
    padding: 8px 12px;
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.black[20]};
    border-radius: 12px;
`;

const ItemTouchable = styled.TouchableOpacity`
    height: ${ITEM_HEIGHT}px;
    justify-content: center;
`;

const WheelItem = styled.Text<{ $active?: boolean }>`
    height: ${ITEM_HEIGHT}px;
    text-align: center;
    font-size: 16px;
    line-height: ${ITEM_HEIGHT}px;
    color: ${({ $active }) => ($active ? '#222' : '#999')};
    font-weight: ${({ $active }) => ($active ? '700' : '500')};
`;

const WheelColumnView = styled.View`
    width: 30%;
    height: ${ITEM_HEIGHT * 5}px;
`;
