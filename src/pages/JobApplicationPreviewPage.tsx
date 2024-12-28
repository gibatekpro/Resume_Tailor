import React, {useEffect, useRef, useState} from "react";
import {HeaderSection} from '../components/resume-style-a/HeaderSection';
import '../styles/resumePrint.css';
import {useNavigate} from "react-router-dom";
import {ResumeStyleA} from "../components/resume-style-a/ResumeStyleA";
import {ResumeStyleB} from "../components/resume-style-b/ResumeStyleB";
import JobApplicationService from "../services/JobApplicationService";
import {
    APP_TITLE,
} from "../data/applicationData";
import {JobApplicationInfo} from "../models/JobApplicationInfo";
import ROUTES from "../data/routes";
import {DefaultResumeData} from "../data/defaultResumeData";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useFormik} from "formik";
import {resumeData} from "../data/resumeData";
import * as Yup from "yup";
import STORAGE from "../data/storage";

export const JobApplicationPreviewPage: React.FC<{
    setHideNavbar: (hide: boolean) => void,
    setAppTitle: React.Dispatch<React.SetStateAction<string>>
}> = ({setHideNavbar, setAppTitle}) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const [isLoading, setIsLoading] = useState(false);
    const [applicationData, setApplicationData] = useState<JobApplicationInfo>(JSON.parse(localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || "{}"));
    const [theAppTitle, setTheAppTitle] = useState<string>(JSON.parse(localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || "{}").openAIDocumentTitle);
    const navigate = useNavigate();
    const [saved, setSaved] = useState(localStorage.getItem(STORAGE.LOCAL_STORAGE_RESUME_DATA));
    const [savedApplicationData, setSavedApplicationData] = useState<JobApplicationInfo>(JSON.parse(localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || JSON.parse("{}")));
    const resumeDataOpenAI = saved ? JSON.parse(saved) : DefaultResumeData;

    const saveAndPrint = async () => {
        setIsLoading(true);
        try {
            // Save current form values to localStorage
            const storedData: JobApplicationInfo = JSON.parse(
                localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || "{}"
            );
            const updatedData = {
                ...storedData,
                ...jobApplicationFormFormik.values,
            };
            localStorage.setItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA, JSON.stringify(updatedData));

            // Save job application to the server
            await JobApplicationService.saveJobApplication(user ?? "", updatedData);

            // Update the app title if available
            setAppTitle(updatedData.openAIDocumentTitle || APP_TITLE);

            // Navigate to the resume print page
            setIsLoading(false);
            setHideNavbar(true);
            navigate(ROUTES.RESUME_PRINT_PAGE);
        } catch (error) {
            console.error("Error saving and printing:", error);
            setIsLoading(false);
        }
    };


    const jobApplicationFormFormik = useFormik({
        initialValues: {
            openAIJobTitle: savedApplicationData.openAIJobTitle || "",
            openAIJobCompanyName: savedApplicationData.openAIJobCompanyName || "",
            openAIJobLocation: savedApplicationData.openAIJobLocation || "",
            openAIDocumentTitle: savedApplicationData.openAIDocumentTitle || "",
            openAISimpleJobDescription: savedApplicationData.openAISimpleJobDescription || "",
        },
        enableReinitialize: true,
        validationSchema: () => Yup.object().shape({
            openAIJobTitle: Yup.string().min(4).required(),
            openAIJobCompanyName: Yup.string().min(4).required(),
            openAIJobLocation: Yup.string().min(4).required(),
            openAIDocumentTitle: Yup.string().min(4).required(),
            openAISimpleJobDescription: Yup.string().min(20).required(),
        }),
        onSubmit: (values) => {
            saveAndPrint();
        },
    });

    useEffect(() => {
        console.log("JobApplicationPreviewPage", savedApplicationData.openAIJobTitle);
    }, []);

    // useEffect(() => {
    //     const updateApplicationData = () => {
    //         const storedData: JobApplicationInfo = JSON.parse(localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || "{}");
    //         console.log("savedApplicationData" + JSON.stringify(storedData));
    //         const updatedData = {
    //             ...storedData,
    //             ...jobApplicationFormFormik.values,
    //         };
    //         localStorage.setItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA, JSON.stringify(updatedData)); // Save updated data back to localStorage
    //     };
    //
    //     updateApplicationData();
    // }, [jobApplicationFormFormik.values]);


    const styles = {
        leftColumn: {
            padding: {
                paddingLeft: 10,
                paddingRight: 20,
            },
            titleRow: {
                padding: 10,
                marginBottom: 10,
                fontWeight: "bold",
                color: "gray",
            },
        },
        rightBorderStyle: {
            borderRight: "1px solid lightgray",
        },
        leftBorderStyle: {
            borderLeft: "1px solid lightgray",
        },
        borderBottomStyle: {
            borderBottom: "1px solid lightgray",
        },
        borderTopStyle: {
            borderTop: "1px solid lightgray",
        },
        listItem: {
            padding: 5,
            borderBottom: "1px solid lightgray",
            color: "black",
        },
        jobInfo: {
            header: {
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: 5,
            },
            subheader: {
                fontSize: "1.2rem",
                color: "#555",
                marginBottom: 10,
            },
            normalText: {
                fontSize: "1rem",
                color: "#666",
                marginBottom: 8,
            },
        },
    };

    const overlayStyle = {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const loadingMessageStyle = {
        fontSize: "1.5rem",
        color: "#333",
        fontWeight: "bold" as const,
    };

    return (
        <div className="row g-1 p-2 p-md-0">
            {isLoading && (
                <div style={overlayStyle}>
                    <div style={loadingMessageStyle}>Loading, please wait...</div>
                </div>
            )}
            <h1 className={"flex justify-center font-bold "} style={{
                fontSize: "1.5rem",
                margin: 10,
            }}>Preview Job Application</h1>
            <div className="col-md-8 mb-4 px-4">
                <div style={{
                    border: "1px solid #0f5a73",
                    borderRadius: "5px",
                    display: "inline-block",
                    width: "fit-content",
                    height: "fit-content",
                    padding: "10px"
                }}>
                    <ResumeStyleB resumeData={resumeDataOpenAI}/>
                </div>
            </div>
            <div
                className="col-md-4"
                style={{
                    ...styles.leftBorderStyle,
                    ...styles.leftColumn.padding,
                }}
            >
                <div>
                    <Row className={"row row-cols-2"}
                        style={{
                            ...styles.leftColumn.titleRow,
                            ...styles.borderTopStyle,
                            ...styles.borderBottomStyle,
                        }}
                    >
                        <Col xs={4} className={"flex justify-end"}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
                            </svg>

                        </Col>
                        <Col xs={8}>
                            <h5>Application Details</h5>
                        </Col>
                    </Row>

                    <div style={{marginTop: "10px"}} className={"px-2"}>
                        <Form onSubmit={jobApplicationFormFormik.handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="openAIJobTitle">
                                    <Form.Label>Job Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g Electrician"
                                        onChange={jobApplicationFormFormik.handleChange}
                                        defaultValue={jobApplicationFormFormik.values.openAIJobTitle || ""}
                                    />
                                    {jobApplicationFormFormik.touched.openAIJobTitle && jobApplicationFormFormik.errors.openAIJobTitle && (
                                        <span
                                            className="sm:text-sm text-red-600">Required</span>
                                    )}
                                </Form.Group>

                                <Form.Group as={Col} controlId="openAIJobCompanyName">
                                    <Form.Label>Company Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g Amazon Ltd"
                                        onChange={jobApplicationFormFormik.handleChange}
                                        defaultValue={jobApplicationFormFormik.values.openAIJobCompanyName || ""}
                                    />

                                    {jobApplicationFormFormik.touched.openAIJobCompanyName && jobApplicationFormFormik.errors.openAIJobCompanyName && (
                                        <span
                                            className="sm:text-sm text-red-600">Required</span>
                                    )}
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="openAIJobLocation">
                                    <Form.Label>Job Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g London, UK - Hybrid"
                                        onChange={jobApplicationFormFormik.handleChange}
                                        defaultValue={jobApplicationFormFormik.values.openAIJobLocation || ""}
                                    />
                                    {jobApplicationFormFormik.touched.openAIJobLocation && jobApplicationFormFormik.errors.openAIJobLocation && (
                                        <span
                                            className="sm:text-sm text-red-600">Required</span>
                                    )}
                                </Form.Group>

                                <Form.Group as={Col} controlId="openAIDocumentTitle">
                                    <Form.Label>Document Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g john-doe-companyName"
                                        onChange={jobApplicationFormFormik.handleChange}
                                        defaultValue={jobApplicationFormFormik.values.openAIDocumentTitle || ""}
                                    />
                                    {jobApplicationFormFormik.touched.openAIDocumentTitle && jobApplicationFormFormik.errors.openAIDocumentTitle && (
                                        <span
                                            className="sm:text-sm text-red-600">Required</span>
                                    )}
                                </Form.Group>
                            </Row>
                            <Form.Group className="mb-3" controlId="openAISimpleJobDescription">
                                <Form.Label>Simple Job Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="e.g. Software developer to generate web pages"
                                    onChange={jobApplicationFormFormik.handleChange}
                                    defaultValue={jobApplicationFormFormik.values.openAISimpleJobDescription || ""}
                                />
                                {jobApplicationFormFormik.touched.openAISimpleJobDescription && jobApplicationFormFormik.errors.openAISimpleJobDescription && (
                                    <span
                                        className="sm:text-sm text-red-600">Required</span>
                                )}
                            </Form.Group>
                            <Button variant="primary" type="submit" className="fancy-btn w-full">
                                Save and Print
                            </Button>
                        </Form>
                    </div>

                </div>
            </div>
            {/*<div className="col-md-6 mt-10 mt-md-0">*/}
            {/*    <div*/}
            {/*        className="position-sticky d-flex justify-content-center align-items-center"*/}
            {/*        style={{*/}
            {/*            top: "2rem",*/}
            {/*            height: "100vh" // Ensures the div takes the full viewport height for centering*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <button*/}
            {/*            style={{*/}
            {/*                backgroundColor: "green",*/}
            {/*                color: "white",*/}
            {/*                border: "none",*/}
            {/*                borderRadius: "50%",*/}
            {/*                width: "100px",*/}
            {/*                height: "100px",*/}
            {/*                fontSize: "16px",*/}
            {/*                cursor: "pointer"*/}
            {/*            }}*/}
            {/*            onClick={saveAndPrint}*/}
            {/*        >*/}
            {/*            Save Application*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </div>
    );
};
