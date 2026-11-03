import React, {useEffect, useMemo, useState} from "react";
import ResumeForm from "../components/forms/resumeForm/ResumeForm";
import {useFormik} from "formik";
import {DefaultResumeData} from "../data/defaultResumeData";
import type { OpenAIInstruction } from "../models/OpenAIInstruction";
import {InstructionResumeData} from "../data/instructionResumeData";
import * as Yup from "yup";
import {callTailorStep} from "../service/TailorService";
import InstructionForm from "../components/forms/instructionForm/InstructionForm";
import {useNavigate} from "react-router-dom";
import AppLayout from "../components/shared/AppLayout";
import TopNav from "../components/shared/TopNav";
import ROUTES from "../utils/Routes";
import JobApplicationService from "../service/JobApplicationService";
import type { JobApplicationInfo } from "../models/JobApplicationInfo";
import {CustomAccordion} from "../custom_tags/CustomAccordion";
import {openAIInstruction} from "../data/openAIInstruction";
import moment from "moment";
import type { SavedResumesResponse } from "../models/SavedResumesResponse";
import {Button, Col, Row} from "react-bootstrap";
import STORAGE from "../utils/storage";
import {Dialog, DialogPanel} from "@headlessui/react";
import PageLoadingOverlay from "../components/shared/PageLoadingOverlay";
import PaginationControls from "../components/shared/PaginationControls";
import {runTailoringPipeline} from "../utils/tailoringPipeline";
import {TailoringChangesView} from "../components/shared/TailoringChangesView";
import {ImprovementsPanel} from "../components/shared/ImprovementsPanel";
import SettingsService from "../service/SettingsService";
import type {AppSettings} from "../models/AppSettings";

const RESUMES_PER_PAGE = 8;

