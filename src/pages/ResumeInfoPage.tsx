import React, { useEffect, useState } from "react";
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
import {LOCAL_STORAGE_RESUME_DATA} from "../data/applicationData";

export const ResumeInfoPage: React.FC = () => {
    const { resumeData, setResumeData } = useResumeProvider();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const saved = localStorage.getItem(LOCAL_STORAGE_RESUME_DATA);
    const SavedResumeDataOpenAI = saved ? JSON.parse(saved) : DefaultResumeData;


    const customResumeFormFormik = useFormik({
        initialValues: CustomResumeData,
        onSubmit: (values) => {
        },
    });

    const generatedResumeFormFormik = useFormik({
        initialValues: SavedResumeDataOpenAI || DefaultResumeData,
        onSubmit: (values) => {
            setResumeData(values);
            navigate('/print');
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
            return null; // Return null if there's an error
        }
    };

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_RESUME_DATA, JSON.stringify(generatedResumeFormFormik.values));
    }, [generatedResumeFormFormik]);

    return(
        <div className="bg-gray-100 py-4">
            <div className="row g-1 p-2 p-md-0">

                <div className="col-md-4">
                    <ResumeForm
                        resumeFormFormik={customResumeFormFormik}
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
                    <ResumeForm
                        hasSubmitButton={true}
                        resumeFormFormik={generatedResumeFormFormik}
                    />
                </div>

            </div>

        </div>
    );
};
