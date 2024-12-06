import React, {useEffect, useState} from "react";
import moment from "moment";
import {CustomAccordionStyleB} from "../custom_tags/CustomAccordionStyleB";
import {Button, Card, Col, Fade, Nav, Row, Spinner} from "react-bootstrap";
import "../styles/myJobApplications.css";
import {ResumeStyleB} from "../components/resume-style-b/ResumeStyleB";
import JobApplicationService from "../services/JobApplicationService";
import {JobApplicationInfo} from "../models/JobApplicationInfo";
import {useNavigate} from "react-router-dom";
import ROUTES from "../data/routes";
import {APP_TITLE, LOCAL_STORAGE_APPLICATION_DATA} from "../data/applicationData";
import {CustomAccordion} from "../custom_tags/CustomAccordion";
import ResumeForm from "../components/forms/resumeForm/ResumeForm";
import {useFormik} from "formik";
import {CustomResumeData} from "../data/customResumeData";
import {resumeData} from "../data/resumeData";
import {ResumeStyleA} from "../components/resume-style-a/ResumeStyleA";
import {DefaultResumeData} from "../data/defaultResumeData";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import * as Yup from "yup";
import {ResumeInfo} from "../models/ResumeInfo";
import {SavedResumesResponse} from "../models/SavedResumesResponse";
import {fontSize} from "html2canvas/dist/types/css/property-descriptors/font-size";


