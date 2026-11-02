import React, {useState} from "react";
import moment from "moment";
import type {JobApplicationInfo} from "../../models/JobApplicationInfo";

const formatNumber = (value?: number) => (value === undefined ? "–" : value.toLocaleString("en-GB"));

const StatTile: React.FC<{label: string, value: string, detail?: string}> = ({label, value, detail}) => (
    <div className="rounded-lg border border-[#e3e8f2] bg-[#f9fbff] px-3 py-2.5">
        <p className="mb-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777d]">{label}</p>
        <p className="mb-0 mt-1 text-lg font-semibold tabular-nums text-[#161c22]">{value}</p>
        {detail && <p className="mb-0 text-xs text-[#5f6370]">{detail}</p>}
    </div>
);

const PromptBlock: React.FC<{title: string, content?: string}> = ({title, content}) => {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(content || "");
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error("Failed to copy prompt:", error);
        }
    };

    return (
        <div className="mt-3">
            <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#45464d]">{title}</span>
                <button
                    type="button"
                    onClick={() => void copy()}
                    className="cursor-pointer rounded-md border border-[#d6dcec] bg-white px-2 py-0.5 text-xs font-semibold text-[#4a4e57] transition-all hover:border-[#bacaf0]"
                >
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className="mb-0 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-[#e3e8f2] bg-[#0f172a] p-3 font-mono text-xs leading-5 text-[#e2e8f0]">
                {content || "(empty)"}
            </pre>
        </div>
    );
};

// Model, token usage, gaps and the exact prompt for one job application's AI generation.
export const GenerationDetails: React.FC<{application: JobApplicationInfo}> = ({application}) => {
    const info = application.generationInfo;
    const gaps = application.openAIGaps || [];

    return (
        <div className="mt-5 rounded-lg border border-[#dfe4ee] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eaeaf0] bg-[#f8fbff] px-4 py-3">
                <p className="mb-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">AI generation</p>
                {info?.model && (
                    <span className="rounded-full border border-[#d8e3f7] bg-white px-2.5 py-0.5 font-mono text-xs text-[#1f4f9c]">
                        {info.model}
                    </span>
                )}
            </div>

            <div className="px-4 py-4">
                {!info ? (
                    <p className="mb-0 text-sm text-[#5f6370]">
                        No generation details were recorded for this application. They're saved for applications generated from now on.
                    </p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            <StatTile
                                label="Input tokens"
                                value={formatNumber(info.promptTokens)}
                                detail={info.cachedTokens ? `${formatNumber(info.cachedTokens)} cached` : undefined}
                            />
                            <StatTile
                                label="Output tokens"
                                value={formatNumber(info.completionTokens)}
                                detail={info.reasoningTokens ? `${formatNumber(info.reasoningTokens)} reasoning` : undefined}
                            />
                            <StatTile label="Total tokens" value={formatNumber(info.totalTokens)} />
                            <StatTile
                                label="Time taken"
                                value={info.durationMs !== undefined ? `${(info.durationMs / 1000).toFixed(1)}s` : "–"}
                            />
                        </div>

                        <p className="mb-0 mt-3 text-xs text-[#5f6370]">
                            {info.generatedAt && `Generated ${moment(info.generatedAt).format("D MMM YYYY, HH:mm")}`}
                            {info.requestedModel && info.requestedModel !== info.model && ` · requested ${info.requestedModel}`}
                        </p>
                    </>
                )}

                {gaps.length > 0 && (
                    <div className="mt-4 rounded-lg border border-[#f1d8a8] bg-[#fff8ec] px-4 py-3">
                        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a5a00]">Gaps</p>
                        <ul className="mb-0 list-disc pl-5 text-sm leading-6 text-[#161c22]">
                            {gaps.map((gap) => <li key={gap}>{gap}</li>)}
                        </ul>
                    </div>
                )}

                {info?.systemPrompt && (
                    <details className="mt-4 group">
                        <summary className="cursor-pointer select-none text-sm font-semibold text-[#161c22]">
                            Prompt sent
                        </summary>
                        <PromptBlock title="Instructions (system)" content={info.systemPrompt}/>
                        <PromptBlock title="Job description and CV (user)" content={info.userPrompt}/>
                    </details>
                )}
            </div>
        </div>
    );
};
