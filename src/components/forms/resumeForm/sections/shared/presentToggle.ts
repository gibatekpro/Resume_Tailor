// "Present" checkbox for an entry's end date. Only the user ticks it, so the end date picker stays usable until they do.
export const presentToggle = (
    setFieldValue: (field: string, value: unknown) => void,
    path: string,
    entry: { current?: boolean },
) => ({
    checked: !!entry.current,
    onChange: (checked: boolean) => {
        setFieldValue(`${path}.current`, checked);
        if (checked) {
            setFieldValue(`${path}.endMonth`, "");
            setFieldValue(`${path}.endYear`, "");
        }
    },
});
