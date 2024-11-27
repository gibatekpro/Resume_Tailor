import React from 'react';
import { Page, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { ResumeStyleB } from '../components/resume-style-b/ResumeStyleB';
import {ResumeDocument} from "./ResumeDocument";

export const TestPrintPage: React.FC = () => {
    return (
        <div>
            <PDFDownloadLink document={<ResumeDocument/>} fileName="somename.pdf">

            </PDFDownloadLink>
        </div>
    );
};
