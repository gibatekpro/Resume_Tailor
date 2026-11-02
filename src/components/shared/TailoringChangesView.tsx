import React from "react";
import type {TailoringChanges} from "../../models/TailoringChanges";

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((item, index) => item === b[index]);

const BeforeAfter: React.FC<{before: string[], after: string[], asText?: boolean}> = ({before, after, asText}) => {
    const renderItems = (items: string[], className: string) => asText ? (
        <p className={`mb-0 text-sm leading-6 ${className}`}>{items.join(" ") || "(none)"}</p>
    ) : (
        <ul className={`mb-0 list-disc space-y-1 pl-5 text-sm leading-6 ${className}`}>
            {items.length > 0 ? items.map((item, index) => <li key={index}>{item}</li>) : <li>(none)</li>}
        </ul>
    );

    return (
        <div className="grid gap-3 md:grid-cols-2">
            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777d]">Your original</p>
                {renderItems(before, "text-[#5f6370]")}
            </div>
            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#225b34]">Tailored</p>
                {renderItems(after, "text-[#161c22]")}
            </div>
        </div>
    );
};

const EntryChanges: React.FC<{entries: TailoringChanges["roles"], defaultOpenFirst?: boolean}> = ({entries, defaultOpenFirst}) => (
    <div className="space-y-2">
        {entries.map((entry, index) => {
            const unchanged = sameList(entry.before, entry.after);
            return (
                <details key={`${entry.title}-${index}`} open={defaultOpenFirst && index === 0} className="rounded-lg border border-[#e3e8f2] bg-white">
                    <summary className="flex cursor-pointer select-none items-center justify-between gap-3 px-3 py-2 text-sm font-semibold text-[#161c22]">
                        <span className="min-w-0 truncate">{entry.title}</span>
                        <span className={`shrink-0 text-xs font-medium ${unchanged ? "text-[#76777d]" : "text-[#1f4f9c]"}`}>
                            {unchanged ? "Unchanged" : `${entry.after.length} ${entry.after.length === 1 ? "bullet" : "bullets"}, rewritten`}
                        </span>
                    </summary>
                    {!unchanged && (
                        <div className="border-t border-[#eef1f6] px-3 py-3">
                            <BeforeAfter before={entry.before} after={entry.after}/>
                        </div>
                    )}
                </details>
            );
        })}
    </div>
);

// Shows what one generation changed: verified new skills with their evidence, the summary, and bullets before and after.
export const TailoringChangesView: React.FC<{changes: TailoringChanges}> = ({changes}) => (
    <div className="rounded-lg border border-[#d8e3f7] bg-[#f8fbff] px-4 py-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">What changed</p>

        <div className="space-y-4">
            {changes.buzzwords && changes.buzzwords.length > 0 && (
                <div role="alert" className="rounded-lg border border-[#f1d8a8] bg-[#fff8ec] px-3 py-2 text-sm leading-6 text-[#5c4300]">
                    <span className="font-semibold">Buzzwords still in your CV: </span>
                    {changes.buzzwords.map((item) => `"${item.word}" (${item.where})`).join(", ")}.
                    <span className="block text-xs text-[#5f6370]">Edit them out below before you send it, or generate again.</span>
                </div>
            )}

            <section>
                <h4 className="mb-1 text-sm font-semibold text-[#161c22]">Skills added</h4>
                {changes.addedSkills.length > 0 ? (
                    <ul className="mb-0 space-y-2 pl-0">
                        {changes.addedSkills.map((added) => (
                            <li key={added.skill} className="list-none">
                                <span className="inline-block rounded-full border border-[#b7e1c2] bg-[#edf9f1] px-2.5 py-0.5 text-xs font-semibold text-[#225b34]">
                                    + {added.skill}
                                </span>
                                {added.evidence && (
                                    <p className="mb-0 mt-1 text-xs leading-5 text-[#5f6370]">
                                        From your CV: <q className="italic">{added.evidence}</q>
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mb-0 text-sm text-[#5f6370]">None. Your skills were only reordered for this job.</p>
                )}
                {changes.rejectedSkills.length > 0 && (
                    <p className="mb-0 mt-2 text-xs leading-5 text-[#76777d]">
                        Suggested but not added, because nothing in your CV backs them up: {changes.rejectedSkills.join(", ")}.
                    </p>
                )}
            </section>

            {changes.summary && (
                <section>
                    <h4 className="mb-1 text-sm font-semibold text-[#161c22]">Summary</h4>
                    <BeforeAfter before={[changes.summary.before]} after={[changes.summary.after]} asText={true}/>
                </section>
            )}

            {changes.roles.length > 0 && (
                <section>
                    <h4 className="mb-1 text-sm font-semibold text-[#161c22]">Work experience</h4>
                    <EntryChanges entries={changes.roles} defaultOpenFirst={true}/>
                </section>
            )}

            {changes.projects.length > 0 && (
                <section>
                    <h4 className="mb-1 text-sm font-semibold text-[#161c22]">Projects</h4>
                    <EntryChanges entries={changes.projects}/>
                </section>
            )}
        </div>
    </div>
);
