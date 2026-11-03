import React from "react";
import {Link} from "react-router-dom";
import type {Gaps} from "../../models/TailoringPipeline";
import ROUTES from "../../utils/Routes";

// Requirements the CV shows nothing for: things the candidate may simply not have written down, and real gaps.
export const GapsPanel: React.FC<{gaps: Gaps}> = ({gaps}) => (
    <div className="rounded-lg border border-[#f1d8a8] bg-[#fff8ec] px-4 py-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a5a00]">Gaps</p>

        {gaps.ask.length > 0 && (
            <section>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="mb-0 text-sm font-semibold text-[#161c22]">Not in your CV — add it if you have it</h4>
                    <Link to={ROUTES.NEW_CV_PAGE} className="text-xs font-semibold text-[#8a5a00] no-underline hover:underline">
                        Edit your CV
                    </Link>
                </div>
                <p className="mb-1 mt-1 text-xs leading-5 text-[#5f6370]">
                    Nothing was added for these. If the answer is yes, add it to your CV and generate again.
                </p>
                <ul className="mb-0 list-disc space-y-1 pl-5 text-sm leading-6 text-[#161c22]">
                    {gaps.ask.map((question) => <li key={question}>{question}</li>)}
                </ul>
            </section>
        )}

        {gaps.real.length > 0 && (
            <section className={gaps.ask.length > 0 ? "mt-3" : ""}>
                <h4 className="mb-0 text-sm font-semibold text-[#161c22]">Real gaps — address in a cover letter</h4>
                <ul className="mb-0 mt-1 list-disc space-y-1 pl-5 text-sm leading-6 text-[#161c22]">
                    {gaps.real.map((gap) => <li key={gap}>{gap}</li>)}
                </ul>
            </section>
        )}
    </div>
);
