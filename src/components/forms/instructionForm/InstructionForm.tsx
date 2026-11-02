import React from "react";
import {SectionHeader} from "./SectionHeader";
import {Button, Spinner} from "react-bootstrap";
import {RulesInput} from "./RulesInput";
import {openAIInstruction} from "../../../data/openAIInstruction";
import {Link} from "react-router-dom";
import ROUTES from "../../../utils/Routes";

interface InstructionFormProps {
    instructionFormFormik: any
    isLoading: boolean
    models: string[]
}

const InstructionForm: React.FC<InstructionFormProps> = ({instructionFormFormik, isLoading, models}) => {
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
                            className={`${inputFieldClassName} h-56`}
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
                    <div className="mb-4 rounded-lg border border-[#d8e3f7] bg-[#f8fbff] px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">Always applied</p>
                        <ul className="mt-2 mb-0 list-disc pl-5 text-xs leading-5 text-[#45464d]">
                            <li>Job titles, employers, dates, education, your name and project names are kept exactly as written.</li>
                            <li>Bullets are rewritten and reordered so your most relevant work comes first, in the job's wording, without overstating what you did.</li>
                            <li>A skill the job asks for is only added when your CV backs it up, and you'll see the line from your CV that proves it.</li>
                            <li>No invented tools, achievements or numbers. Anything the job wants that your CV doesn't show is listed under Gaps.</li>
                        </ul>
                    </div>
                    <SectionHeader
                        title={"Your Preferences"}
                        reset={resetRules}
                        hasResetButton={true}
                    />
                    <p className="-mt-2 mb-2 text-xs leading-5 text-[#5f6370]">
                        Style rules such as bullet count, spelling or length. They can't override the rules above.
                    </p>
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

                    <label htmlFor="tailorSummary" className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-[#dfe4ee] bg-white px-3 py-2.5">
                        <input
                            id="tailorSummary"
                            name="tailorSummary"
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 cursor-pointer accent-[#2170e4]"
                            checked={!!instructionFormFormik.values.tailorSummary}
                            onChange={instructionFormFormik.handleChange}
                        />
                        <span>
                            <span className="block text-sm font-semibold text-[#161c22]">Tailor my summary</span>
                            <span className="block text-xs leading-5 text-[#5f6370]">
                                Rewrites your profile summary to lead with what this job values, using only facts from your CV.
                            </span>
                        </span>
                    </label>

                    <div className="mt-5">
                        <div className="mb-1 flex items-center justify-between">
                            <label htmlFor="model" className="text-sm font-semibold text-[#161c22]">Model</label>
                            <Link to={ROUTES.SETTINGS} className="text-xs font-semibold text-[#2170e4] no-underline hover:underline">
                                Manage models
                            </Link>
                        </div>
                        <select
                            id="model"
                            name="model"
                            className={`${inputFieldClassName} cursor-pointer font-mono`}
                            onChange={instructionFormFormik.handleChange}
                            value={instructionFormFormik.values.model}
                        >
                            {models.map((model) => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
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
