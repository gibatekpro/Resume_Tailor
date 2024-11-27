import React from "react";
import html2canvas from "html2canvas";
import {ResumeStyleB} from "../components/resume-style-b/ResumeStyleB";
import { jsPDF } from "jspdf";

export const TestPrintPageB: React.FC = () => {
    const printDocument = () => {
        const input = document.getElementById("divToPrint");
        if (input) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4"); // Portrait, millimeters, A4 size

                // Get canvas dimensions for scaling
                const imgWidth = 240; // A4 width in mm
                const pageHeight = 300; // A4 height in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;

                let position = 0;

                // Add the image to the PDF
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                // Handle multi-page PDF
                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save("download.pdf");
            });
        }
    };

    return (
        <div className={"mt-36"}>
            <div className="mb5">
                <button onClick={printDocument}>Print</button>
            </div>
            <div
                id="divToPrint"
                className="mt4"
                style={{
                    backgroundColor: "#f5f5f5",
                    width: "240mm",
                    minHeight: "297mm",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <ResumeStyleB/>
            </div>
        </div>
    );
};
