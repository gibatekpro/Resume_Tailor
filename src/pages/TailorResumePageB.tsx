import React, {useEffect, useState} from "react";
import '../styles/resumeInput.css';
import ResumeForm from "../components/forms/resumeForm/ResumeForm";
import {useFormik} from "formik";
import {DefaultResumeData} from "../data/defaultResumeData";
import {OpenAIInstruction} from "../models/OpenAIInstruction";
import {CustomResumeData} from "../data/customResumeData";
import {InstructionResumeData} from "../data/instructionResumeData";
import * as Yup from "yup";
import {fetchOpenAIResponse} from "../services/OpenAIService";
import InstructionForm from "../components/forms/instructionForm/InstructionForm";
import {useNavigate} from "react-router-dom";
import {useResumeProvider} from "../context/ResumeContext";
import ROUTES from "../data/routes";
import JobApplicationService from "../services/JobApplicationService";
import {useAuth} from "../context/auth/AuthProvider";
import {JobApplicationInfo} from "../models/JobApplicationInfo";
import {ResumeInfo} from "../models/ResumeInfo";
import {CustomAccordion} from "../custom_tags/CustomAccordion";
import {openAIInstruction} from "../data/openAIInstruction";
import moment from "moment";
import {SavedResumesResponse} from "../models/SavedResumesResponse";
import {Col, Row} from "react-bootstrap";
import STORAGE from "../data/storage";

