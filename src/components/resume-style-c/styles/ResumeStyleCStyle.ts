import type { CSSProperties } from "react";
import {textColor} from "../../../utils/applicationData";

const mutedColor = '#5b6070';
const ruleColor = '#d5d9e3';

// Style C: clean single-column sans serif. Sizes are in points so the PDF matches the preview.
export const ResumeStyleCStyle: {
    mainContainer: CSSProperties;
    header: CSSProperties;
    h1: CSSProperties;
    h2: CSSProperties;
    h3: CSSProperties;
    h4: CSSProperties;
    text: CSSProperties;
    mutedText: CSSProperties;
    entryHead: CSSProperties;
    period: CSSProperties;
    contactList: CSSProperties;
    contactInfoP: CSSProperties;
    contactInfoA: CSSProperties;
    section: CSSProperties;
    entry: CSSProperties;
    bullets: CSSProperties;
    bullet: CSSProperties;
    boldText: CSSProperties;
    semiBoldText: CSSProperties;
} = {
    mainContainer: {
        padding: '12mm var(--cv-page-gutter)',
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        fontSize: '9.5pt',
        lineHeight: 1.45,
        color: textColor,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '8mm',
        paddingBottom: '4mm',
        borderBottom: `2px solid ${textColor}`,
    },
    h1: {
        fontSize: '22pt',
        fontWeight: 700,
        letterSpacing: '0.03em',
        lineHeight: 1.1,
        textTransform: 'uppercase',
        color: textColor,
    },
    h2: {
        marginBottom: '2mm',
        paddingBottom: '1mm',
        borderBottom: `1px solid ${ruleColor}`,
        fontSize: '10.5pt',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: textColor,
    },
    h3: {
        marginTop: '1.5mm',
        fontSize: '12pt',
        fontWeight: 500,
        color: textColor,
    },
    h4: {
        fontSize: '10.5pt',
        fontWeight: 600,
        color: textColor,
    },
    text: {
        fontSize: '9.5pt',
        color: textColor,
    },
    mutedText: {
        color: mutedColor,
    },
    entryHead: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '4mm',
    },
    period: {
        flex: '0 0 auto',
        fontSize: '9pt',
        fontWeight: 500,
        color: mutedColor,
    },
    contactList: {
        flex: '0 0 auto',
        textAlign: 'right',
    },
    contactInfoP: {
        fontSize: '9pt',
        color: mutedColor,
    },
    contactInfoA: {
        fontSize: '9pt',
        color: mutedColor,
    },
    section: {
        marginTop: '5mm',
    },
    entry: {
        marginBottom: '3mm',
        breakInside: 'avoid',
    },
    bullets: {
        marginTop: '1mm',
    },
    bullet: {
        marginTop: '0.4mm',
    },
    boldText: {
        fontWeight: 700,
    },
    semiBoldText: {
        fontWeight: 500,
    },
};
