import { MONTHS } from "../../../../../utils/applicationData";

// "Present" checkbox for an entry's end date. An entry with a start date and no end date counts as ongoing,
// matching how the CV prints it. Unticking fills in this month so the entry stops printing as "Present".
export const presentToggle = (
    setFieldValue: (field: string, value: unknown) => void,
    path: string,
    entry: { startYear?: string; endYear?: string; current?: boolean },
) => ({
    checked: !!entry.current || (!!entry.startYear && !entry.endYear),
    onChange: (checked: boolean) => {
        setFieldValue(`${path}.current`, checked);
        if (checked) {
            setFieldValue(`${path}.endMonth`, "");
            setFieldValue(`${path}.endYear`, "");
        } else if (!entry.endYear) {
            const today = new Date();
            setFieldValue(`${path}.endMonth`, MONTHS[today.getMonth()]);
            setFieldValue(`${path}.endYear`, String(today.getFullYear()));
        }
    },
});
