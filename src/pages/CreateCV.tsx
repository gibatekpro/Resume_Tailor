import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Col, Nav, Row, Spinner} from "react-bootstrap";
import "../styles/myJobApplications.css";
import {ResumeStyleB} from "../components/resume-style-b/ResumeStyleB";
import JobApplicationService from "../service/JobApplicationService";

import {CustomAccordion} from "../custom_tags/CustomAccordion";
import ResumeForm from "../components/forms/resumeForm/ResumeForm";
import {useFormik} from "formik";
import {ResumeStyleA} from "../components/resume-style-a/ResumeStyleA";
import {DefaultResumeData} from "../data/defaultResumeData";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import * as Yup from "yup";
import type { ResumeInfo } from "../models/ResumeInfo";
import type { SavedResumesResponse } from "../models/SavedResumesResponse";
import AppLayout from "../components/shared/AppLayout";
import TopNav from "../components/shared/TopNav";
import PageLoadingOverlay from "../components/shared/PageLoadingOverlay";
import PaginationControls from "../components/shared/PaginationControls";

const RESUMES_PER_PAGE = 8;


export const CreateCV: React.FC = () => {
    const [createNewHover, setCreateNewHover] = useState(false);
    const [isBeingEdited, setIsBeingEdited] = useState<SavedResumesResponse>();
    const [resumeToDelete, setResumeToDelete] = useState<SavedResumesResponse>();
    const [isBeingEditedIndex, setIsBeingEditedIndex] = useState<number>(-1);
    const [user] = useState<string | null>(localStorage.getItem('user'));
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
    const [currentResumePage, setCurrentResumePage] = useState(1);
    const [activeTab, setActiveTab] = useState("link-1");
    const [activeStep, setActiveStep] = useState(0);
    const inputFieldClassName =
        "mt-1 block w-full px-3 py-2 focus:outline-hidden " +
        "focus:ring-0 focus:border-black focus:border-2 sm:text-sm";

    const steps = [
        {
            title: '1. CV details',
            description: 'Build the resume content and maintain saved CV entries.',
            tone: 'bg-[#2170e4] text-white',
        },
        {
            title: '2. Review & save',
            description: 'Preview the generated CV in your selected layout and save it.',
            tone: 'bg-[#edf7ee] text-[#161c22]',
        },
    ];

    const stepProgress = `${((activeStep + 1) / steps.length) * 100}%`;

    const fetchResumes = useCallback(async () => {
        setIsLoading(true);
        try {
            const savedResumes: SavedResumesResponse[] = await JobApplicationService.getAllSavedResumes();
            setResumeList(savedResumes);
        } catch (error) {
            console.error("Error fetching job applications:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchResumes();
    }, [fetchResumes]);

    const totalResumePages = Math.max(1, Math.ceil(resumeList.length / RESUMES_PER_PAGE));

    useEffect(() => {
        if (currentResumePage > totalResumePages) {
            setCurrentResumePage(totalResumePages);
        }
    }, [currentResumePage, totalResumePages]);

    const pagedResumes = useMemo(() => {
        const start = (currentResumePage - 1) * RESUMES_PER_PAGE;
        return resumeList.slice(start, start + RESUMES_PER_PAGE).map((resume, index) => ({
            resume,
            globalIndex: start + index,
        }));
    }, [currentResumePage, resumeList]);

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

    const customResumeFormFormik = useFormik({
        initialValues: isBeingEdited?.data || DefaultResumeData,
        onSubmit: (_values) => {
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
                    await JobApplicationService.editResume(
                        user ?? "", isBeingEdited?.id || "", isBeingEdited!.data
                    )
                } else {
                    const theResumeData: ResumeInfo = customResumeFormFormik.values;
                    theResumeData.resumeName = values.resumeName;
                    await JobApplicationService.saveResume(
                        user ?? "", theResumeData
                    );
                }

                setIsSaveLoading(false);
                setIsSaveComplete(true);
                setIsSaveFailed(false);

                await fetchResumes();

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
            await fetchResumes();

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
        setIsBeingEdited(resume)
        customResumeFormFormik.setValues(resume.data);
        resumeNameFormFormik.setValues({
            resumeName: resume?.data.resumeName || ""
        });
    };

    useEffect(() => {

        setIsBeingEdited(prev => ({
            ...prev,
            data: customResumeFormFormik.values,
        }));

    }, [customResumeFormFormik.values]);

    useEffect(() => {
        if (activeStep !== 0) {
            setIsResumesPanelOpen(false);
        }
    }, [activeStep]);

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
        <AppLayout>
            <TopNav title="Create CV" />
            <main className="relative flex-1 bg-[#f6f9ff] px-4 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-[1600px]">
                    <div className="mb-6 overflow-hidden rounded-lg border border-[#c6c6cd] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                        <div className="border-b border-[#eaeaf0] bg-gradient-to-r from-[#eef4ff] via-[#f8fbff] to-white px-5 py-4 md:px-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">CV Workflow</p>
                                    <h2 className="mt-2 text-xl font-semibold text-[#161c22] md:text-2xl">Create and manage your CV</h2>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 md:p-6">
                            <div className="rounded-xl border border-[#c6c6cd] bg-[#f9fbff] p-4 transition-all duration-300 md:p-5">
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm ${steps[activeStep].tone}`}>
                                            {activeStep + 1}
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#76777d]">Current step</p>
                                            <h3 className="text-lg font-semibold text-[#161c22]">{steps[activeStep].title}</h3>
                                        </div>
                                    </div>
                                    <span className="rounded-full border border-[#d8e3f7] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4a5f87]">
                                        Step {activeStep + 1} of {steps.length}
                                    </span>
                                </div>

                                <p className="text-sm leading-6 text-[#45464d]">{steps[activeStep].description}</p>

                                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#e5ebf7]">
                                    <div
                                        className="h-full rounded-full bg-[#2170e4] transition-all duration-300"
                                        style={{width: stepProgress}}
                                    />
                                </div>

                                <div className="mt-4 grid gap-2 md:grid-cols-2">
                                    {steps.map((step, index) => (
                                        <button
                                            key={step.title}
                                            type="button"
                                            onClick={() => setActiveStep(index)}
                                            className={`cursor-pointer flex items-start gap-3 rounded-lg border px-3 py-3 text-left transition-all duration-200 ${
                                                index === activeStep
                                                    ? 'border-[#2170e4] bg-[#eef4fc] shadow-[0_2px_8px_rgba(33,112,228,0.12)]'
                                                    : 'border-[#dfe4ee] bg-white hover:border-[#bfd5ff]'
                                            }`}
                                        >
                                            <span
                                                className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                                    index === activeStep ? 'bg-[#2170e4] text-white' : 'bg-[#edf2fb] text-[#5a6f94]'
                                                }`}
                                            >
                                                {index + 1}
                                            </span>
                                            <span>
                                                <span className={`block text-sm font-semibold ${index === activeStep ? 'text-[#1f4f9c]' : 'text-[#161c22]'}`}>
                                                    {step.title}
                                                </span>
                                                <span className="mt-0.5 block text-xs leading-5 text-[#5f6370]">
                                                    {step.description}
                                                </span>
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 flex flex-wrap justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                                        disabled={activeStep === 0}
                                        className="cursor-pointer rounded-lg border border-[#d6dcec] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#4a4e57] transition-all duration-200 hover:border-[#bacaf0] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
                                        disabled={activeStep === steps.length - 1}
                                        className="cursor-pointer rounded-lg border border-[#2170e4] bg-[#2170e4] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-[#195fc0] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-0 my-2">
            <PageLoadingOverlay
                visible={isLoading}
                withinParent={true}
                message="Loading saved CVs and preparing your workspace..."
            />
            {isDialogOpen && (
                <div className={"relative z-20 bg-white"}>
                </div>
            )}
            {!isLoading && (
                <div className="row g-2 p-1 p-md-0">
                    <Dialog open={isDialogOpen} as="div" className="relative z-10 focus:outline-hidden"
                            onClose={closeDialog}>
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                {!isSaveComplete && !isSaveFailed && (
                                    <DialogPanel
                                        transition
                                        className="w-full max-w-md rounded-xl bg-gray-100 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                                    >
                                        <DialogTitle as="h3" className="text-black font-medium mb-4">
                                            <div className={"flex justify-between items-center"}>
                                                Save resume
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                       fill="currentColor" className="bi bi-x-lg cursor-pointer" viewBox="0 0 16 16"
                                                       onClick={closeDialog}>
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
                                                className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-hidden data-hover:bg-gray-600 data-focus:outline-1 data-focus:outline-white data-open:bg-gray-700"
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
                                        {/*        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-hidden data-hover:bg-gray-600 data-focus:outline-1 data-focus:outline-white data-open:bg-gray-700"*/}
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
                                        className="w-full max-w-md rounded-xl bg-gray-100 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                                    >
                                        <DialogTitle as="h3" className="text-black font-medium mb-4">
                                            Successful
                                        </DialogTitle>
                                        <span>The resume has been saved successfully</span>
                                        <div className="mt-4">
                                            <Button
                                                className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-hidden data-hover:bg-gray-600 data-focus:outline-1 data-focus:outline-white data-open:bg-gray-700"
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
                    <Dialog open={isDeleteDialogOpen} as="div" className="relative z-10 focus:outline-hidden"
                            onClose={closeDeleteDialog}>
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <DialogPanel
                                    transition
                                    className="w-full max-w-md rounded-xl bg-gray-100 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                                >
                                    <div className={"flex justify-between items-center mb-4"}>
                                        {`Delete CV: ${resumeToDelete?.data.resumeName}`}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" className="bi bi-x-lg cursor-pointer" viewBox="0 0 16 16"
                                            onClick={closeDeleteDialog}>
                                            <path
                                                d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                        </svg>
                                    </div>
                                    <span>Are you sure you want to delete this cv</span>
                                    <div className="mt-4">
                                        <Button
                                            className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-hidden data-hover:bg-gray-600 data-focus:outline-1 data-focus:outline-white data-open:bg-gray-700"
                                            onClick={deleteResume}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>
                    {activeStep === 0 && isResumesPanelOpen && (
                        <div
                            className="col-md-2 pb-4"
                            style={{
                                ...styles.rightBorderStyle,
                                ...styles.leftColumn.padding,
                            }}
                        >
                            <div className="rounded-lg border border-[#c6c6cd] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
                                <div className="flex items-center justify-between border-b border-[#eaeaf0] bg-[#f8fbff] px-3 py-2.5">
                                    <button
                                        type="button"
                                        className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-md border border-[#efc2c2] bg-white text-[#ba1a1a] transition-all duration-200 hover:border-[#dc2626] hover:bg-[#fff1f1] hover:text-[#a31212]"
                                        title="Close"
                                        onClick={closeResumesPanel}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                        </svg>
                                    </button>
                                    <h5 className="mb-0 text-sm font-semibold uppercase tracking-[0.08em] text-[#45464d]">Saved CVs</h5>
                                    <div className="h-8 w-8" aria-hidden="true" />
                                </div>

                                <div className="p-2">
                                    {isLoading ? (
                                        <p>Loading resumes...</p>
                                    ) : (
                                        <>
                                            <div
                                                className="mb-2 rounded-md border border-[#c6d9ff] px-2 py-2 text-center text-sm font-semibold text-[#1f4f9c] transition-colors duration-200"
                                                style={{backgroundColor: createNewHover ? "#dbeafe" : "#edf4ff"}}
                                                onMouseEnter={() => setCreateNewHover(true)}
                                                onMouseLeave={() => setCreateNewHover(false)}
                                                onClick={() => {
                                                    handleCreateNewCV();
                                                    setIsBeingEditedIndex(-1)
                                                }}
                                            >
                                                + <span className={"ml-2"}>Create New CV</span>
                                            </div>

                                            {pagedResumes.map(({resume, globalIndex}) => (
                                                <div
                                                    key={resume.id}
                                                    className="mb-1 flex items-center justify-between rounded-md border border-[#e5e7eb] px-2 py-2 transition-all duration-200 hover:border-[#bfd5ff] hover:bg-[#f8fbff]"
                                                    style={{backgroundColor: globalIndex === isBeingEditedIndex ? "#e8eef6" : "transparent"}}
                                                >
                                                    <button
                                                        type="button"
                                                        className="cursor-pointer mr-2 flex-1 truncate text-left text-sm text-[#161c22]"
                                                        onClick={() => {
                                                            handleResumeClick(resume);
                                                            setIsBeingEditedIndex(globalIndex);
                                                        }}
                                                    >
                                                        {resume.data.resumeName || "Untitled Resume"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-md text-[#ba1a1a] transition-colors duration-200 hover:bg-[#ffebe9]"
                                                        onClick={() => handleDeleteResume(resume)}
                                                        aria-label="Delete saved CV"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-trash3"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path
                                                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}

                                            <PaginationControls
                                                currentPage={currentResumePage}
                                                totalPages={totalResumePages}
                                                onPageChange={setCurrentResumePage}
                                                label="Saved CV"
                                            />

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
                        <div className="flex items-center justify-between border-y border-[#eaeaf0] bg-[#f8fbff] px-4 py-3">
                            {!isResumesPanelOpen ? (
                                <button
                                    type="button"
                                    onClick={openResumesPanel}
                                    className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border border-[#c6c6cd] bg-white text-[#161c22] transition-all duration-200 hover:border-[#2170e4] hover:text-[#2170e4]"
                                    aria-label="Open saved CVs"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                                    </svg>
                                </button>
                            ) : (
                                <div className="h-9 w-9" aria-hidden="true" />
                            )}
                            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#45464d]">CV Details</span>
                            <div className="h-9 w-9" aria-hidden="true" />
                        </div>

                        <CustomAccordion
                            isOpen={isFormOpen}
                            setIsOpen={setIsFormOpen}
                            children={<ResumeForm
                                resumeFormFormik={customResumeFormFormik}
                            />}
                        />

                    </div>

                    {activeStep === 1 && (
                    <div className={`${resumePreviewClassName} min-w-0`}>
                        <Nav fill variant="tabs" activeKey={activeTab} onSelect={handleSelect}>
                            <Nav.Item>
                                <Nav.Link eventKey="link-1">Style A</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="link-2">Style B</Nav.Link>
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
                                            className="mb-1 mt-5 cursor-pointer"
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
                                            display: "inline-block",
                                            width: "fit-content",
                                            height: "fit-content",
                                        }}
                                    >
                                        <ResumeStyleA resumeData={customResumeFormFormik.values}/>
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
                                            className="mb-1 mt-5 cursor-pointer"
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
                    )}
                </div>
            )}
                    </div>
                </div>
            </main>
        </AppLayout>
    );
};
