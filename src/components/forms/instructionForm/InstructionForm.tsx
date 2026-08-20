import React from "react";
import {SectionHeader} from "./SectionHeader";
import {Button, Spinner} from "react-bootstrap";
import {RulesInput} from "./RulesInput";
import {openAIInstruction} from "../../../data/openAIInstruction";

interface InstructionFormProps {
    instructionFormFormik: any
    isLoading: boolean
}

const InstructionForm: React.FC<InstructionFormProps> = ({instructionFormFormik, isLoading}) => {
    const inputFieldClassName =
        "mt-1 block w-full border border-[#c6c6cd] bg-[#f6f9ff] px-4 py-2 text-[14px] text-[#161c22] transition-all duration-200 ease-out placeholder:text-[#76777d] focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#d8e2ff] focus:ring-offset-0";

    const rules = instructionFormFormik.values.rules || [];

    const addRule = () => {
        const updatedRules = [...rules, ""];
        instructionFormFormik.setFieldValue("rules", updatedRules);
    };

    const removeNote = (noteIndex: number) => {
        const updatedRules = rules.filter((_: string, idx: number) => idx !== noteIndex);
        instructionFormFormik.setFieldValue("rules", updatedRules);
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

    const resetRules = () => {
        // console.log("Resetting rules to:", openAIInstruction?.rules);
        instructionFormFormik.setFieldValue("rules", openAIInstruction?.rules);
    };

    return (
        <div className="mt-0 mt-md-4">
            <div className="flex justify-center items-center">
                <form onSubmit={instructionFormFormik.handleSubmit} className="w-full">
                    <div className="mb-4">
                        <SectionHeader
                            title={"Job Description"}
                            pasteItem={() => pasteItem("jobDescriptionData")}
                            clearField={() => clearField("jobDescriptionData")}
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
                        {instructionFormFormik.touched.jobDescriptionData && instructionFormFormik.errors.jobDescriptionData && (
                            <span
                                className="sm:text-sm text-red-600">Job Description is required. Input job description</span>
                        )}

                        <span></span>
                    </div>
                    <div className={"mt-5"}></div>
                    <SectionHeader
                        title={"OpenAI Instructions"}
                        reset={resetRules}
                        hasResetButton={true}
                    />
                    <div className="bg-white mb-1">
                        {instructionFormFormik?.values?.rules?.map((_: string, index: number) => (
                            <RulesInput
                                key={index}
                                ruleIndex={index}
                                instructionFormFormik={instructionFormFormik}
                                inputFieldClassName={inputFieldClassName}
                                rules={rules}
                                addRule={addRule}
                                removeRule={(index) => removeNote(index)}/>
                        ))}
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full border border-[#c6c6cd] bg-[#2170e4] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all duration-200 ease-out hover:bg-[#185fd1] disabled:cursor-not-allowed disabled:opacity-70"
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