export const CreateCV: React.FC = () => {
    const [createNewHover, setCreateNewHover] = useState(false);
    const [isBeingEdited, setIsBeingEdited] = useState<SavedResumesResponse>();
    const [resumeToDelete, setResumeToDelete] = useState<SavedResumesResponse>();
    const [isBeingEditedIndex, setIsBeingEditedIndex] = useState<number>(-1);
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const [isLoading, setIsLoading] = useState(false);
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
    const [selectedApplication, setSelectedApplication] = useState<JobApplicationInfo>();
    const navigate = useNavigate();
    const inputFieldClassName =
        "mt-1 block w-full px-3 py-2 focus:outline-none " +
        "focus:ring-0 focus:border-black focus:border-2 sm:text-sm";

    const designBorder = {
        border: '1px solid black',
        // border: 'none',
    };    //Current date


    useEffect(() => {
        const fetchResumes = async () => {
            setIsLoading(true);
            try {
                const savedResumes: SavedResumesResponse[] = await JobApplicationService.getAllSavedResumes();

                setResumeList(savedResumes);

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching job applications:", error);
                setIsLoading(false);
            }
        };

        fetchResumes();
    }, []);

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
            leftRight: "1px solid lightgray",
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

    const blurredStyle = {
        filter: "blur(3px)",
        pointerEvents: "none" as const,
    };

    const handleNavigate = (path: string) => {
        localStorage.setItem(LOCAL_STORAGE_APPLICATION_DATA, JSON.stringify(selectedApplication))
        navigate(path)
    }

    const customResumeFormFormik = useFormik({
        initialValues: isBeingEdited?.data || DefaultResumeData,
        onSubmit: (values) => {
        },
    });

    const resumeNameFormFormik = useFormik({
        initialValues: {
            resumeName: ""
        },
        validationSchema: () => Yup.object().shape({
            resumeName: Yup.string().min(4).required()
        }),
        onSubmit: async (values) => {
            setIsSaveLoading(true);
            setIsSaveComplete(false);
            setIsSaveFailed(false);
            try {
                if (isBeingEdited?.id) {
                    console.log("Is being edited " + isBeingEdited?.id + isBeingEdited?.data);
                    await JobApplicationService.editResume(
                        user ?? "", isBeingEdited?.id || "", isBeingEdited!.data
                    )
                } else {
                    console.log("Is New CV");
                    const theResumeData: ResumeInfo = customResumeFormFormik.values;
                    theResumeData.resumeName = values.resumeName;
                    await JobApplicationService.saveResume(
                        user ?? "", theResumeData
                    );
                }

                setIsSaveLoading(false);
                setIsSaveComplete(true);
                setIsSaveFailed(false);

                const fetchResumes = async () => {
                    setIsLoading(true);
                    try {
                        const savedResumes: SavedResumesResponse[] = await JobApplicationService.getAllSavedResumes();

                        setResumeList(savedResumes);

                        setIsLoading(false);
                    } catch (error) {
                        console.error("Error fetching job applications:", error);
                        setIsLoading(false);
                    }
                };

                fetchResumes();

            } catch (error) {
                setIsSaveLoading(false);
                setIsSaveComplete(false);
                setIsSaveFailed(true);
            }
        },
    });

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) setActiveTab(eventKey);
    };

    const handleDeleteResume = (resume: SavedResumesResponse) => {
        setResumeToDelete(resume)
        openDeleteDialog()
    }

    const openDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    }

    const deleteResume = async () => {
        try {
            await JobApplicationService.deleteResume(user ?? "", resumeToDelete?.id || "")
            const fetchResumes = async () => {
                setIsLoading(true);
                try {
                    const savedResumes: SavedResumesResponse[] = await JobApplicationService.getAllSavedResumes();

                    setResumeList(savedResumes);

                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching job applications:", error);
                    setIsLoading(false);
                }
            };

            fetchResumes();

        } catch (error) {
            console.log(error)
        }
        setIsDeleteDialogOpen(false)
    }


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
        console.log(resume)
        setIsBeingEdited(resume)
        customResumeFormFormik.setValues(resume.data);
        resumeNameFormFormik.setValues({
            resumeName: resume?.data.resumeName || ""
        });
    };

    useEffect(() => {

        setIsBeingEdited({
            ...isBeingEdited,
            data: customResumeFormFormik.values,
        });

    }, [customResumeFormFormik.values]);

    const handleCreateNewCV = () => {

        setIsBeingEdited({
            id: undefined,
            data: DefaultResumeData
        })

        customResumeFormFormik.setValues(DefaultResumeData);
        resumeNameFormFormik.setValues({
            resumeName: ""
        });

    }

    return (
        <div className="py-0 my-2">
            {isLoading && (
                <div style={overlayStyle}>
                    <div style={loadingMessageStyle}>Loading, please wait...</div>
                </div>
            )}
            {isDialogOpen && (
                <div className={"relative z-20 bg-white"}>
                </div>
            )}
            {!isLoading && (
                <div className="row g-1 p-2 p-md-0">
                    <Dialog open={isDialogOpen} as="div" className="relative z-10 focus:outline-none"
                            onClose={closeDialog}>
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                {!isSaveComplete && !isSaveFailed && (
                                    <DialogPanel
                                        transition
                                        className="w-full max-w-md rounded-xl bg-gray-100 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                                    >
                                        <DialogTitle as="h3" className="text-black font-medium mb-4">
                                            <div className={"flex justify-between items-center"}>
                                                Save resume
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"
                                                     onClick={closeDialog} cursor={"pointer"}>
                                                    <path
                                                        d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                                </svg>
                                            </div>
                                        </DialogTitle>

                                        <form onSubmit={resumeNameFormFormik.handleSubmit}>
                                            <div className={"mb-4"}>
                                                <input
                                                    id="resumeName"
                                                    name="resumeName"
                                                    type="text"
                                                    placeholder="Resume Name"
                                                    className={inputFieldClassName}
                                                    onChange={resumeNameFormFormik.handleChange}
                                                    value={resumeNameFormFormik?.values?.resumeName}
                                                />
                                                {resumeNameFormFormik.touched.resumeName && resumeNameFormFormik.errors.resumeName && (
                                                    <span
                                                        className="sm:text-sm text-red-600">Input a name for the resume</span>
                                                )}

                                                <span></span>
                                            </div>
                                            <Button
                                                type="submit"
                                                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                                disabled={isSaveLoading}
                                            >
                                                {isSaveLoading ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            className="me-2"
                                                        />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    "Save"
                                                )}
                                            </Button>
                                        </form>
                                        {/*<div className="mt-4">*/}
                                        {/*    <Button*/}
                                        {/*        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"*/}
                                        {/*        onClick={closeDialog}*/}
                                        {/*    >*/}
                                        {/*        Got it, thanks!*/}
                                        {/*    </Button>*/}
                                        {/*</div>*/}
                                    </DialogPanel>
                                )}
                                {isSaveComplete && (
                                    <DialogPanel
                                        transition
                                        className="w-full max-w-md rounded-xl bg-gray-100 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                                    >
                                        <DialogTitle as="h3" className="text-black font-medium mb-4">
                                            Successful
                                        </DialogTitle>
                                        <text>The resume has been saved successfully</text>
                                        <div className="mt-4">
                                            <Button
                                                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                                onClick={closeDialog}
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </DialogPanel>
                                )}
                            </div>
                        </div>
                    </Dialog>
                    <Dialog open={isDeleteDialogOpen} as="div" className="relative z-10 focus:outline-none"
                            onClose={closeDeleteDialog}>
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <DialogPanel
                                    transition
                                    className="w-full max-w-md rounded-xl bg-gray-100 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                                >
                                    <div className={"flex justify-between items-center mb-4"}>
                                        {`Delete CV: ${resumeToDelete?.data.resumeName}`}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"
                                             onClick={closeDeleteDialog} cursor={"pointer"}>
                                            <path
                                                d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                        </svg>
                                    </div>
                                    <text>Are you sure you want to delete this cv</text>
                                    <div className="mt-4">
                                        <Button
                                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                            onClick={deleteResume}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>
                    {isResumesPanelOpen && (
                        <div
                            className="col-md-2 pb-4"
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
                                                        backgroundColor: index === isBeingEditedIndex ? "#F3F4F6" : "transparent",
                                                    }}
                                                    className="hover:bg-gray-100 mx-0 row row-cols-2"
                                                >
                                                    {/* Resume Name Column */}
                                                    <Col
                                                        lg={9}
                                                        onClick={() => {
                                                            handleResumeClick(resume);
                                                            setIsBeingEditedIndex(index);
                                                        }}
                                                    >
                                                        {resume.data.resumeName || "Untitled Resume"}
                                                    </Col>

                                                    {/* Trash Icon Column */}
                                                    <Col lg={3} className={"flex align-items-end justify-end"}>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-trash3"
                                                            viewBox="0 0 16 16"
                                                            onClick={() => handleDeleteResume(resume)}
                                                            style={{cursor: "pointer"}} // Ensures pointer cursor for the icon
                                                        >
                                                            <path
                                                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                                        </svg>
                                                    </Col>
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
                                    CV Details
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

                    <div className={resumePreviewClassName}>
                        <Nav fill variant="tabs" activeKey={activeTab} onSelect={handleSelect}>
                            <Nav.Item>
                                <Nav.Link eventKey="link-1">Design A</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="link-2">Design B</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <div className={"p-6"}>
                            {activeTab === "link-1" && (
                                <div>
                                    {isBeingEdited?.id && (
                                        <h1 style={{
                                            fontWeight: "bold",
                                            fontSize: "30px"
                                        }}>
                                            {isBeingEdited.data.resumeName}
                                        </h1>
                                    )}
                                    <Button onClick={() => handleSave()}
                                            className="mb-1 mt-5"
                                            style={{
                                                backgroundColor: '#ccc',
                                                borderColor: '#ccc',
                                                color: 'black',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-floppy" viewBox="0 0 16 16"
                                             style={{marginRight: '8px'}}>
                                            <path d="M11 2H9v3h2z"/>
                                            <path
                                                d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                                        </svg>
                                        Save Resume
                                    </Button>
                                    <div
                                        className="p-2"
                                        style={{
                                            border: "1px solid #0f5a73",
                                            borderRadius: "5px",
                                            display: "inline-block", // Adjust width and height to fit child content
                                            width: "fit-content",   // Ensure width adjusts to child content
                                            height: "fit-content",  // Ensure height adjusts to child content
                                        }}
                                    >
                                        <ResumeStyleB resumeData={customResumeFormFormik.values}/>
                                    </div>
                                </div>
                            )}
                            {activeTab === "link-2" && (
                                <div>
                                    {isBeingEdited?.id && (
                                        <h1 style={{
                                            fontWeight: "bold",
                                            fontSize: "30px"
                                        }}>
                                            {isBeingEdited.data.resumeName}
                                        </h1>
                                    )}
                                    <Button onClick={() => handleSave()}
                                            className="mb-1 mt-5"
                                            style={{
                                                backgroundColor: '#ccc',
                                                borderColor: '#ccc',
                                                color: 'black',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-floppy" viewBox="0 0 16 16"
                                             style={{marginRight: '8px'}}>
                                            <path d="M11 2H9v3h2z"/>
                                            <path
                                                d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                                        </svg>
                                        Save Resume
                                    </Button>
                                    <div
                                        className="p-2"
                                        style={{
                                            border: "1px solid #0f5a73",
                                            borderRadius: "5px",
                                            display: "inline-block", // Adjust width and height to fit child content
                                            width: "fit-content",   // Ensure width adjusts to child content
                                            height: "fit-content",  // Ensure height adjusts to child content
                                        }}
                                    >
                                        <ResumeStyleB resumeData={customResumeFormFormik.values}/>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};
