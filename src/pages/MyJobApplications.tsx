import React, {useCallback, useEffect, useState} from "react";
import moment from "moment";
import {CustomAccordionStyleB} from "../custom_tags/CustomAccordionStyleB";
import {Button} from "react-bootstrap";
import "../styles/myJobApplications.css";
import JobApplicationService from "../service/JobApplicationService";
import {useNavigate} from "react-router-dom";
import ROUTES from "../utils/Routes";
import type { JobApplicationsResponse } from "../models/JobApplicationsResponse";
import STORAGE from "../utils/storage";
import {Dialog, DialogPanel} from "@headlessui/react";
import {renderResumeStyle} from "../utils/HelperFunctions";
import AppLayout from "../components/shared/AppLayout";
import TopNav from "../components/shared/TopNav";
import {colors, shadows} from "../styles/theme";
import PageLoadingOverlay from "../components/shared/PageLoadingOverlay";

const categorizeApplications = (applications: JobApplicationsResponse[]) => {
    const todayArr: JobApplicationsResponse[] = [];
    const yesterdayArr: JobApplicationsResponse[] = [];
    const thisWeekArr: JobApplicationsResponse[] = [];
    const thisMonthArr: JobApplicationsResponse[] = [];
    const thisYearArr: JobApplicationsResponse[] = [];
    const olderArr: JobApplicationsResponse[] = [];

    console.table(applications.map((data) => ({ id: data.id, date: data.data.date })));

    applications.forEach((data) => {
        const date = moment(data.data.date);

        const today = moment().startOf("day");
        if (date.isSame(today, "day")) {
            todayArr.push(data);
        }

        const yesterday = moment().subtract(1, "day").startOf("day");
        if (date.isSame(yesterday, "day") && !todayArr.includes(data)) {
            yesterdayArr.push(data);
        }

        const startOfWeek = moment().subtract(7, "days").startOf("day");
        if (date.isSameOrAfter(startOfWeek, "day") && !todayArr.includes(data)) {
            thisWeekArr.push(data);
        }

        const startOfMonth = moment().startOf("month");
        if (date.isSameOrAfter(startOfMonth, "day") && !todayArr.includes(data)) {
            thisMonthArr.push(data);
        }

        const startOfYear = moment().startOf("year");
        if (date.isSameOrAfter(startOfYear, "day")) {
            if (!todayArr.includes(data) && !thisMonthArr.includes(data) && !thisWeekArr.includes(data)) {
                thisYearArr.push(data);
            }
        }

        if (date.isBefore(startOfYear, "day")) {
            olderArr.push(data);
        }
    });

    return {
        todayArr,
        yesterdayArr,
        thisWeekArr,
        thisMonthArr,
        thisYearArr,
        olderArr,
    };
};

