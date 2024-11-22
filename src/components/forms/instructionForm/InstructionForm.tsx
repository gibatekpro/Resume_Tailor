import { useFormik } from "formik";
import React, {useEffect, useState} from "react";
import { OpenAIInstruction } from "../../../models/OpenAIInstruction";
import { openAIInstruction } from "../../../data/openAIInstruction";
import { SectionHeader } from "./SectionHeader";
import {Button, Spinner} from "react-bootstrap";
import {useResumeProvider} from "../../../context/ResumeContext";
import {JobApplicationInfo} from "../../../models/JobApplicationInfo";
import {ResumeInfo} from "../../../models/ResumeInfo";
import resumeForm from "../resumeForm/ResumeForm";

interface InstructionFormProps {
    resumeFormValues?: ResumeInfo;
    onValuesChange: React.Dispatch<React.SetStateAction<OpenAIInstruction>>;
}

const InstructionForm: React.FC<InstructionFormProps> = ({ resumeFormValues, onValuesChange }) => {
    const {resumeData, setResumeData} = useResumeProvider();
    const {openAIInstructionData, setOpenAIInstructionData} = useResumeProvider();
    const [isLoading, setIsLoading] = useState(false);

    const inputFieldClassName =
        "mt-1 block w-full px-3 py-2 focus:outline-none " +
        "focus:ring-0 focus:border-black focus:border-2 sm:text-sm";

    const defaultValues: OpenAIInstruction = {
        openAINote: [...(openAIInstruction.openAINote || [])],
        jobDescriptionData: openAIInstruction.jobDescriptionData || "",
    };

    const instructionFormFormik = useFormik({
        initialValues: defaultValues,
        onSubmit: (values) => {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                console.log(openAIInstructionData);
            }, 3000);
        },
    });


    const notes = instructionFormFormik.values.openAINote || [];

    const addNote = () => {
        const updatedNotes = [...notes, ""];
        instructionFormFormik.setFieldValue("openAINote", updatedNotes);
    };

    const removeNote = (noteIndex: number) => {
        const updatedNotes = notes.filter((_, idx) => idx !== noteIndex);
        instructionFormFormik.setFieldValue("openAINote", updatedNotes);
    };

    const pasteItem = async (field: string) => {
        try {
            const text = await navigator.clipboard.readText();
            await instructionFormFormik.setFieldValue(field, text);
        } catch (err) {
            console.error('Failed to paste text from clipboard or invalid JSON format:', err);
        }
    };

    const clearField = (field: string) => {
        instructionFormFormik.setFieldValue(field, "");
    };

    const OpenAINoteInput: React.FC<{ noteIndex: number }> = ({ noteIndex }) => {
        const [isIconVisible, setIsIconVisible] = useState(false);

        return (
            <div
                className="flex items-center bg-white mt-1"
                onMouseEnter={() => setIsIconVisible(true)}
                onMouseLeave={() => setIsIconVisible(false)}
            >
                <input
                    id={`openAINote-${noteIndex}`}
                    name={`openAINote[${noteIndex}]`}
                    type="text"
                    placeholder="Add Note"
                    className={`${inputFieldClassName} flex-1`}
                    onChange={instructionFormFormik.handleChange}
                    value={instructionFormFormik.values.openAINote?.[noteIndex] || ""} // Use optional chaining
                />

                {isIconVisible && (
                    <>
                        {notes.length - 1 === noteIndex && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 ml-2 text-gray-500 cursor-pointer mr-1"
                                onClick={addNote}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        )}
                        {notes.length > 1 && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 ml-2 text-gray-500 cursor-pointer mr-1"
                                onClick={() => removeNote(noteIndex)}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        )}
                    </>
                )}
            </div>
        );
    };

    useEffect(() => {
        onValuesChange(instructionFormFormik.values);
        setOpenAIInstructionData(instructionFormFormik.values);
        setOpenAIInstructionData({
            ...openAIInstructionData,
            ...instructionFormFormik.values,
            resumeInfo: resumeFormValues
        });
    }, [instructionFormFormik.values, resumeFormValues]);

    return (
        <div className="">
            <div className="flex justify-center items-center">
                <form onSubmit={instructionFormFormik.handleSubmit} className="w-full max-w-lg">
                    <div className="mb-4">
                        <SectionHeader
                            title={"Job Description"}
                            pasteItem={() => pasteItem("jobDescriptionData")}
                            clearField={() => clearField("jobDescriptionData")}
                            hasAddIcon={false}
                            hasDeleteIcon={false}
                            hasPasteIcon={true}
                            hasClearIcon={true}
                        />
                        <textarea
                            id="jobDescriptionData"
                            name="jobDescriptionData"
                            placeholder="Enter the job description here..."
                            className={`${inputFieldClassName} h-24`}
                            onChange={instructionFormFormik.handleChange}
                            value={instructionFormFormik.values.jobDescriptionData}
                        />
                    </div>
                    <div className={"mt-5"}></div>
                    <SectionHeader
                        title={"OpenAI Instructions"}
                        hasAddIcon={false}
                        hasDeleteIcon={false}
                        hasPasteIcon={false}
                        hasClearIcon={false}
                    />
                    <div className="bg-white mb-1">
                        {instructionFormFormik.values.openAINote?.map((_, noteIndex: number) => (
                            <OpenAINoteInput key={noteIndex} noteIndex={noteIndex} />
                        ))}
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
                        disabled={isLoading} // Disable the button while loading
                    >
                        {isLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Generating...
                            </>
                        ) : (
                            "Generate CV"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default InstructionForm;
