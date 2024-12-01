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
import {LOCAL_STORAGE_APPLICATION_DATA, LOCAL_STORAGE_RESUME_DATA} from "../data/applicationData";
import ROUTES from "../data/routes";
import JobApplicationService from "../services/JobApplicationService";
import {useAuth} from "../context/auth/AuthProvider";
import {JobApplicationInfo} from "../models/JobApplicationInfo";
import {ResumeInfo} from "../models/ResumeInfo";
import {CustomAccordion} from "../custom_tags/CustomAccordion";
import {openAIInstruction} from "../data/openAIInstruction";
import moment from "moment";

export const ResumeInfoPage: React.FC = () => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const [jobApplicationInfo, setJobApplicationInfo] = useState<JobApplicationInfo>();
    const {resumeData, setResumeData} = useResumeProvider();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const saved = localStorage.getItem(LOCAL_STORAGE_RESUME_DATA);
    const SavedResumeDataOpenAI = saved ? JSON.parse(saved) : DefaultResumeData;
    const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
    const [isGeneratedFormOpen, setIsGeneratedFormOpen] = useState(false);


    const customResumeFormFormik = useFormik({
        initialValues: CustomResumeData,
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
        initialValues: InstructionResumeData,
        validationSchema: () => Yup.object().shape({
            jobDescriptionData: Yup.string().min(100).required()
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            const openAIInstruction: OpenAIInstruction = {
                ...values,
                resumeInfo: customResumeFormFormik.values
            }
            const response = await getOpenAIResponse(JSON.stringify(openAIInstruction));

            if (response) {
                const parsedResponse = JSON.parse(response);
                setJobApplicationInfo(parsedResponse);
                await generatedResumeFormFormik.setValues(parsedResponse.resumeInfo);
            }

            setIsLoading(false);
        },
    });

    const getOpenAIResponse = async (prompt: string): Promise<string | null> => {
        try {
            const response = await fetchOpenAIResponse(prompt);

            // Assuming `response.choices` structure
            let jsonContent = response.choices[0]?.message?.content;

            console.log("Parsed JSON Response:", jsonContent);

            return jsonContent || null;
        } catch (error) {
            console.error("Error parsing JSON response:", error);
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

    //     openAIJobTitle?: string,
    //     openAIExpectedSalary?: string,
    //     openAIJobLocation?: string,
    //     openAISimpleJobDescription?: string,
    //     resumeInfo?: ResumeInfo,

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_RESUME_DATA, JSON.stringify(generatedResumeFormFormik.values));
        const savedJobApplicationInfo = {
            date: moment(new Date(), "YYYY-MM-DD HH:mm"),
            openAIDocumentTitle: jobApplicationInfo?.openAIDocumentTitle,
            openAIJobTitle: jobApplicationInfo?.openAIJobTitle,
            openAIExpectedSalary: jobApplicationInfo?.openAIExpectedSalary,
            openAIJobLocation: jobApplicationInfo?.openAIJobLocation,
            openAISimpleJobDescription: jobApplicationInfo?.openAISimpleJobDescription,
            resumeInfo: generatedResumeFormFormik.values,
        }
        localStorage.setItem(LOCAL_STORAGE_APPLICATION_DATA, JSON.stringify(savedJobApplicationInfo));
    }, [generatedResumeFormFormik]);

    return (

        <div className="bg-gray-100 py-4">

            {isLoading && (
                <div style={overlayStyle}>
                    <div style={loadingMessageStyle}>Loading, please wait...</div>
                </div>
            )}

            <div style={isLoading ? blurredStyle : {}}>

                <div className="row g-1 p-2 p-md-0">

                    <div className="col-md-4">
                        <CustomAccordion
                            isOpen={isCustomFormOpen}
                            setIsOpen={setIsCustomFormOpen}
                            children={<ResumeForm
                                resumeFormFormik={customResumeFormFormik}
                            />}
                        />
                    </div>

                    <div className="col-md-4 mt-10 mt-md-0">
                        <div className="position-sticky" style={{
                            top: "2rem"
                        }}>
                            <InstructionForm
                                isLoading={isLoading}
                                instructionFormFormik={instructionFormFormik}/>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <CustomAccordion isOpen={isGeneratedFormOpen} setIsOpen={setIsGeneratedFormOpen}
                                         children={<ResumeForm
                                             hasSubmitButton={true}
                                             resumeFormFormik={generatedResumeFormFormik}
                                         />}
                        />
                    </div>

                </div>
            </div>

        </div>
    );
};