export const MyJobApplications: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [today, setToday] = useState<JobApplicationsResponse[]>([]);
    const [yesterday, setYesterday] = useState<JobApplicationsResponse[]>([]);
    const [thisWeek, setThisWeek] = useState<JobApplicationsResponse[]>([]);
    const [thisMonth, setThisMonth] = useState<JobApplicationsResponse[]>([]);
    const [thisYear, setThisYear] = useState<JobApplicationsResponse[]>([]);
    const [older, setOlder] = useState<JobApplicationsResponse[]>([]);
    const [jobApplicationsList, setJobApplicationsList] = useState<JobApplicationsResponse[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<JobApplicationsResponse>();
    const [jobApplicationToDelete, setJobApplicationToDelete] = useState<JobApplicationsResponse>();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [user] = useState<string | null>(localStorage.getItem('user'));
    const navigate = useNavigate();

    const refreshApplications = useCallback(async () => {
        setIsLoading(true);
        try {
            const applications: JobApplicationsResponse[] = await JobApplicationService.getAllJobApplications();
            setJobApplicationsList(applications);
        } catch (error) {
            console.error("Error fetching job applications:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshApplications();
    }, [refreshApplications]);

    useEffect(() => {
        try {
            const categorized = categorizeApplications(jobApplicationsList);

            const {
                todayArr,
                yesterdayArr,
                thisWeekArr,
                thisMonthArr,
                thisYearArr,
                olderArr,
            } = categorized;

            setToday(todayArr);
            setYesterday(yesterdayArr);
            setThisWeek(thisWeekArr);
            setThisMonth(thisMonthArr);
            setThisYear(thisYearArr);
            setOlder(olderArr);

            const selectedStillVisible = selectedApplication
                ? jobApplicationsList.some((item) => item.id === selectedApplication.id)
                : false;

            if (!selectedStillVisible) {
                setSelectedApplication(
                    todayArr[0] ??
                    yesterdayArr[0] ??
                    thisWeekArr[0] ??
                    thisMonthArr[0] ??
                    thisYearArr[0] ??
                    olderArr[0] ??
                    undefined
                );
            }
        } catch (error) {
            console.error("Error fetching job applications:", error);
        }
    }, [jobApplicationsList, selectedApplication]);

    const styles = {
        jobInfo: {
            header: {
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: colors.onSurface,
                marginBottom: 5,
            },
            subheader: {
                fontSize: "1.2rem",
                color: colors.onSurfaceVariant,
                marginBottom: 10,
            },
            normalText: {
                fontSize: "1rem",
                color: colors.onSurfaceVariant,
                marginBottom: 8,
            },
        },
    };

    const blurredStyle = {
        filter: "blur(3px)",
        pointerEvents: "none" as const,
    };

    const handleNavigate = (path: string) => {
        localStorage.setItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA, JSON.stringify(selectedApplication?.data))
        navigate(path)
    }

    const handleDeleteJobApplication = (jobApplication: JobApplicationsResponse) => {
        setJobApplicationToDelete(jobApplication)
        openDeleteDialog()
    }

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    }


    const openDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    }

    const deleteJobApplication = async () => {
        try {
            await JobApplicationService.deleteJobApplication(user ?? "", jobApplicationToDelete?.id || "")
            await refreshApplications();

        } catch (error) {
            console.log(error)
        }
        setIsDeleteDialogOpen(false)
    }

    const handleViewJobPosting = (jobPostingUrl: string | undefined) => {
        if (!jobPostingUrl) {
            console.error("Job posting URL is undefined");
            return;
        }
        window.open(jobPostingUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <AppLayout>
            <TopNav title="My Job Applications" />
            <main className="relative flex-1 bg-[#f6f9ff] px-4 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-[1600px]">
                    <PageLoadingOverlay
                        visible={isLoading}
                        withinParent={true}
                        message="Fetching your applications and preparing this page..."
                    />

                    {!isLoading && (
                        <div style={isDeleteDialogOpen ? blurredStyle : undefined} className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                            <section className="xl:col-span-4">
                                <div
                                    className="overflow-hidden rounded-lg border bg-white"
                                    style={{
                                        borderColor: colors.outlineVariant,
                                        boxShadow: shadows.card,
                                    }}
                                >
                                    <div className="flex items-center justify-between border-b bg-[#f8fbff] px-4 py-3" style={{borderColor: colors.surfaceContainerHighest}}>
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white" style={{borderColor: colors.outlineVariant, color: colors.onSurface}}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                />
                                            </svg>
                                        </div>
                                        <h5 className="mb-0 text-sm font-semibold uppercase tracking-[0.08em]" style={{color: colors.onSurfaceVariant}}>
                                            Applications
                                        </h5>
                                        <div className="h-9 w-9" aria-hidden="true" />
                                    </div>

                                    <div className="px-2 pb-2 pt-1">
                                        <CustomAccordionStyleB
                                            title="Today"
                                            items={today}
                                            selectedItem={selectedApplication}
                                            onSelectItem={(item) => setSelectedApplication(item)}
                                            onDeleteItem={(item) => handleDeleteJobApplication(item)}
                                        />

                                        <CustomAccordionStyleB
                                            title="Yesterday"
                                            items={yesterday}
                                            selectedItem={selectedApplication}
                                            onSelectItem={(item) => setSelectedApplication(item)}
                                            onDeleteItem={(item) => handleDeleteJobApplication(item)}
                                        />

                                        <CustomAccordionStyleB
                                            title="Last 7 Days"
                                            items={thisWeek}
                                            selectedItem={selectedApplication}
                                            onSelectItem={(item) => setSelectedApplication(item)}
                                            onDeleteItem={(item) => handleDeleteJobApplication(item)}
                                        />

                                        <CustomAccordionStyleB
                                            title="This Month"
                                            items={thisMonth}
                                            selectedItem={selectedApplication}
                                            onSelectItem={(item) => setSelectedApplication(item)}
                                            onDeleteItem={(item) => handleDeleteJobApplication(item)}
                                        />

                                        <CustomAccordionStyleB
                                            title="This Year"
                                            items={thisYear}
                                            selectedItem={selectedApplication}
                                            onSelectItem={(item) => setSelectedApplication(item)}
                                            onDeleteItem={(item) => handleDeleteJobApplication(item)}
                                        />

                                        <CustomAccordionStyleB
                                            title="Older"
                                            items={older}
                                            selectedItem={selectedApplication}
                                            onSelectItem={(item) => setSelectedApplication(item)}
                                            onDeleteItem={(item) => handleDeleteJobApplication(item)}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="xl:col-span-8">
                                <div
                                    className="rounded-lg border bg-white p-4 md:p-5"
                                    style={{
                                        borderColor: colors.outlineVariant,
                                        boxShadow: shadows.card,
                                    }}
                                >
                                    {selectedApplication ? (
                                        <div>
                                            <div className="flex flex-wrap items-baseline justify-between gap-3">
                                                <div style={styles.jobInfo.header}>
                                                    {selectedApplication.data.openAIJobTitle} - {selectedApplication.data.openAIJobCompanyName}
                                                    {selectedApplication.data.jobPostingUrl && (
                                                        <button
                                                            className="cursor-pointer"
                                                            style={{
                                                                backgroundColor: "transparent",
                                                                border: "none",
                                                                color: colors.secondary,
                                                                textDecoration: "underline",
                                                                fontSize: "15px",
                                                                padding: 0,
                                                                marginLeft: "12px",
                                                            }}
                                                            onClick={() => handleViewJobPosting(selectedApplication.data.jobPostingUrl)}
                                                            aria-label="View job posting"
                                                        >
                                                            View job posting
                                                        </button>
                                                    )}
                                                </div>

                                                <div style={styles.jobInfo.normalText}>
                                                    <strong>Application Date:</strong> {moment(selectedApplication.data.date).format("MMMM Do YYYY, h:mm A")}
                                                </div>
                                            </div>

                                            <div style={styles.jobInfo.normalText}>
                                                <strong>Location:</strong> {selectedApplication.data.openAIJobLocation}
                                            </div>
                                            <div style={styles.jobInfo.normalText}>
                                                <strong>Expected Salary:</strong> {selectedApplication.data.openAIExpectedSalary}
                                            </div>
                                            <div style={styles.jobInfo.normalText}>
                                                <strong>Summary:</strong> {selectedApplication.data.openAISimpleJobDescription}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm" style={{color: colors.onSurfaceVariant}}>
                                            Select a job application to view details.
                                        </div>
                                    )}

                                    {selectedApplication?.data.resumeInfo && (
                                        <Button
                                            onClick={() => handleNavigate(ROUTES.RESUME_PRINT_PAGE)}
                                            className="mb-1 mt-5 cursor-pointer"
                                            style={{
                                                backgroundColor: colors.surfaceContainerHighest,
                                                borderColor: colors.outlineVariant,
                                                color: colors.onSurface,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5"
                                                 stroke="currentColor" className="size-6" style={{marginRight: '8px'}}>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                                            </svg>
                                            Download CV
                                        </Button>
                                    )}

                                    {selectedApplication?.data.resumeInfo && (
                                        <div style={{overflowX: 'auto', marginTop: '8px'}}>
                                            <div
                                                className="p-2"
                                                style={{
                                                    border: '1px solid #0f5a73',
                                                    borderRadius: '5px',
                                                    display: 'inline-block',
                                                    width: 'fit-content',
                                                    height: 'fit-content',
                                                }}
                                            >
                                                {renderResumeStyle(selectedApplication?.data.resumeInfo, selectedApplication.data.resumeStyle)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    {!isLoading && (
                        <Dialog open={isDeleteDialogOpen} as="div" className="relative z-10 focus:outline-hidden"
                                onClose={closeDeleteDialog}>
                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4">
                                    <DialogPanel
                                        transition
                                        className="w-full max-w-md rounded-xl bg-gray-100 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                                    >
                                        <div className={"flex justify-between items-center mb-4"}>
                                            {`Delete CV: ${jobApplicationToDelete?.data.openAIJobTitle} - ${jobApplicationToDelete?.data.openAIJobCompanyName}`}
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
                                                onClick={deleteJobApplication}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </DialogPanel>
                                </div>
                            </div>
                        </Dialog>
                    )}
                </div>
            </main>
        </AppLayout>
    );
};
