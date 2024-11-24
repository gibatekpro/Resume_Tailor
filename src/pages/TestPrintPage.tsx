import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import {ResumeStyleB} from "../components/resume-style-b/ResumeStyleB";

// Create styles
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

// Create Document Component
export const TestPrintPage:React.FC = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <ResumeStyleB/>
        </Page>
    </Document>
);