export const TailorResumePageB: React.FC = () => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const [jobApplicationInfo, setJobApplicationInfo] = useState<JobApplicationInfo>();
    const {resumeData, setResumeData} = useResumeProvider();
    const [savedRules, setSavedRules] = useState<string[]>(openAIInstruction.rules || []);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const saved = localStorage.getItem(STORAGE.LOCAL_STORAGE_RESUME_DATA);
    const SavedResumeDataOpenAI = saved ? JSON.parse(saved) : DefaultResumeData;
    const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
    const [isGeneratedFormOpen, setIsGeneratedFormOpen] = useState(false);


    const [createNewHover, setCreateNewHover] = useState(false);
    const [isBeingEdited, setIsBeingEdited] = useState<SavedResumesResponse>();
    const [resumeToDelete, setResumeToDelete] = useState<SavedResumesResponse>();
    const [isBeingEditedIndex, setIsBeingEditedIndex] = useState<number>(-1);
    const [isSaveComplete, setIsSaveComplete] = useState(false);
    const [isSaveFailed, setIsSaveFailed] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [resumeFormClassName, setResumeFormClassName] = useState("col-md-4 pb-4");
    const [resumePreviewClassName, setResumePreviewClassName] = useState("col-md-8 px-2");
    const [isResumesPanelOpen, setIsResumesPanelOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [resumeList, setResumeList] = useState<SavedResumesResponse[]>([])
    const [activeTab, setActiveTab] = useState("link-1");


    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    }


    const handleSave = () => {
        openDialog()
    }

    const openDialog = () => {
        setIsDialogOpen(true);
    }

    const closeDialog = () => {
        setIsDialogOpen(false);
        setIsSaveComplete(false);
        setIsSaveFailed(false);
    }


    const openResumesPanel = () => {
        setResumeFormClassName("col-md-4 pb-4");
        setResumePreviewClassName("col-md-5 px-2");
        setIsResumesPanelOpen(true)
    }

    const closeResumesPanel = () => {
        setResumeFormClassName("col-md-4 pb-4");
        setResumePreviewClassName("col-md-8 px-2");
        setIsResumesPanelOpen(false)
    }

    const handleResumeClick = (resume: SavedResumesResponse) => {
        setIsBeingEdited(resume)
        customResumeFormFormik.setValues(resume.data);
    };


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


    const customResumeFormFormik = useFormik({
        initialValues: isBeingEdited?.data || DefaultResumeData,
        onSubmit: (values) => {
        },
    });

    const generatedResumeFormFormik = useFormik({
        initialValues: SavedResumeDataOpenAI || DefaultResumeData,
        onSubmit: async (values) => {
            setIsLoading(true);
            setResumeData(values);
            if (!user) {
                alert("You must be logged in to save your job application.");
                return;
            }
            // try {
            //     await JobApplicationService.saveJobApplication(
            //         user ?? "", // Ensures `user` is never `null`, defaults to an empty string
            //         JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPLICATION_DATA) || "{}")
            //     );
            //     setIsLoading(false);
            //     alert("Job application saved successfully.");
            // } catch (error) {
            // }
            navigate(ROUTES.APPLICATION_PREVIEW);
            setIsLoading(false)
            // navigate(ROUTES.RESUME_INPUT_PAGE);
        },
    });

    const instructionFormFormik = useFormik({
        initialValues: {
            ...InstructionResumeData,
            jobDescriptionData: localStorage.getItem(STORAGE.JOB_DESCRIPTION) || "",
            rules: savedRules || InstructionResumeData.rules,
        },
        validationSchema: () => Yup.object().shape({
            jobDescriptionData: Yup.string().min(100).required()
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const openAIInstruction: OpenAIInstruction = {
                    ...values,
                    resumeInfo: customResumeFormFormik.values,
                };

                // Save rules (if applicable)
                if (openAIInstruction.rules && user) {
                    localStorage.setItem(STORAGE.JOB_DESCRIPTION, values.jobDescriptionData || "");
                    await saveInstructionRules(user, openAIInstruction.rules);
                }

                // Fetch OpenAI Response
                const response = await fetchOpenAIResponse(openAIInstruction);

                if (response) {
                    const parsedResponse = response;
                    console.log(parsedResponse);
                    localStorage.setItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA, JSON.stringify(parsedResponse) || "{}");
                    setJobApplicationInfo(parsedResponse);
                    await generatedResumeFormFormik.setValues(parsedResponse.resumeInfo);
                }
            } catch (error) {
                console.error("Error during resume generation:");
            } finally {
                setIsLoading(false);
            }
        }

    });


    const saveInstructionRules = async (uid: string, rules: string[]) => {
        try {
            await JobApplicationService.saveRules(uid, rules);
        } catch (error) {
            console.error("Error saving rules", error);
            return null;
        }
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

    const blurredStyle = {
        filter: "blur(3px)",
        pointerEvents: "none" as const,
    };

    const handleCreateNewCV = () => {

        setIsBeingEdited({
            id: undefined,
            data: DefaultResumeData
        })

        customResumeFormFormik.setValues(DefaultResumeData);

    }


    useEffect(() => {

        localStorage.setItem(STORAGE.LOCAL_STORAGE_RESUME_DATA, JSON.stringify(generatedResumeFormFormik.values));
        localStorage.setItem(STORAGE.JOB_DESCRIPTION, instructionFormFormik?.values?.jobDescriptionData || "");
        const savedJobApplicationInfo = {
            date: moment(new Date(), "YYYY-MM-DD HH:mm"),
            openAIDocumentTitle: jobApplicationInfo?.openAIDocumentTitle,
            openAIJobTitle: jobApplicationInfo?.openAIJobTitle,
            openAIJobCompanyName: jobApplicationInfo?.openAIJobCompanyName,
            openAIExpectedSalary: jobApplicationInfo?.openAIExpectedSalary,
            openAIJobLocation: jobApplicationInfo?.openAIJobLocation,
            openAISimpleJobDescription: jobApplicationInfo?.openAISimpleJobDescription,
            resumeInfo: generatedResumeFormFormik.values,
        }
    }, [generatedResumeFormFormik]);

    useEffect(() => {
        setIsLoading(true);
        const fetchResumes = async () => {
            try {
                const savedResumes: SavedResumesResponse[] = await JobApplicationService.getAllSavedResumes();

                setResumeList(savedResumes);

                if (savedResumes.length > 0){

                    setIsBeingEdited(savedResumes[0])
                    setIsBeingEditedIndex(0);

                }

            } catch (error) {
                console.error("Error fetching job applications:", error);
                setIsLoading(false);
            }
        };

        const fetchSavedInstructionRules = async () => {
            try {
                const rules = await JobApplicationService.getRules(user || "");
                setSavedRules(rules);
            } catch (error) {
                console.error("Error saving rules", error);
                return null;
            }
        };


        fetchResumes();
        fetchSavedInstructionRules();
        setIsLoading(false);

    }, []);

    useEffect(() => {
        if (savedRules.length > 0) {
            instructionFormFormik.setFieldValue('rules', savedRules);
        }
    }, [savedRules]);

    useEffect(() => {
        isBeingEdited != null ? customResumeFormFormik.setValues(isBeingEdited?.data) : customResumeFormFormik.setValues(DefaultResumeData)
    }, [isBeingEdited]);

    return (

        <div className="bg-gray-100 py-4">

            {isLoading && (
                <div style={overlayStyle}>
                    <div style={loadingMessageStyle}>Loading, please wait...</div>
                </div>
            )}

            <div style={isLoading ? blurredStyle : {}}>

                <div className="row g-1 p-2 p-md-0">

                    {isResumesPanelOpen && (
                        <div
                            className="col-md-4 pb-4"
                            style={{
                                ...styles.rightBorderStyle,
                                ...styles.leftColumn.padding,
                            }}
                        >
                            <div>
                                <Row
                                    style={{
                                        ...styles.leftColumn.titleRow,
                                        ...styles.borderTopStyle,
                                        ...styles.borderBottomStyle,
                                    }}
                                >
                                    <Col xs={9}>
                                        <h5>Saved CVs</h5>
                                    </Col>
                                    <Col xs={3}>
                                        <button
                                            type="button"
                                            className="btn"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="Close"
                                            onClick={closeResumesPanel}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-x-lg"
                                                viewBox="0 0 16 16"
                                                cursor="pointer"
                                            >
                                                <path
                                                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                            </svg>
                                        </button>
                                    </Col>
                                </Row>

                                <div style={{marginTop: "10px"}}>
                                    {isLoading ? (
                                        <p>Loading resumes...</p>
                                    ) : (
                                        <>
                                            <div
                                                style={{
                                                    padding: "10px",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                    backgroundColor: createNewHover ? "#6CB4EE" : "#89CFF0",
                                                    borderBottom: "1px solid #ddd",
                                                    textAlign: "center",
                                                    transition: "background-color 0.3s ease", // Smooth transition
                                                }}
                                                onMouseEnter={() => setCreateNewHover(true)}
                                                onMouseLeave={() => setCreateNewHover(false)}
                                                onClick={() => {
                                                    handleCreateNewCV();
                                                    setIsBeingEditedIndex(-1)
                                                }}
                                            >
                                                + <span className={"ml-4"}>Create New CV</span>
                                            </div>

                                            {resumeList.map((resume, index) => (
                                                <Row
                                                    key={resume.id}
                                                    style={{
                                                        display: "flex", // Flexbox for layout
                                                        justifyContent: "space-between", // Space between text and SVG
                                                        alignItems: "center", // Center items vertically
                                                        padding: "10px",
                                                        cursor: "pointer",
                                                        borderBottom: "1px solid #ddd",
                                                        backgroundColor: index === isBeingEditedIndex ? "darkgray" : "transparent",
                                                    }}
                                                    className="hover:bg-gray-100 mx-0 row row-cols-2"
                                                >
                                                    {/* Resume Name Column */}
                                                    <Col
                                                        lg={12}
                                                        onClick={() => {
                                                            handleResumeClick(resume);
                                                            setIsBeingEditedIndex(index);
                                                        }}
                                                    >
                                                        {resume.data.resumeName || "Untitled Resume"}
                                                    </Col>

                                                    {/* Trash Icon Column */}
                                                    {/*<Col lg={3} className={"flex align-items-end justify-end"}>*/}
                                                    {/*    <svg*/}
                                                    {/*        xmlns="http://www.w3.org/2000/svg"*/}
                                                    {/*        width="16"*/}
                                                    {/*        height="16"*/}
                                                    {/*        fill="currentColor"*/}
                                                    {/*        className="bi bi-trash3"*/}
                                                    {/*        viewBox="0 0 16 16"*/}
                                                    {/*        // onClick={() => handleDeleteResume(resume)}*/}
                                                    {/*        style={{cursor: "pointer"}} // Ensures pointer cursor for the icon*/}
                                                    {/*    >*/}
                                                    {/*        <path*/}
                                                    {/*            d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>*/}
                                                    {/*    </svg>*/}
                                                    {/*</Col>*/}
                                                </Row>
                                            ))}

                                        </>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                    <div
                        className={resumeFormClassName}
                        style={{
                            ...styles.rightBorderStyle,
                            ...styles.leftColumn.padding,
                        }}
                    >
                        <div
                            style={{}}
                        >
                            <Row style={{
                                ...styles.leftColumn.titleRow,
                                ...styles.borderTopStyle,
                                ...styles.borderBottomStyle
                            }}>
                                <Col xs={3} sm={3} md={3} lg={3} xl={3} className={"flex"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black"
                                         className="bi bi-list align-items-center justify-center cursor-pointer"
                                         viewBox="0 0 16 16" onClick={openResumesPanel}>
                                        <path fillRule="evenodd"
                                              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                                    </svg>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} xl={6} style={styles.rightBorderStyle}>
                                    Template
                                </Col>
                                <Col xs={3} sm={3} md={3} lg={3} xl={3}
                                     style={{alignItems: "center", textAlign: "center"}}>
                                    <button type="button" className="btn" data-bs-toggle="tooltip"
                                            data-bs-placement="top" title="Add Section">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                        </svg>
                                    </button>
                                </Col>
                            </Row>
                        </div>

                        <CustomAccordion
                            isOpen={isFormOpen}
                            setIsOpen={setIsFormOpen}
                            children={<ResumeForm
                                resumeFormFormik={customResumeFormFormik}
                            />}
                        />

                    </div>


                    <div className="col-md-4 px-2">
                        <InstructionForm
                            isLoading={isLoading}
                            instructionFormFormik={instructionFormFormik}/>
                    </div>

                    {!isResumesPanelOpen && (
                        <div
                            className={resumeFormClassName}
                            style={{
                                ...styles.leftBorderStyle,
                                ...styles.leftColumn.padding,
                            }}
                        >
                            <div
                                style={{}}
                            >
                                <Row style={{
                                    ...styles.leftColumn.titleRow,
                                    ...styles.borderTopStyle,
                                    ...styles.borderBottomStyle
                                }}>
                                    <Col xs={4} sm={4} md={4} lg={4} xl={4} className="flex">
                                        <button
                                            onClick={() => {
                                                setIsBeingEditedIndex(-1);
                                                customResumeFormFormik.setValues(generatedResumeFormFormik.values);
                                            }}
                                            style={{
                                                backgroundColor: "white",
                                                border: "1px solid darkgray",
                                                color: "black",
                                                padding: "4px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontSize: 12,
                                                transition: "background-color 0.3s, color 0.3s",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "darkgray";
                                                e.currentTarget.style.color = "white";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "white";
                                                e.currentTarget.style.color = "black";
                                            }}
                                        >
                                            Use As Template
                                        </button>
                                    </Col>

                                    <Col xs={5} sm={5} md={5} lg={5} xl={5} style={styles.rightBorderStyle} className={"pl-2"}>
                                        AI Generated Output
                                    </Col>
                                    <Col xs={2} sm={2} md={2} lg={2} xl={2}
                                         style={{alignItems: "center", textAlign: "center"}}>
                                        <button type="button" className="btn" data-bs-toggle="tooltip"
                                                data-bs-placement="top" title="Add Section">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                                <path fillRule="evenodd"
                                                      d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                            </svg>
                                        </button>
                                    </Col>
                                </Row>
                            </div>

                            <CustomAccordion isOpen={isGeneratedFormOpen} setIsOpen={setIsGeneratedFormOpen}
                                             children={<ResumeForm
                                                 hasSubmitButton={true}
                                                 buttonTitle={"Preview Application"}
                                                 resumeFormFormik={generatedResumeFormFormik}
                                             />}
                            />

                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};
