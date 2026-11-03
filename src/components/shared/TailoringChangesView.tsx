import React from "react";
import type {TailoringChanges} from "../../models/TailoringChanges";
import type {ReportSection, TailoringChoices, TailoringReport, Violation} from "../../models/TailoringPipeline";
import {
    bulletKey, isChanged, movedFrom, NO_CHOICES, sectionKey, SUMMARY_KEY, toggle, unusedOriginals,
} from "../../utils/bulletChoices";

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
        <div className="grid gap-3 @lg:grid-cols-2">
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

// Before/after lists, for applications generated before the per-bullet report existed.
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

// Problems the checks still found after the repair, shown next to what they're about. Never hidden.
const Flags: React.FC<{violations: Violation[]}> = ({violations}) => violations.length === 0 ? null : (
    <ul className="mb-0 mt-1.5 space-y-1 pl-0">
        {violations.map((violation, index) => (
            <li key={index} className="list-none rounded-md border border-[#f1c4c4] bg-[#fff4f4] px-2 py-1 text-xs leading-5 text-[#6b1f1f]">
                <span className="font-semibold">⚠ {violation.check.replace(/-/g, " ")}:</span> {violation.message}
            </li>
        ))}
    </ul>
);

interface ChoiceProps {
    choices: TailoringChoices;
    onChoicesChange?: (choices: TailoringChoices) => void;
}

// Keep the AI's version or put the original back. Read-only when there's no handler (a saved application).
const KeepOrRevert: React.FC<ChoiceProps & {choiceKey: string, label: string}> = ({choices, onChoicesChange, choiceKey, label}) => {
    const reverted = choices.reverted.includes(choiceKey);
    if (!onChoicesChange) {
        return reverted ? <span className="text-xs font-semibold text-[#76777d]">Reverted to the original</span> : null;
    }
    const option = (active: boolean) =>
        `cursor-pointer px-2.5 py-1 text-xs font-semibold transition-colors ${active ? "bg-[#2170e4] text-white" : "bg-white text-[#45464d] hover:text-[#2170e4]"}`;
    return (
        <div role="group" aria-label={label} className="inline-flex shrink-0 overflow-hidden rounded-md border border-[#c6c6cd]">
            <button type="button" aria-pressed={!reverted} className={option(!reverted)}
                    onClick={() => reverted && onChoicesChange({...choices, reverted: toggle(choices.reverted, choiceKey)})}>
                Keep
            </button>
            <button type="button" aria-pressed={reverted} className={`${option(reverted)} border-l border-[#c6c6cd]`}
                    onClick={() => !reverted && onChoicesChange({...choices, reverted: toggle(choices.reverted, choiceKey)})}>
                Revert
            </button>
        </div>
    );
};

