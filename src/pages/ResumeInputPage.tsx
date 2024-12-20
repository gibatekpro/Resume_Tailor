import React, { useEffect, useState } from "react";
import { Button, Form, Toast, ToastContainer } from "react-bootstrap";
import '../styles/resumeInput.css'; // Updated styles
import { useResumeProvider } from "../context/ResumeContext";
import {instructionData, jobDescriptionData} from "../data/instructionData";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {fetchOpenAIResponse} from "../services/OpenAIService";

export const ResumeInputPage: React.FC = () => {
    const { resumeData, setResumeData } = useResumeProvider();
    const {hideButton, setHideButton} = useResumeProvider();
    const [pastedData, setPastedData] = useState('');
    const [showToast, setShowToast] = useState(false); // State for controlling the toast visibility
    const [toastMessage, setToastMessage] = useState(''); // Custom message for each action
    const navigate = useNavigate();

    useEffect(() => {
        setPastedData(JSON.stringify(resumeData, null, 2));
    }, [resumeData]);

    useEffect(() => {
        setHideButton(false);
    }, []);

    // Formik for handling the copy action (first form)
    const { values, errors, touched, handleSubmit: handleTheSubmit, handleChange } = useFormik({
        initialValues: {
            instructionData: instructionData, // Instructions for OpenAI
        },
        onSubmit: (values) => {
            navigator.clipboard.writeText(values.instructionData)
                .then(() => {
                    showToastNotification("Instructions copied to clipboard!"); // Show toast on success
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        },
    });

    const pasteFromClipBoard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setPastedData(text);
            showToastNotification("Pasted from clipboard!"); // Show toast on paste
        } catch (err) {
            console.error('Failed to paste text from clipboard or invalid JSON format:', err);
        }
    };

    const handleResumeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const parsedData = JSON.parse(pastedData);
            setResumeData(parsedData);
            await getResponse();
            showToastNotification("Resume data submitted!"); // Show toast on submit
        } catch (error) {
            console.error('Failed to submit data. Invalid JSON:', error);
        }
    };

    const handleNavigate = () => {
        navigate('/print');
        showToastNotification("Navigated to print!"); // Show toast on navigation
    };

    // Function to show toast with custom message
    const showToastNotification = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const getResponse = async () => {
        try {
            const prompt = instructionData + jobDescriptionData;
            const response = await fetchOpenAIResponse(prompt);

            let jsonContent = response.choices[0]?.message?.content;

            console.log("Parsed JSON Response:", jsonContent);
        } catch (error) {
            console.error("Error parsing JSON response:", error);
        }
    };


    return (
        <div className="fancy-input-page-container">
            <div className="header-bar">
                <Button variant="outline-light" onClick={handleNavigate} className="fancy-btn">
                    Print
                </Button>
            </div>

            {/* Toast Notification */}
            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {/* First form for copying instructions */}
            <Form onSubmit={handleTheSubmit} className="fancy-form">
                <Form.Group className="mb-3" controlId="openAIInstruction">
                    <Form.Label className="fancy-label">Open AI Instructions</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="instructionData"
                        value={values.instructionData}
                        onChange={handleChange}
                        className="fancy-textarea"
                        isInvalid={!!errors.instructionData && touched.instructionData}
                    />
                    {errors.instructionData && touched.instructionData && (
                        <Form.Control.Feedback type="invalid">
                            {errors.instructionData}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <Button variant="outline-light" type="submit" className="fancy-btn">
                    Copy
                </Button>
            </Form>

            {/* Second form for pasting and submitting resume data */}
            <Form onSubmit={handleResumeSubmit} className="fancy-form">
                <Form.Group className="mb-3" controlId="pastedData">
                    <Form.Label className="fancy-label">Result</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={20}
                        name="pastedData"
                        value={pastedData} // Display the pastedData from the clipboard or modified content
                        onChange={(e) => setPastedData(e.target.value)} // Update the local state
                        className="fancy-textarea"
                    />
                </Form.Group>
                <div className="button-row">
                    <Button variant="outline-light" onClick={pasteFromClipBoard} className="fancy-btn">
                        Paste
                    </Button>
                    <Button variant="outline-light" type="submit" className="fancy-btn">
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
};