export const TailorResumePage: React.FC = () => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const [jobApplicationInfo, setJobApplicationInfo] = useState<JobApplicationInfo | undefined>(() =>
        JSON.parse(localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || "null") || undefined
    );
    const [savedRules, setSavedRules] = useState<string[]>(openAIInstruction.rules || []);
    const [isLoading, setIsLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");
    const navigate = useNavigate();
    const saved = localStorage.getItem(STORAGE.LOCAL_STORAGE_RESUME_DATA);
    const SavedResumeDataOpenAI = saved ? JSON.parse(saved) : DefaultResumeData;
    const [isGeneratedFormOpen, setIsGeneratedFormOpen] = useState(false);
    const [createNewHover, setCreateNewHover] = useState(false);
    const [isBeingEdited, setIsBeingEdited] = useState<SavedResumesResponse>();
    const [isBeingEditedIndex, setIsBeingEditedIndex] = useState<number>(-1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [resumeFormClassName, setResumeFormClassName] = useState("col-md-4 pb-4");
    const [resumePreviewClassName, setResumePreviewClassName] = useState("col-md-8 px-2");
    const [isResumesPanelOpen, setIsResumesPanelOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [generateHasError, setGenerateHasError] = useState(false);
    const [generateErrorMessage, setGenerateErrorMessage] = useState("");
    const [settings, setSettings] = useState<AppSettings>(SettingsService.getCachedSettings());
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [resumeList, setResumeList] = useState<SavedResumesResponse[]>([])
    const [currentResumePage, setCurrentResumePage] = useState(1);

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    }

    const openDialog = (hasError: boolean) => {
        setIsLoading(false);
        if (hasError) {
            setIsDialogOpen(true);
            setGenerateHasError(true)
        } else {
            setIsDialogOpen(true);
            setGenerateHasError(false);
        }

    }

    const closeDialog = () => {
        setIsDialogOpen(false);
        setGenerateHasError(false);
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
            if (!user) {
                alert("You must be logged in to save your job application.");
                return;
            }
            const jobAppInfo: JobApplicationInfo | undefined = JSON.parse(localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || "{}");
            if (jobAppInfo != null || jobAppInfo !== undefined) {
                const updatedData: JobApplicationInfo = {
                    ...jobAppInfo,
                    resumeInfo: {
                        resumeName: jobAppInfo?.resumeInfo?.resumeName,
                        ...values
                    }
                }
                localStorage.setItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA, JSON.stringify(updatedData) || "{}");

                // console.log(updatedData);
            }
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
            model: settings.defaultModel,
            tailorSummary: true,
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

                // Analyse the job, rewrite the CV, check the rewrite and repair it once if needed.
                const parsedResponse: JobApplicationInfo = await runTailoringPipeline({
                    resumeInfo: customResumeFormFormik.values,
                    jobDescription: values.jobDescriptionData || "",
                    rules: values.rules || [],
                    tailorSummary: values.tailorSummary !== false,
                    model: values.model || settings.defaultModel,
                }, callTailorStep, setProgressMessage);
                openDialog(false);
                setActiveStep(2);
                localStorage.setItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA, JSON.stringify(parsedResponse) || "{}");
                setJobApplicationInfo(parsedResponse);
                await generatedResumeFormFormik.setValues(parsedResponse.resumeInfo);
            } catch (error) {
                console.error("Error during resume generation:", error);
                setGenerateErrorMessage(error instanceof Error ? error.message : "");
                openDialog(true);
            } finally {
                setIsLoading(false);
                setProgressMessage("");
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

    const dialogOverlayStyle = {
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
        const loadPageData = async () => {
            try {
                const [savedResumes, rules, userSettings] = await Promise.all([
                    JobApplicationService.getAllSavedResumes(),
                    JobApplicationService.getRules(user || ""),
                    SettingsService.getSettings(),
                ]);

                setResumeList(savedResumes);
                setSavedRules(rules);
                setSettings(userSettings);
                void instructionFormFormik.setFieldValue('model', userSettings.defaultModel);

                if (savedResumes.length > 0) {
                    setIsBeingEdited(savedResumes[0]);
                    setIsBeingEditedIndex(0);
                }
            } catch (error) {
                console.error("Error loading page data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadPageData();

    }, []);

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

    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (savedRules.length > 0) {
            instructionFormFormik.setFieldValue('rules', savedRules);
        }
    }, [savedRules]);

    useEffect(() => {
        if (activeStep !== 0) {
            setIsResumesPanelOpen(false);
        }
    }, [activeStep]);

    useEffect(() => {
        isBeingEdited != null ? customResumeFormFormik.setValues(isBeingEdited?.data) : customResumeFormFormik.setValues(DefaultResumeData)
    }, [isBeingEdited]);

    const steps = [
        {
            title: '1. Resume details',
            description: 'Build your profile, skills, and work history.',
            tone: 'bg-[#2170e4] text-white',
            active: true,
        },
        {
            title: '2. Job brief',
            description: 'Paste the role description and tailor the brief.',
            tone: 'bg-[#eef4fc] text-[#161c22]',
            active: false,
        },
        {
            title: '3. Review output',
            description: 'Check the AI-generated resume and preview the application.',
            tone: 'bg-[#edf7ee] text-[#161c22]',
            active: false,
        },
    ];

    const stepProgress = `${((activeStep + 1) / steps.length) * 100}%`;

    return (
        <AppLayout>
            <TopNav title="Tailor Resume" />

            <main className="relative flex-1 bg-[#f6f9ff] px-3 py-5 md:px-6 md:py-6 lg:px-8">
                <div className="mx-auto max-w-[1600px]">
                    <div className="mb-6 overflow-hidden rounded-lg border border-[#c6c6cd] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                        <div className="border-b border-[#eaeaf0] bg-gradient-to-r from-[#eef4ff] via-[#f8fbff] to-white px-5 py-4 md:px-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">Resume Workflow</p>
                                    <h2 className="mt-2 text-xl font-semibold text-[#161c22] md:text-2xl">Tailor your application step by step</h2>
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

                                <div className="mt-4 grid gap-2 md:grid-cols-3">
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

                    <PageLoadingOverlay
                        visible={isLoading}
                        withinParent={true}
                        message={progressMessage || "Loading your saved CVs and personalization rules..."}
                    />
                    {isDialogOpen && (
                        <Dialog open={isDialogOpen} as="div" className="relative z-0 focus:outline-hidden" style={dialogOverlayStyle}
                                onClose={closeDialog}>
                            <div className="fixed inset-0 z-0 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4">
                                    <DialogPanel
                                        transition
                                        className="w-full max-w-md rounded-xl bg-gray-100 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                                    >
                                        <div className={"flex justify-between items-center mb-4"}>
                                            {generateHasError ? (
                                                "Failed"
                                            ) : (
                                                "Successful"
                                            )}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                  fill="currentColor" className="bi bi-x-lg cursor-pointer" viewBox="0 0 16 16"
                                                  onClick={closeDialog}>
                                                <path
                                                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                            </svg>
                                        </div>
                                        {generateHasError ? (
                                            <text>
                                                Couldn't generate your CV.{generateErrorMessage && ` ${generateErrorMessage}`}
                                            </text>
                                        ) : (
                                            <text>
                                                Your tailored CV is ready. Job titles, employers, dates, education and your profile were kept exactly as written.
                                                {(jobApplicationInfo?.openAIGaps?.length || 0) > 0 &&
                                                    ` ${jobApplicationInfo?.openAIGaps?.length} job requirement(s) aren't shown in your CV. See Gaps.`}
                                            </text>
                                        )}
                                        <div className="mt-4">
                                            <Button
                                                className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-hidden data-hover:bg-gray-600 data-focus:outline-1 data-focus:outline-white data-open:bg-gray-700"
                                                onClick={closeDialog}
                                            >
                                                ok
                                            </Button>
                                        </div>
                                    </DialogPanel>
                                </div>
                            </div>
                        </Dialog>
                    )}

                    <div style={isLoading ? blurredStyle : {}} className="grid grid-cols-1 gap-5">
                        {activeStep === 0 && (
                            <>
                                {isResumesPanelOpen && (
                                    <div
                                        className="rounded-lg border border-[#c6c6cd] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]"
                                        style={{
                                            ...styles.rightBorderStyle,
                                            ...styles.leftColumn.padding,
                                        }}
                                    >
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
                                                            <button
                                                                key={resume.id}
                                                                type="button"
                                                                className="mb-1 flex w-full items-center justify-between rounded-md border border-[#e5e7eb] px-2 py-2 text-left transition-all duration-200 hover:border-[#bfd5ff] hover:bg-[#f8fbff]"
                                                                style={{backgroundColor: globalIndex === isBeingEditedIndex ? "#e8eef6" : "transparent"}}
                                                                onClick={() => {
                                                                    handleResumeClick(resume);
                                                                    setIsBeingEditedIndex(globalIndex);
                                                                }}
                                                            >
                                                                <span className="truncate text-sm text-[#161c22]">
                                                                    {resume.data.resumeName || "Untitled Resume"}
                                                                </span>
                                                            </button>
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
                                )}

                                <div className="rounded-lg border border-[#c6c6cd] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] min-w-0">
                                    <div className="flex items-center justify-between border-b border-[#eaeaf0] bg-[#f8fbff] px-4 py-3">
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
                                        <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#45464d]">Template</span>
                                        <div className="h-9 w-9" aria-hidden="true" />
                                    </div>
                                    <div className="p-4">
                                        <CustomAccordion
                                            isOpen={isFormOpen}
                                            setIsOpen={setIsFormOpen}
                                            children={<ResumeForm resumeFormFormik={customResumeFormFormik} />}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {activeStep === 1 && (
                            <div className="rounded-lg border border-[#c6c6cd] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] min-w-0">
                                <div className="p-4">
                                    <InstructionForm
                                        isLoading={isLoading}
                                        instructionFormFormik={instructionFormFormik}
                                        models={settings.models}
                                    />
                                </div>
                            </div>
                        )}

                        {activeStep === 2 && (
                            <div className="rounded-lg border border-[#c6c6cd] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] min-w-0">
                                <div className="flex items-center justify-between border-b border-[#eaeaf0] bg-[#f8fbff] px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsBeingEditedIndex(-1);
                                            customResumeFormFormik.setValues(generatedResumeFormFormik.values);
                                        }}
                                        className="cursor-pointer rounded-lg border border-[#c6c6cd] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#161c22] transition-all duration-200 hover:border-[#2170e4] hover:text-[#2170e4]"
                                    >
                                        Use As Template
                                    </button>
                                    <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#45464d]">AI Output</span>
                                    <button type="button" className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border border-[#c6c6cd] bg-white text-[#161c22] transition-all duration-200 hover:border-[#2170e4] hover:text-[#2170e4]" aria-label="Add section">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                        </svg>
                                    </button>
                                </div>
                                {jobApplicationInfo?.tailoringChanges && (
                                    <div className="mx-4 mt-4">
                                        <TailoringChangesView changes={jobApplicationInfo.tailoringChanges} report={jobApplicationInfo.tailoringReport}/>
                                    </div>
                                )}
                                {jobApplicationInfo?.openAIImprovements && jobApplicationInfo.openAIImprovements.length > 0 && (
                                    <div className="mx-4 mt-4">
                                        <ImprovementsPanel improvements={jobApplicationInfo.openAIImprovements}/>
                                    </div>
                                )}
                                {jobApplicationInfo?.openAIGaps && jobApplicationInfo.openAIGaps.length > 0 && (
                                    <div className="mx-4 mt-4 rounded-lg border border-[#f1d8a8] bg-[#fff8ec] px-4 py-3">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a5a00]">Gaps</p>
                                        <p className="mt-1 text-xs leading-5 text-[#5f6370]">
                                            The job asks for these, but your CV doesn't show them, so nothing was added for them.
                                            If you do have this experience, add it to your CV and generate again. Otherwise, consider covering it in your cover letter.
                                        </p>
                                        <ul className="mt-2 mb-0 list-disc pl-5 text-sm leading-6 text-[#161c22]">
                                            {jobApplicationInfo.openAIGaps.map((gap) => (
                                                <li key={gap}>{gap}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="p-4 cursor-pointer">
                                    <CustomAccordion
                                        isOpen={isGeneratedFormOpen}
                                        setIsOpen={setIsGeneratedFormOpen}
                                        children={<ResumeForm
                                            hasSubmitButton={true}
                                            buttonTitle={"Preview Application"}
                                            resumeFormFormik={generatedResumeFormFormik}
                                        />}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </AppLayout>
    );
};

