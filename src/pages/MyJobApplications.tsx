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
import {LOCAL_STORAGE_APPLICATION_DATA} from "../data/applicationData";

export const MyJobApplications: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [today, setToday] = useState<JobApplicationInfo[]>([]);
    const [thisWeek, setThisWeek] = useState<JobApplicationInfo[]>([]);
    const [thisMonth, setThisMonth] = useState<JobApplicationInfo[]>([]);
    const [thisYear, setThisYear] = useState<JobApplicationInfo[]>([]);
    const [older, setOlder] = useState<JobApplicationInfo[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<JobApplicationInfo>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true);
            try {
                const applications = await JobApplicationService.getAllJobApplications();

                // Initialize empty arrays to hold the job applications for each category
                const todayArr: JobApplicationInfo[] = [];
                const thisWeekArr: JobApplicationInfo[] = [];
                const thisMonthArr: JobApplicationInfo[] = [];
                const thisYearArr: JobApplicationInfo[] = [];
                const olderArr: JobApplicationInfo[] = [];

                // Loop through the applications and categorize them
                applications.forEach(({data}) => {
                    const date = moment(data.date); // Convert the string to a moment object

                    // Check if the application is from today
                    const today = moment().startOf("day");
                    if (date.isSame(today, "day")) {
                        todayArr.push(data);
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
                setThisWeek(thisWeekArr);
                setThisMonth(thisMonthArr);
                setThisYear(thisYearArr);
                setOlder(olderArr);

                if (selectedApplication == null) {
                    setSelectedApplication(
                        today?.length > 0 ? today[0] :
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
                        className="col-md-2 pb-4"
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

                        <CustomAccordionStyleB title="Today">
                            {today.map((item, index) => (
                                <div key={index} onClick={() => setSelectedApplication(item)}
                                     style={{padding: 5, borderBottom: "1px solid lightgray", fontSize: 14}}>
                                    {`${item.openAIJobTitle} - ${item.openAIJobCompanyName}`}
                                </div>
                            ))}
                        </CustomAccordionStyleB>

                        <CustomAccordionStyleB title="Last 7 Days">
                            {thisWeek.map((item, index) => (
                                <div key={index} onClick={() => setSelectedApplication(item)}
                                     style={{padding: 5, borderBottom: "1px solid lightgray", fontSize: 14}}>
                                    {`${item.openAIJobTitle} - ${item.openAIJobCompanyName}`}
                                </div>
                            ))}
                        </CustomAccordionStyleB>


                        <CustomAccordionStyleB title="This Month">
                            {thisMonth.map((item, index) => (
                                <div key={index} onClick={() => setSelectedApplication(item)}
                                     style={{padding: 5, borderBottom: "1px solid lightgray", fontSize: 14}}>
                                    {`${item.openAIJobTitle} - ${item.openAIJobCompanyName}`}
                                </div>
                            ))}
                        </CustomAccordionStyleB>

                        <CustomAccordionStyleB title="This Year">
                            {thisYear.map((item, index) => (
                                <div key={index} onClick={() => setSelectedApplication(item)}
                                     style={{padding: 5, borderBottom: "1px solid lightgray", fontSize: 14}}>
                                    {`${item.openAIJobTitle} - ${item.openAIJobCompanyName}`}
                                </div>
                            ))}
                        </CustomAccordionStyleB>

                        <CustomAccordionStyleB title="Older">
                            {older.map((item, index) => (
                                <div key={index} onClick={() => setSelectedApplication(item)}
                                     style={{padding: 5, borderBottom: "1px solid lightgray", fontSize: 14}}>
                                    {`${item.openAIJobTitle} - ${item.openAIJobCompanyName}`}
                                </div>
                            ))}
                        </CustomAccordionStyleB>

                    </div>

                    {/* Right Column */}
                    <div className="col-md-10 px-2">
                        {selectedApplication ? (
                            <div>
                                <div className="row align-items-baseline">
                                    <div className="col-12 col-sm">
                                        <div style={styles.jobInfo.header}>
                                            {selectedApplication.openAIJobTitle} - {selectedApplication.openAIJobCompanyName}
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-auto text-sm-end">
                                        <div style={styles.jobInfo.normalText}>
                                            <strong>Application
                                                Date:</strong> {moment(selectedApplication.date).format("MMMM Do YYYY, h:mm A")}
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.jobInfo.normalText}>
                                    <strong>Location:</strong> {selectedApplication.openAIJobLocation}
                                </div>
                                <div style={styles.jobInfo.normalText}>
                                    <strong>Expected Salary:</strong> {selectedApplication.openAIExpectedSalary}
                                </div>
                                <div style={styles.jobInfo.normalText}>
                                    <strong>Summary:</strong> {selectedApplication.openAISimpleJobDescription}
                                </div>
                            </div>
                        ) : (
                            <div>Select a job application to view details.</div>
                        )}
                        {selectedApplication?.resumeInfo && (
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
                        {selectedApplication?.resumeInfo && (
                            <div className="p-2" style={{
                                border: "1px solid #0f5a73",
                                borderRadius: "5px",
                                // display: "inline-block",
                                // width: "fit-content",
                                // height: "fit-content",
                            }}>
                                <ResumeStyleB resumeData={selectedApplication?.resumeInfo}/>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
