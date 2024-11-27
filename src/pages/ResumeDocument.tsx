import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import {ResumeStyleB} from "../components/resume-style-b/ResumeStyleB";
import React from "react";

// Create Document Component
export const ResumeDocument: React.FC = () => {

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <ResumeStyleB/>
            </Page>
        </Document>
    );

}