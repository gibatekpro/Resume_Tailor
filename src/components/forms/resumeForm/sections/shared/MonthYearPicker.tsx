import React, { useMemo } from "react";
import { MONTHS } from "../../../../../utils/applicationData";

interface MonthYearPickerProps {
    label: string;
    idPrefix: string;
    monthField: string;
    yearField: string;
    monthValue?: string;
    yearValue?: string | number;
    setFieldValue: (field: string, value: string) => void;
    inputFieldClassName: string;
    present?: { checked: boolean; onChange: (checked: boolean) => void };
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
    label,
    idPrefix,
    monthField,
    yearField,
    monthValue,
    yearValue,
    setFieldValue,
    inputFieldClassName,
    present,
}) => {
    const monthInputValue = useMemo(() => {
        if (!monthValue || !yearValue) {
            return "";
        }

        const monthIndex = MONTHS.findIndex((month) => month === monthValue);
        if (monthIndex < 0) {
            return "";
        }

        const normalizedYear = String(yearValue);
        const normalizedMonth = String(monthIndex + 1).padStart(2, "0");
        return `${normalizedYear}-${normalizedMonth}`;
    }, [monthValue, yearValue]);

    const handleMonthYearChange = (value: string) => {
        if (!value) {
            setFieldValue(monthField, "");
            setFieldValue(yearField, "");
            return;
        }

        const [year, month] = value.split("-");
        const monthIndex = Number(month) - 1;
        const mappedMonth = MONTHS[monthIndex] || "";

        setFieldValue(monthField, mappedMonth);
        setFieldValue(yearField, year || "");
    };

    return (
        <div className="grid grid-cols-12 items-center gap-2">
            <span className="col-span-2 text-sm font-normal text-gray-500">{label}</span>
            <div className="col-span-10 flex items-center gap-3">
                {present?.checked ? (
                    <div className={`${inputFieldClassName} flex-1 text-[#45464d] sm:text-sm`}>Present</div>
                ) : (
                    <input
                        id={`${idPrefix}-${label.toLowerCase()}Date`}
                        type="month"
                        value={monthInputValue}
                        onChange={(event) => handleMonthYearChange(event.target.value)}
                        className={`${inputFieldClassName} flex-1 cursor-pointer sm:text-sm`}
                    />
                )}
                {present && (
                    <label className="mt-1 flex shrink-0 cursor-pointer items-center gap-1.5 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={present.checked}
                            onChange={(event) => present.onChange(event.target.checked)}
                            className="h-4 w-4 cursor-pointer accent-[#2170e4]"
                        />
                        Present
                    </label>
                )}
            </div>
        </div>
    );
};
