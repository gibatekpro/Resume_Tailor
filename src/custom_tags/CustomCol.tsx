
import React from 'react';
import { Col } from 'react-bootstrap';
import {LEFT_COL_BREAKPOINTS, RIGHT_COL_BREAKPOINTS} from "../constants/BreakPointsConstants";

interface CustomColProps {
    isLeft?: boolean;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string; // Optional additional class names
}

export const CustomCol: React.FC<CustomColProps> = ({ isLeft, style, className = '', children }) => {
    const breakpoints = isLeft ? LEFT_COL_BREAKPOINTS : RIGHT_COL_BREAKPOINTS;

    // Concatenate the default class with any additional className provided
    const colClassName = `${isLeft ? "left-col" : "right-col"} ${className}`.trim();

    return (
        <Col
            lg={breakpoints.LG}
            md={breakpoints.MD}
            sm={breakpoints.SM}
            xs={breakpoints.XS}
            className={colClassName}
            style={style}
        >
            {children}
        </Col>
    );
};