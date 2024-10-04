
import React from 'react';
import { Col } from 'react-bootstrap';
import {LEFT_COL_BREAKPOINTS, RIGHT_COL_BREAKPOINTS} from "../constants/BreakPointsConstants";

interface CustomColProps {
    isLeft?: boolean;
    children: React.ReactNode;
}

export const CustomCol: React.FC<CustomColProps> = ({ isLeft, children }) => {
    const breakpoints = isLeft ? LEFT_COL_BREAKPOINTS : RIGHT_COL_BREAKPOINTS;

    return (
        <Col
            lg={breakpoints.LG}
            md={breakpoints.MD}
            sm={breakpoints.SM}
            xs={breakpoints.XS}
            className={isLeft ? "left-col" : "right-col"}
        >
            {children}
        </Col>
    );
};