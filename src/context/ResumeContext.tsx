import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {resumeData as initialResumeData} from "../data/resumeData";
import {openAIInstruction as initialOpenAIInstructionData} from "../data/openAIInstruction";
import {ResumeData} from "../models/ResumeData";
import {ResumeInfo} from "../models/ResumeInfo";
import {openAIInstruction} from "../data/openAIInstruction";
import {OpenAIInstruction} from "../models/OpenAIInstruction";
import {DefaultResumeData} from "../data/defaultResumeData";

interface ResumeContextType {
    resumeData: ResumeInfo;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeInfo>>
    resumeDataOpenAI: ResumeInfo;
    setResumeDataOpenAI: React.Dispatch<React.SetStateAction<ResumeInfo>>
    openAIInstructionData: OpenAIInstruction;
    setOpenAIInstructionData: React.Dispatch<React.SetStateAction<OpenAIInstruction>>
    hideButton: boolean;
    setHideButton: React.Dispatch<React.SetStateAction<boolean>>
}
const ResumeContext = createContext<ResumeContextType | null>(null);

type ResumeProviderProps = {
    children: ReactNode;
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({children}) => {
    const [resumeData, setResumeData] = useState(initialResumeData);
    const [resumeDataOpenAI, setResumeDataOpenAI] = useState(DefaultResumeData);
    const [openAIInstructionData, setOpenAIInstructionData] = useState(initialOpenAIInstructionData);
    const [hideButton, setHideButton] = useState(false);
    const value = {resumeData, setResumeData, resumeDataOpenAI, setResumeDataOpenAI, hideButton, setHideButton, openAIInstructionData, setOpenAIInstructionData}

    useEffect(() => {
    }, [resumeData]);
    //
    // useEffect(() => {
    // }, [resumeDataOpenAI]);


    return(
        <ResumeContext.Provider value={value}>
            {children}
        </ResumeContext.Provider>
    );

}

export const useResumeProvider = () => {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error("useResume must be used within a ResumeProvider");
    }
    return context;
}