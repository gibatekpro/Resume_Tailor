import React, {useEffect, useState} from "react";
import '../styles/resumePrint.css';
import {useNavigate} from "react-router-dom";
import JobApplicationService from "../service/JobApplicationService";
import {
    APP_TITLE, RESUME_STYLES,
} from "../utils/applicationData";
import type { JobApplicationInfo } from "../models/JobApplicationInfo";
import ROUTES from "../utils/Routes";
import {DefaultResumeData} from "../data/defaultResumeData";
import {useFormik} from "formik";
import * as Yup from "yup";
import STORAGE from "../utils/storage";
import {renderResumeStyle} from "../utils/HelperFunctions";
import moment from "moment";
import styleAImage from "../assets/resume_styles/StyleA.png";
import styleBImage from "../assets/resume_styles/StyleB.png";
import styleCImage from "../assets/resume_styles/StyleC.png";
import AppLayout from "../components/shared/AppLayout";
import TopNav from "../components/shared/TopNav";
import PageLoadingOverlay from "../components/shared/PageLoadingOverlay";

export const JobApplicationPreviewPage: React.FC<{
    setHideNavbar?: (hide: boolean) => void,
    setAppTitle?: React.Dispatch<React.SetStateAction<string>>
}> = ({setHideNavbar, setAppTitle}) => {
    const [user] = useState<string | null>(localStorage.getItem('user'));
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [saved] = useState(localStorage.getItem(STORAGE.LOCAL_STORAGE_RESUME_DATA));
    const [savedApplicationData] = useState<JobApplicationInfo>(JSON.parse(localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || "{}"));
    const resumeDataOpenAI = saved ? JSON.parse(saved) : DefaultResumeData;
    const [selectedResumeStyle, setSelectedResumeStyle] = useState(RESUME_STYLES[0])

    const imageStyles: { [key: string]: any } = {
        StyleA: styleAImage,
        StyleB: styleBImage,
        StyleC: styleCImage,
    };

    const saveAndPrint = async () => {
        setIsLoading(true);
        try {
            //Save current form values to localStorage
            const storedData: JobApplicationInfo = JSON.parse(
                localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || "{}"
            );
            const updatedData = {
                ...storedData,
                ...jobApplicationFormFormik.values,
                date: moment().toISOString(),
            };

            localStorage.setItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA, JSON.stringify(updatedData));

            console.log("Updated Data >>>>>: " + updatedData.jobPostingUrl);

            //Save job application to the server
            await JobApplicationService.saveJobApplication(user ?? "", updatedData);

            //Update the app title if available
            setAppTitle?.(updatedData.openAIDocumentTitle || APP_TITLE);

            //Navigate to the resume print page
            setHideNavbar?.(true);
            navigate(ROUTES.RESUME_PRINT_PAGE);
        } catch (error) {
            console.error("Error saving and printing:", error);
        } finally {
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
            jobPostingUrl: savedApplicationData.jobPostingUrl || "",
            resumeStyle: selectedResumeStyle
        },
        enableReinitialize: true,
        validationSchema: () => Yup.object().shape({
            openAIJobTitle: Yup.string().min(4).required(),
            jobPostingUrl: Yup.string().min(4).required(),
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
        setSelectedResumeStyle(jobApplicationFormFormik.values.resumeStyle);
    }, [jobApplicationFormFormik.values.resumeStyle]);

    return (
        <AppLayout>
            <TopNav
                title="Preview Job Application"
                actions={
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.RESUME_INPUT_PAGE)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#45464d',
                        }}
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                }
            />

            <main className="relative flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6 lg:px-8">
                <PageLoadingOverlay
                    visible={isLoading}
                    withinParent={true}
                    message="Saving your application and preparing print view..."
                />
                <div className="grid grid-cols-1 gap-4 p-2 md:p-0 lg:grid-cols-12">
                    <div className="lg:col-span-5 lg:sticky lg:top-[88px] lg:self-start xl:col-span-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                     stroke="currentColor" className="size-6 text-slate-600">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
                                </svg>
                                <h5 className="m-0 text-base font-semibold text-slate-800">Application Details</h5>
                            </div>

                            <form onSubmit={jobApplicationFormFormik.handleSubmit} className="w-full space-y-4">
                                    <div
                                        style={{
                                            border: "1px solid #dbe2e8",
                                            borderRadius: "10px",
                                            padding: "14px",
                                            marginBottom: "16px",
                                            background: "#f9fbfc",
                                        }}
                                    >
                                        <div style={{ marginBottom: "10px" }}>
                                            <h6 style={{ margin: 0, fontWeight: 700, color: "#1f2933" }}>Job Details</h6>
                                            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
                                                Confirm the role details before saving and printing.
                                            </p>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="openAIJobTitle" className="mb-1 block text-sm font-medium text-slate-700">Job Title</label>
                                            <input
                                                id="openAIJobTitle"
                                                name="openAIJobTitle"
                                                type="text"
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                                placeholder="e.g Electrician"
                                                onChange={jobApplicationFormFormik.handleChange}
                                                onBlur={jobApplicationFormFormik.handleBlur}
                                                value={jobApplicationFormFormik.values.openAIJobTitle || ""}
                                            />
                                            {jobApplicationFormFormik.touched.openAIJobTitle && jobApplicationFormFormik.errors.openAIJobTitle && (
                                                <span className="text-sm text-red-600">Required</span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="openAIJobCompanyName" className="mb-1 block text-sm font-medium text-slate-700">Company Name</label>
                                            <input
                                                id="openAIJobCompanyName"
                                                name="openAIJobCompanyName"
                                                type="text"
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                                placeholder="e.g Amazon Ltd"
                                                onChange={jobApplicationFormFormik.handleChange}
                                                onBlur={jobApplicationFormFormik.handleBlur}
                                                value={jobApplicationFormFormik.values.openAIJobCompanyName || ""}
                                            />

                                            {jobApplicationFormFormik.touched.openAIJobCompanyName && jobApplicationFormFormik.errors.openAIJobCompanyName && (
                                                <span className="text-sm text-red-600">Required</span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="openAIJobLocation" className="mb-1 block text-sm font-medium text-slate-700">Job Location</label>
                                            <input
                                                id="openAIJobLocation"
                                                name="openAIJobLocation"
                                                type="text"
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                                placeholder="e.g London, UK - Hybrid"
                                                onChange={jobApplicationFormFormik.handleChange}
                                                onBlur={jobApplicationFormFormik.handleBlur}
                                                value={jobApplicationFormFormik.values.openAIJobLocation || ""}
                                            />
                                            {jobApplicationFormFormik.touched.openAIJobLocation && jobApplicationFormFormik.errors.openAIJobLocation && (
                                                <span className="text-sm text-red-600">Required</span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="openAIDocumentTitle" className="mb-1 block text-sm font-medium text-slate-700">Document Name</label>
                                            <input
                                                id="openAIDocumentTitle"
                                                name="openAIDocumentTitle"
                                                type="text"
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                                placeholder="e.g john-doe-companyName"
                                                onChange={jobApplicationFormFormik.handleChange}
                                                onBlur={jobApplicationFormFormik.handleBlur}
                                                value={jobApplicationFormFormik.values.openAIDocumentTitle || ""}
                                            />
                                            {jobApplicationFormFormik.touched.openAIDocumentTitle && jobApplicationFormFormik.errors.openAIDocumentTitle && (
                                                <span className="text-sm text-red-600">Required</span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="jobPostingUrl" className="mb-1 block text-sm font-medium text-slate-700">Job Posting Link <span style={{color: 'grey'}}>(Optional)</span></label>
                                            <input
                                                id="jobPostingUrl"
                                                name="jobPostingUrl"
                                                type="text"
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                                placeholder="e.g https://indeed.com"
                                                onChange={jobApplicationFormFormik.handleChange}
                                                onBlur={jobApplicationFormFormik.handleBlur}
                                                value={jobApplicationFormFormik.values.jobPostingUrl || ""}
                                            />
                                            {jobApplicationFormFormik.touched.jobPostingUrl && jobApplicationFormFormik.errors.jobPostingUrl && (
                                                <span className="text-sm text-red-600">Required</span>
                                            )}
                                        </div>

                                        <div className="mb-0">
                                            <label htmlFor="openAISimpleJobDescription" className="mb-1 block text-sm font-medium text-slate-700">Simple Job Description</label>
                                            <textarea
                                                id="openAISimpleJobDescription"
                                                name="openAISimpleJobDescription"
                                                rows={3}
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                                placeholder="e.g. Software developer to generate web pages"
                                                onChange={jobApplicationFormFormik.handleChange}
                                                onBlur={jobApplicationFormFormik.handleBlur}
                                                value={jobApplicationFormFormik.values.openAISimpleJobDescription || ""}
                                            />
                                            {jobApplicationFormFormik.touched.openAISimpleJobDescription && jobApplicationFormFormik.errors.openAISimpleJobDescription && (
                                                <span className="text-sm text-red-600">Required</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-semibold text-slate-800">Select a style</label>
                                        <div className="flex gap-2 overflow-x-auto pb-1">
                                            {RESUME_STYLES.map((style, index) => (
                                                <div key={index} style={{ flex: "0 0 auto" }}>
                                                    <input
                                                        type="radio"
                                                        name="resumeInfo.resumeStyle"
                                                        id={`resumeStyle-${index}`}
                                                        value={style}
                                                        checked={jobApplicationFormFormik.values.resumeStyle === style}
                                                        onChange={(e) =>
                                                            jobApplicationFormFormik.setFieldValue(
                                                                "resumeStyle",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor={`resumeStyle-${index}`}
                                                        className={`flex w-[88px] cursor-pointer flex-col items-center rounded-lg bg-white p-1.5 transition-all ${
                                                            jobApplicationFormFormik.values.resumeStyle === style
                                                                ? "border-2 border-sky-700"
                                                                : "border border-slate-300"
                                                        }`}
                                                    >
                                                        <img
                                                            src={imageStyles[style]}
                                                            alt={`Style preview ${style}`}
                                                            className="mb-1 h-16 w-16 rounded object-cover"
                                                        />
                                                        <span className="text-xs text-slate-700">{style}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {!jobApplicationFormFormik.values.resumeStyle && (
                                            <span className="text-sm text-red-600">Required</span>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="cursor-pointer w-full rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
                                    >
                                        Save and Print
                                    </button>
                            </form>
                        </div>
                    </div>

                    <div className="min-w-0 lg:col-span-7 xl:col-span-8">
                        <div style={{
                            border: "1px solid #0f5a73",
                            borderRadius: "8px",
                            display: "block",
                            width: "100%",
                            overflowX: "auto",
                            height: "fit-content",
                            padding: "10px",
                            background: "#fff",
                        }}>
                            {renderResumeStyle(resumeDataOpenAI, selectedResumeStyle)}
                        </div>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
};
