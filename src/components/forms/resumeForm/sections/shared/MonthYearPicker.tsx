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
            <div className="col-span-10">
                <input
                    id={`${idPrefix}-${label.toLowerCase()}Date`}
                    type="month"
                    value={monthInputValue}
                    onChange={(event) => handleMonthYearChange(event.target.value)}
                    className={`${inputFieldClassName} cursor-pointer sm:text-sm`}
                />
            </div>
        </div>
    );
};