const SectionChanges: React.FC<ChoiceProps & {section: ReportSection, report: TailoringReport, defaultOpen: boolean}> = (
    {section, report, choices, onChoicesChange, defaultOpen},
) => {
    const violations = report.violations.filter((violation) => violation.where === section.title);
    const keptOut = report.keptOut.filter((item) => item.where === section.title);
    const unused = unusedOriginals(section);
    const changedCount = section.bullets.filter((bullet) => isChanged(section, bullet)).length;
    const originalOrder = choices.originalOrder.includes(sectionKey(section));
    const flagCount = violations.length;

    return (
        <details open={defaultOpen} className="rounded-lg border border-[#e3e8f2] bg-white">
            <summary className="flex cursor-pointer select-none items-center justify-between gap-3 px-3 py-2 text-sm font-semibold text-[#161c22]">
                <span className="min-w-0 truncate">{section.title}</span>
                <span className="shrink-0 text-xs font-medium">
                    {flagCount > 0 && <span className="mr-2 text-[#9b1c1c]">⚠ {flagCount}</span>}
                    <span className={changedCount > 0 ? "text-[#1f4f9c]" : "text-[#76777d]"}>
                        {changedCount > 0 ? `${changedCount} of ${section.bullets.length} changed` : "Unchanged"}
                    </span>
                </span>
            </summary>

            <div className="border-t border-[#eef1f6] px-3 py-3">
                {section.bullets.length > 1 && (
                    <label className="mb-2 flex cursor-pointer items-center gap-2 text-xs text-[#45464d]">
                        <input
                            type="checkbox"
                            className="h-3.5 w-3.5 accent-[#2170e4]"
                            checked={originalOrder}
                            disabled={!onChoicesChange}
                            onChange={() => onChoicesChange?.({...choices, originalOrder: toggle(choices.originalOrder, sectionKey(section))})}
                        />
                        Keep my original bullet order
                    </label>
                )}
                <Flags violations={violations.filter((violation) => violation.bullet === undefined)}/>

                <ol className="mb-0 mt-2 space-y-2 pl-0">
                    {section.bullets.map((bullet, index) => {
                        const changed = isChanged(section, bullet);
                        const reverted = choices.reverted.includes(bulletKey(section, index));
                        const moved = movedFrom(section, bullet, index);
                        const sources = bullet.from.map((from) => section.original[from]).filter((text) => text?.trim());
                        return (
                            <li key={index} className="@container list-none rounded-md border border-[#eef1f6] bg-[#fbfcff] px-3 py-2">
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 w-5 shrink-0 text-xs font-semibold tabular-nums text-[#76777d]">{index + 1}.</span>
                                    {/* Keep/Revert sits beside the text in a wide card and below it in a narrow one. */}
                                    <div className="flex min-w-0 flex-1 flex-col items-start gap-2 @md:flex-row @md:gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className={`mb-0 text-sm leading-6 ${reverted ? "text-[#76777d] line-through" : "text-[#161c22]"}`}>{bullet.text}</p>
                                        {changed && (
                                            <p className="mb-0 mt-1 text-xs leading-5 text-[#5f6370]">
                                                <span className="font-semibold">{sources.length === 0 ? "New, from elsewhere in your CV" : sources.length > 1 ? "Merged from:" : "Was:"}</span>
                                                {sources.map((text, sourceIndex) => <span key={sourceIndex} className="block">{text}</span>)}
                                            </p>
                                        )}
                                        {!changed && (
                                            <p className="mb-0 mt-1 text-xs text-[#76777d]">
                                                {moved !== undefined ? `Unchanged, moved from position ${moved + 1}` : "Unchanged"}
                                            </p>
                                        )}
                                        {bullet.why && <p className="mb-0 mt-1 text-xs leading-5 text-[#1f4f9c]">Why: {bullet.why}</p>}
                                        <Flags violations={violations.filter((violation) => violation.bullet === index)}/>
                                    </div>
                                    {changed && (
                                        <KeepOrRevert choices={choices} onChoicesChange={onChoicesChange}
                                                      choiceKey={bulletKey(section, index)} label={`Bullet ${index + 1}`}/>
                                    )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>

                {keptOut.length > 0 && (
                    <div className="mt-3 rounded-md border border-[#f1d8a8] bg-[#fff8ec] px-3 py-2 text-xs leading-5 text-[#5c4300]">
                        <span className="font-semibold">Facts that couldn't be kept:</span>
                        <ul className="mb-0 mt-1 list-disc pl-5">
                            {keptOut.map((item, index) => <li key={index}>{item.fact}, from “{item.text}” ({item.reason || "bullet limit"})</li>)}
                        </ul>
                    </div>
                )}
                {unused.length > 0 && (
                    <div className="mt-3 text-xs leading-5 text-[#5f6370]">
                        <span className="font-semibold">Not used from your original:</span>
                        <ul className="mb-0 mt-1 list-disc pl-5">
                            {unused.map((item) => <li key={item.index}>{item.text}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </details>
    );
};

// Shows what one generation changed: verified new skills with their evidence, the summary, and every bullet with
// what it was, why it changed and any checks it still fails. With a handler, each change can be kept or reverted.
export const TailoringChangesView: React.FC<{
    changes: TailoringChanges,
    report?: TailoringReport,
    choices?: TailoringChoices,
    onChoicesChange?: (choices: TailoringChoices) => void,
}> = ({changes, report, choices = NO_CHOICES, onChoicesChange}) => {
    const roles = report?.sections.filter((section) => section.kind === "role") || [];
    const projects = report?.sections.filter((section) => section.kind === "project") || [];
    const summaryFlags = report?.violations.filter((violation) => violation.where === "Summary") || [];

    return (
        <div className="@container rounded-lg border border-[#d8e3f7] bg-[#f8fbff] px-4 py-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">What changed</p>

            <div className="space-y-4">
                {report && report.violations.length > 0 && (
                    <div role="alert" className="rounded-lg border border-[#f1c4c4] bg-[#fff4f4] px-3 py-2 text-sm leading-6 text-[#6b1f1f]">
                        <span className="font-semibold">
                            {report.violations.length} check{report.violations.length === 1 ? "" : "s"} still
                            fail{report.violations.length === 1 ? "s" : ""}{report.repaired ? " after one automatic fix" : ""}.
                        </span>{" "}
                        They're marked with ⚠ below. Fix them in the form, revert the bullet, or generate again.
                    </div>
                )}
                {report && report.repaired && report.violations.length === 0 && (
                    <p className="mb-0 text-xs leading-5 text-[#5f6370]">
                        The first rewrite failed {report.firstPassViolations.length} automatic check{report.firstPassViolations.length === 1 ? "" : "s"}; they were fixed automatically.
                    </p>
                )}
                {!report && changes.buzzwords && changes.buzzwords.length > 0 && (
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
                        <div className="mb-1 flex items-center justify-between gap-3">
                            <h4 className="mb-0 text-sm font-semibold text-[#161c22]">Summary</h4>
                            {report && <KeepOrRevert choices={choices} onChoicesChange={onChoicesChange} choiceKey={SUMMARY_KEY} label="Summary"/>}
                        </div>
                        <BeforeAfter before={[changes.summary.before]} after={[changes.summary.after]} asText={true}/>
                        <Flags violations={summaryFlags}/>
                    </section>
                )}

                {report ? (
                    <>
                        {roles.length > 0 && (
                            <section>
                                <h4 className="mb-1 text-sm font-semibold text-[#161c22]">Work experience</h4>
                                <div className="space-y-2">
                                    {roles.map((section, index) => (
                                        <SectionChanges key={sectionKey(section)} section={section} report={report} choices={choices}
                                                        onChoicesChange={onChoicesChange} defaultOpen={index === 0}/>
                                    ))}
                                </div>
                            </section>
                        )}
                        {projects.length > 0 && (
                            <section>
                                <h4 className="mb-1 text-sm font-semibold text-[#161c22]">Projects</h4>
                                <div className="space-y-2">
                                    {projects.map((section) => (
                                        <SectionChanges key={sectionKey(section)} section={section} report={report} choices={choices}
                                                        onChoicesChange={onChoicesChange} defaultOpen={false}/>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};
