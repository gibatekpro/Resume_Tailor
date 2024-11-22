import React, { useEffect, useState } from "react";
import '../styles/resumeInput.css'; // Updated styles
import ResumeForm from "../components/forms/resumeForm/ResumeForm";
import InstructionForm from "../components/forms/instructionForm/InstructionForm";
import {useResumeProvider} from "../context/ResumeContext";
import {openAIInstruction} from "../data/openAIInstruction";

export const ResumeInfoPage: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    const [instructionFormValues, setInstructionFormValues] = useState(openAIInstruction);
    const [resumeFormValues, setResumeFormValues] = useState(resumeData);

    useEffect(() => {

    }, [instructionFormValues, resumeFormValues]);

    return(
        <div className="container  bg-gray-100">

            <div className="row g-5">
                    <ResumeForm onValuesChange={(values) => setResumeFormValues(values)}/>
                <div className="col-md-4">
                    <div className="position-sticky" style={{
                        top: "2rem"
                    }}>
                        <InstructionForm
                            resumeFormValues={resumeFormValues}
                            onValuesChange={(values) => setInstructionFormValues(values)}/>
                    </div>
                </div>
            </div>

        </div>
    );
};
