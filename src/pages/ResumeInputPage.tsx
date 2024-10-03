import React, { useEffect, useState } from "react";
import '../styles/resumeInput.css';
import { useResumeProvider } from "../context/ResumeContext";
import { instructionData } from "../data/instructionData";
import { Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

export const ResumeInputPage: React.FC = () => {
    const { resumeData, setResumeData } = useResumeProvider();
    const [pastedData, setPastedData] = useState(''); // Store pasted data temporarily
    const navigate = useNavigate();

    useEffect(() => {
        // Check if resumeData exists and update the pasted data accordingly
        setPastedData(JSON.stringify(resumeData, null, 2));
    }, [resumeData]);

    // Formik for handling the copy action (first form)
    const { values, errors, touched, handleSubmit, handleChange } = useFormik({
        initialValues: {
            instructionData: instructionData, // Instructions for OpenAI
        },
        onSubmit: (values) => {
            // Handle copying the textarea value to the clipboard
            navigator.clipboard.writeText(values.instructionData)
                .then(() => {
                    console.log('Text copied to clipboard:', values.instructionData);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        },
    });

    const pasteFromClipBoard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setPastedData(text); // Only set the pastedData state without updating resumeData
        } catch (err) {
            console.error('Failed to paste text from clipboard or invalid JSON format:', err);
        }
    };

    // Function to handle submission of the pasted data and set resumeData state
    const handleResumeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const parsedData = JSON.parse(pastedData); // Parse the pasted data to JSON
            setResumeData(parsedData); // Update resumeData with the form field data
            console.log('Resume Data Submitted:', parsedData);
        } catch (error) {
            console.error('Failed to submit data. Invalid JSON:', error);
        }
    };

    const handleNavigate = () => {
        navigate('/'); // Navigate to a specific route
    };

    return (
        <div className="input-page-container">
            <div>
                <div>
                    <button onClick={handleNavigate}>Print</button>
                </div>
            </div>

            {/* First form for copying instructions */}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="openAIInstruction">
                    <Form.Label>Open AI Instructions</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="instructionData"
                        value={values.instructionData}
                        onChange={handleChange}
                        isInvalid={!!errors.instructionData && touched.instructionData}
                    />
                    {errors.instructionData && touched.instructionData && (
                        <Form.Control.Feedback type="invalid">
                            {errors.instructionData}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <Button variant="primary" type="submit">
                    Copy
                </Button>
            </Form>

            {/* Second form for pasting and submitting resume data */}
            <Form onSubmit={handleResumeSubmit}>
                <Form.Group className="mb-3" controlId="pastedData">
                    <Form.Label>Result</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={20}
                        name="pastedData"
                        value={pastedData} // Display the pastedData from the clipboard or modified content
                        onChange={(e) => setPastedData(e.target.value)} // Update the local state
                    />
                </Form.Group>
                <Button variant="primary" onClick={pasteFromClipBoard}>
                    Paste
                </Button>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};
