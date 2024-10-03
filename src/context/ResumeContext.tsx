import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {resumeData as initialResumeData} from "../data/resumeData";
import {ResumeData} from "../models/ResumeData";

interface ResumeContextType {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>
}
const ResumeContext = createContext<ResumeContextType | null>(null);

type ResumeProviderProps = {
    children: ReactNode;
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({children}) => {
    const [resumeData, setResumeData] = useState(initialResumeData)
    const value = {resumeData, setResumeData}

    useEffect(() => {
        console.log(">>>>>>>>>>" + JSON.stringify(resumeData))
    }, [resumeData]);


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