import React from "react";
import type {FitRecommendation, RequirementResult, Strength, TailoringReport} from "../../models/TailoringPipeline";

const RECOMMENDATION_STYLE: Record<FitRecommendation, string> = {
    "Strong fit": "border-[#b7e1c2] bg-[#edf9f1] text-[#225b34]",
    "Worth applying": "border-[#c9daf8] bg-[#eef4ff] text-[#1f4f9c]",
    "Stretch": "border-[#f1d8a8] bg-[#fff8ec] text-[#8a5a00]",
    "Poor fit": "border-[#f1c4c4] bg-[#fff4f4] text-[#9b1c1c]",
};

const BAR_COLOUR: Record<FitRecommendation, string> = {
    "Strong fit": "bg-[#2f8a4c]",
    "Worth applying": "bg-[#2170e4]",
    "Stretch": "bg-[#c98a12]",
    "Poor fit": "bg-[#c43d3d]",
};

const STATUS: Record<Strength, {label: string, mark: string, className: string}> = {
    strong: {label: "Met", mark: "✓", className: "border-[#b7e1c2] bg-[#edf9f1] text-[#225b34]"},
    partial: {label: "Partial", mark: "~", className: "border-[#f1d8a8] bg-[#fff8ec] text-[#8a5a00]"},
    none: {label: "Missing", mark: "✕", className: "border-[#f1c4c4] bg-[#fff4f4] text-[#9b1c1c]"},
};

const RequirementList: React.FC<{items: RequirementResult[]}> = ({items}) => (
    <ul className="mb-0 space-y-2 pl-0">
        {items.map((item) => {
            const status = STATUS[item.strength];
            return (
                <li key={item.id} className="flex list-none gap-2.5">
                    <span
                        className={`mt-0.5 inline-flex h-6 w-[76px] shrink-0 items-center justify-center gap-1 rounded-full border text-xs font-semibold ${status.className}`}
                    >
                        <span aria-hidden="true">{status.mark}</span>{status.label}
                    </span>
                    <div className="min-w-0 text-sm leading-6 text-[#161c22]">
                        {item.text}
                        {item.quotes.map((quote, index) => (
                            <p key={index} className="mb-0 text-xs leading-5 text-[#5f6370]">
                                {quote.where}: <q className="italic">{quote.quote}</q>
                            </p>
                        ))}
                    </div>
                </li>
            );
        })}
    </ul>
);

// How well the CV fits the job: the score computed from verified evidence, and each requirement with the CV quote behind it.
export const FitReport: React.FC<{report: TailoringReport}> = ({report}) => {
    const {fit} = report;
    const musts = report.requirements.filter((item) => item.priority === "must");
    const nices = report.requirements.filter((item) => item.priority === "nice");

    return (
        <div className="rounded-lg border border-[#d8e3f7] bg-white px-4 py-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">Fit report</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="mb-0 text-3xl font-semibold tabular-nums text-[#161c22]">
                    {fit.score}<span className="text-base font-medium text-[#76777d]">/100</span>
                </p>
                <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${RECOMMENDATION_STYLE[fit.recommendation]}`}>
                    {fit.recommendation}
                </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#eef1f6]" aria-hidden="true">
                <div className={`h-full rounded-full ${BAR_COLOUR[fit.recommendation]}`} style={{width: `${fit.score}%`}}/>
            </div>
            <p className="mb-0 mt-2 text-sm leading-6 text-[#161c22]">{fit.reason}</p>
            <p className="mb-0 mt-1 text-xs leading-5 text-[#5f6370]">
                Read as a {report.seniority}-level role.
                {report.themes.length > 0 && ` What they care about most: ${report.themes.map((theme) => theme.name).join(", ")}.`}
            </p>

            {musts.length > 0 && (
                <section className="mt-3">
                    <h4 className="mb-2 text-sm font-semibold text-[#161c22]">Must-haves</h4>
                    <RequirementList items={musts}/>
                </section>
            )}
            {nices.length > 0 && (
                <details className="mt-3">
                    <summary className="cursor-pointer select-none text-sm font-semibold text-[#161c22]">Nice-to-haves ({nices.length})</summary>
                    <div className="mt-2"><RequirementList items={nices}/></div>
                </details>
            )}
            {report.unverifiedQuotes > 0 && (
                <p className="mb-0 mt-3 text-xs leading-5 text-[#76777d]">
                    {report.unverifiedQuotes} piece{report.unverifiedQuotes === 1 ? "" : "s"} of evidence the AI quoted
                    {report.unverifiedQuotes === 1 ? " wasn't" : " weren't"} in your CV word for word, so {report.unverifiedQuotes === 1 ? "it was" : "they were"} ignored.
                </p>
            )}
        </div>
    );
};
