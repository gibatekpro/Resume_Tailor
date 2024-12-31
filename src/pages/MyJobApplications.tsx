import React, {useEffect, useState} from "react";
import moment from "moment";
import {CustomAccordionStyleB} from "../custom_tags/CustomAccordionStyleB";
import {Button, Card, Col, Row} from "react-bootstrap";
import "../styles/myJobApplications.css";
import {ResumeStyleB} from "../components/resume-style-b/ResumeStyleB";
import JobApplicationService from "../services/JobApplicationService";
import {JobApplicationInfo} from "../models/JobApplicationInfo";
import {useNavigate} from "react-router-dom";
import ROUTES from "../data/routes";
import {JobApplicationsResponse} from "../models/JobApplicationsResponse";
import STORAGE from "../data/storage";
import {Dialog, DialogPanel} from "@headlessui/react";
import {SavedResumesResponse} from "../models/SavedResumesResponse";
import {ResumeStyleA} from "../components/resume-style-a/ResumeStyleA";
import {renderResumeStyle} from "../utils/HelperFunctions";

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
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true);
            try {
                const applications: JobApplicationsResponse[] = await JobApplicationService.getAllJobApplications();

                setJobApplicationsList(applications);

                // Initialize empty arrays to hold the job applications for each category
                const todayArr: JobApplicationsResponse[] = [];
                const yesterdayArr: JobApplicationsResponse[] = [];
                const thisWeekArr: JobApplicationsResponse[] = [];
                const thisMonthArr: JobApplicationsResponse[] = [];
                const thisYearArr: JobApplicationsResponse[] = [];
                const olderArr: JobApplicationsResponse[] = [];

                // Loop through the applications and categorize them
                applications.forEach((data) => {
                    const date = moment(data.data.date);

                    // Check if the application is from today
                    const today = moment().startOf("day");
                    if (date.isSame(today, "day")) {
                        todayArr.push(data);
                    }

                    // Check if the application is from yesterday
                    const yesterday = moment().subtract(1, "day").startOf("day");
                    if (date.isSame(yesterday, "day")) {
                        if (!todayArr.includes(data)) {
                            yesterdayArr.push(data); // Add to yesterdayArr array if not already added as today
                        }
                    }


                    const startOfWeek = moment().subtract(7, 'days').startOf("day");
                    if (date.isSameOrAfter(startOfWeek, "day")) {
                        if (!todayArr.includes(data)) {
                            thisWeekArr.push(data); // Add to thisWeek array if not already added as today
                        }
                    }

                    // Check if the application is from this month
                    const startOfMonth = moment().startOf("month");
                    if (date.isSameOrAfter(startOfMonth, "day")) {
                        if (!todayArr.includes(data)) {
                            thisMonthArr.push(data); // Add to thisMonth array if not already added as today
                        }
                    }

                    // Check if the application is from this year
                    const startOfYear = moment().startOf("year");
                    if (date.isSameOrAfter(startOfYear, "day")) {
                        if (!todayArr.includes(data) && !thisMonthArr.includes(data) && !thisWeekArr.includes(data)) {
                            thisYearArr.push(data); // Add to thisYear array if not already added as today or this month
                        }
                    }

                    // For applications older than this year
                    if (date.isBefore(startOfYear, "day")) {
                        olderArr.push(data);
                    }
                });

                // Update the state with categorized arrays
                setToday(todayArr);
                setYesterday(yesterdayArr);
                setThisWeek(thisWeekArr);
                setThisMonth(thisMonthArr);
                setThisYear(thisYearArr);
                setOlder(olderArr);

                if (selectedApplication == null) {
                    setSelectedApplication(
                        today?.length > 0 ? today[0] :
                            yesterday?.length > 0 ? yesterday[0] :
                            thisWeek?.length > 0 ? thisWeek[0] :
                                thisMonth?.length > 0 ? thisMonth[0] :
                                    thisYear?.length > 0 ? thisYear[0] :
                                        older?.length > 0 ? older[0] : undefined
                    );
                }


                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching job applications:", error);
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    useEffect(() => {
        try {

            // Initialize empty arrays to hold the job applications for each category
            const todayArr: JobApplicationsResponse[] = [];
            const yesterdayArr: JobApplicationsResponse[] = [];
            const thisWeekArr: JobApplicationsResponse[] = [];
            const thisMonthArr: JobApplicationsResponse[] = [];
            const thisYearArr: JobApplicationsResponse[] = [];
            const olderArr: JobApplicationsResponse[] = [];

            // Loop through the applications and categorize them
            jobApplicationsList.forEach((data) => {
                const date = moment(data.data.date);

                // Check if the application is from today
                const today = moment().startOf("day");
                if (date.isSame(today, "day")) {
                    todayArr.push(data);
                }

                // Check if the application is from yesterday
                const yesterday = moment().subtract(1, "day").startOf("day");
                if (date.isSame(yesterday, "day")) {
                    if (!todayArr.includes(data)) {
                        yesterdayArr.push(data); // Add to yesterdayArr array if not already added as today
                    }
                }


                const startOfWeek = moment().subtract(7, 'days').startOf("day");
                if (date.isSameOrAfter(startOfWeek, "day")) {
                    if (!todayArr.includes(data)) {
                        thisWeekArr.push(data); // Add to thisWeek array if not already added as today
                    }
                }

                // Check if the application is from this month
                const startOfMonth = moment().startOf("month");
                if (date.isSameOrAfter(startOfMonth, "day")) {
                    if (!todayArr.includes(data)) {
                        thisMonthArr.push(data); // Add to thisMonth array if not already added as today
                    }
                }

                // Check if the application is from this year
                const startOfYear = moment().startOf("year");
                if (date.isSameOrAfter(startOfYear, "day")) {
                    if (!todayArr.includes(data) && !thisMonthArr.includes(data) && !thisWeekArr.includes(data)) {
                        thisYearArr.push(data); // Add to thisYear array if not already added as today or this month
                    }
                }

                // For applications older than this year
                if (date.isBefore(startOfYear, "day")) {
                    olderArr.push(data);
                }
            });

            // Update the state with categorized arrays
            setToday(todayArr);
            setYesterday(yesterdayArr);
            setThisWeek(thisWeekArr);
            setThisMonth(thisMonthArr);
            setThisYear(thisYearArr);
            setOlder(olderArr);

            if (selectedApplication == null) {
                setSelectedApplication(
                    today?.length > 0 ? today[0] :
                        yesterday?.length > 0 ? yesterday[0] :
                            thisWeek?.length > 0 ? thisWeek[0] :
                                thisMonth?.length > 0 ? thisMonth[0] :
                                    thisYear?.length > 0 ? thisYear[0] :
                                        older?.length > 0 ? older[0] : undefined
                );
            }


            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching job applications:", error);
            setIsLoading(false);
        }
    }, [jobApplicationsList]);

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
            const fetchResumes = async () => {
                setIsLoading(true);
                try {
                    const applications: JobApplicationsResponse[] = await JobApplicationService.getAllJobApplications();

                    setJobApplicationsList(applications);

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

    return (
        <div className="py-0 my-2">
            {isLoading && (
                <div style={overlayStyle}>
                    <div style={loadingMessageStyle}>Loading, please wait...</div>
                </div>
            )}
            {!isLoading && (
                <div className="row g-1 p-2 p-md-0">
                    {/* Left Column */}
                    <div
                        className="col-md-3 pb-4"
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
                                <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                        />
                                    </svg>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} xl={6} style={styles.rightBorderStyle}>
                                    Applications
                                </Col>
                                <Col xs={3} sm={3} md={3} lg={3} xl={3}/>
                            </Row>
                        </div>

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

                    {/* Right Column */}
                    <div className="col-md-9 px-2">
                        {selectedApplication ? (
                            <div>
                                <div className="row align-items-baseline">
                                    <div className="col-12 col-sm">
                                        <div style={styles.jobInfo.header}>
                                            {selectedApplication.data.openAIJobTitle} - {selectedApplication.data.openAIJobCompanyName}
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-auto text-sm-end">
                                        <div style={styles.jobInfo.normalText}>
                                            <strong>Application
                                                Date:</strong> {moment(selectedApplication.data.date).format("MMMM Do YYYY, h:mm A")}
                                        </div>
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
                            <div>Select a job application to view details.</div>
                        )}
                        {selectedApplication?.data.resumeInfo && (
                            <Button onClick={() => handleNavigate(ROUTES.RESUME_PRINT_PAGE)} className="mb-1 mt-5"
                                    style={{
                                        backgroundColor: '#ccc',
                                        borderColor: '#ccc',
                                        color: 'black',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
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
                            <div className="p-2" style={{
                                border: "1px solid #0f5a73",
                                borderRadius: "5px",
                                display: "inline-block",
                                width: "fit-content",
                                height: "fit-content",
                            }}>
                                {renderResumeStyle(selectedApplication?.data.resumeInfo, selectedApplication.data.resumeStyle)}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {!isLoading && (
                <div className="row g-1 p-2 p-md-0">
                    <Dialog open={isDeleteDialogOpen} as="div" className="relative z-10 focus:outline-none"
                            onClose={closeDeleteDialog}>
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <DialogPanel
                                    transition
                                    className="w-full max-w-md rounded-xl bg-gray-100 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                                >
                                    <div className={"flex justify-between items-center mb-4"}>
                                        {`Delete CV: ${jobApplicationToDelete?.data.openAIJobTitle} - ${jobApplicationToDelete?.data.openAIJobCompanyName}`}
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
                                        onClick={deleteJobApplication}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>
                </div>
            )}
        </div>
    );
};
