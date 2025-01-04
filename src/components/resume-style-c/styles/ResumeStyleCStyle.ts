import {CSSProperties} from "react";
import {textColor} from "../../../utils/ApplicationProperties";

export const ResumeStyleCStyle: {
    mainContainer: CSSProperties;
    h1: CSSProperties;
    h2: CSSProperties;
    h3: CSSProperties;
    h4: CSSProperties;
    text: CSSProperties;
    leftCol: CSSProperties;
    rightCol: CSSProperties;
    contactInfoP: CSSProperties;
    contactInfoA: CSSProperties;
    capitalizeText: CSSProperties;
    initialCaps: CSSProperties;
    boldText: CSSProperties;
    semiBoldText: CSSProperties;
    largeSpacing: CSSProperties;
    mediumSpacing: CSSProperties;
} = {
    mainContainer: {
        width: '100%',
        maxWidth: '800px',
        minWidth: '800px',
        margin: '0 auto',
        paddingTop: '50px',
        color: textColor,
    },
    h1: {
        fontSize: '25px',
        color: textColor,
        // fontFamily: 'Crimson Text serif',
    },
    h2: {
        fontSize: '23px',
        color: textColor,
        // fontFamily: 'Crimson Text serif',
    },
    h3: {
        fontSize: '21px',
        color: textColor,
        // fontFamily: 'Crimson Text serif',
    },
    h4: {
        fontSize: '18px',
        color: textColor,
    },
    text: {
        fontSize: '16px',
        color: textColor,
        // fontFamily: 'Crimson Text serif',
    },
    capitalizeText: {
        textTransform: 'uppercase',
    },
    initialCaps: {
        textTransform: 'capitalize',
    },
    boldText: {
        fontWeight: 'bold',
    },
    semiBoldText: {
        fontWeight: '500',
    },
    leftCol: {
        // border: '1px solid black',
        textAlign: 'left',
        // padding: '0px'
    },
    rightCol: {
        // border: '1px solid black',
        textAlign: 'right',
        // padding: '0px'
    },
    contactInfoP: {
        fontSize: '15px',
        fontStyle: 'italic',
    },
    contactInfoA: {
        fontSize: '15px',
        fontStyle: 'italic',
    },
    largeSpacing: {
        marginTop: '25px',
        marginBottom: '25px',
    },
    mediumSpacing: {
        marginTop: '10px',
        marginBottom: '10px',
    }


};