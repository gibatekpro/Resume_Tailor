import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {DESIGN_BORDER} from "../../constants/DesignConstants";


export const CertificationsSection:React.FC = () => {
    return(
        <Container style={{
            minHeight: "50px",
            maxHeight: "50px",
        }}>
            <Row style={{
                ...DESIGN_BORDER
            }}>
                <Col lg={3} md={3} sm={3} xs={12} style={{
                    ...DESIGN_BORDER,
                    minHeight: "50px",
                    maxHeight: "50px",
                }}>

                </Col>
                <Col lg={9} md={9} sm={9} xs={12}  style={{
                    ...DESIGN_BORDER,
                    minHeight: "50px",
                    maxHeight: "50px",
                }}>

                </Col>
            </Row>
        </Container>
    );
}