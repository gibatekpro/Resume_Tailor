import React from "react";
import {Link} from "react-router-dom";
import type {CvImprovement} from "../../models/TailoringChanges";
import ROUTES from "../../utils/Routes";

// What the AI couldn't fix because only the candidate knows the facts, with what to add to their saved CV.
export const ImprovementsPanel: React.FC<{improvements: CvImprovement[]}> = ({improvements}) => (
    <div className="rounded-lg border border-[#d9d2fb] bg-[#f7f5ff] px-4 py-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="mb-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5b3fc4]">Make your CV stronger</p>
            <Link to={ROUTES.NEW_CV_PAGE} className="text-xs font-semibold text-[#5b3fc4] no-underline hover:underline">
                Edit your CV
            </Link>
        </div>
        <p className="mt-1 mb-2 text-xs leading-5 text-[#5f6370]">
            The AI can't add facts it doesn't have. Add these to your saved CV once, and every tailored CV after that gets better.
        </p>
        <ol className="mb-0 space-y-2 pl-5 text-sm leading-6 text-[#161c22]">
            {improvements.map((item, index) => (
                <li key={index}>
                    {item.section && <span className="font-semibold">{item.section}: </span>}
                    {item.issue}
                    <span className="block text-[#45464d]">{item.suggestion}</span>
                </li>
            ))}
        </ol>
    </div>
);
