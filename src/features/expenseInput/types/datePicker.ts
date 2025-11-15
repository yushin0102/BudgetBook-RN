export type WheelDatePickerProps = {
    year: number;
    month: number;
    day: number;
    onYearChange: (y: number) => void;
    onMonthChange: (m: number) => void;
    onDayChange: (d: number) => void;
};

export type DatePickerModalProps = {
    visible: boolean;
    value: string; // YYYY-MM-DD
    onConfirm: (iso: string) => void;
    onCancel: () => void;
};

export type DatePickerColumnProps = {
    data: number[];
    value: number;
    onChange: (v: number) => void;
    format?: (n: number) => string;
};
