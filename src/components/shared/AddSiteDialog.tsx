import React, {useState} from "react";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {v4 as uuidv4} from "uuid";
import type {SavedSite, SiteGroupKey} from "../../models/SavedSite";

// "indeed.co.uk/jobs" -> "https://indeed.co.uk/jobs"; returns undefined if it isn't a usable web address.
const normaliseUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }
    try {
        const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
        return url.hostname.includes(".") ? url.toString() : undefined;
    } catch {
        return undefined;
    }
};

const nameFromUrl = (url: string) => {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host.charAt(0).toUpperCase() + host.slice(1);
};

const inputClassName =
    "mt-1 block w-full rounded-lg border border-[#c6c6cd] bg-[#f6f9ff] px-3 py-2 text-sm text-[#161c22] placeholder:text-[#76777d] focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#d8e2ff]";

// Mount it only while open, so every opening starts with an empty form.
export const AddSiteDialog: React.FC<{
    open: boolean,
    initialGroup: SiteGroupKey,
    onClose: () => void,
    onAdd: (site: SavedSite) => void,
}> = ({open, initialGroup, onClose, onAdd}) => {
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [group, setGroup] = useState<SiteGroupKey>(initialGroup);
    const [urlError, setUrlError] = useState(false);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const normalisedUrl = normaliseUrl(url);
        if (!normalisedUrl) {
            setUrlError(true);
            return;
        }
        onAdd({
            id: uuidv4(),
            url: normalisedUrl,
            name: name.trim() || nameFromUrl(normalisedUrl),
            description: description.trim(),
            group,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-[#131b2e]/40" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-2xl border border-[#c6c6cd] bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
                    <DialogTitle className="m-0 text-lg font-semibold text-[#161c22]">Add a site</DialogTitle>
                    <p className="mt-1 mb-4 text-sm text-[#45464d]">It'll appear on your home page for quick access.</p>

                    <form onSubmit={submit} className="space-y-3">
                        <div>
                            <label htmlFor="site-url" className="text-sm font-medium text-[#161c22]">Web address</label>
                            <input
                                id="site-url"
                                autoFocus
                                value={url}
                                onChange={(event) => {
                                    setUrl(event.target.value);
                                    setUrlError(false);
                                }}
                                placeholder="e.g. totaljobs.com"
                                className={inputClassName}
                            />
                            {urlError && <span className="text-sm text-[#ba1a1a]">Enter a web address such as totaljobs.com</span>}
                        </div>
                        <div>
                            <label htmlFor="site-name" className="text-sm font-medium text-[#161c22]">
                                Name <span className="text-[#76777d]">(optional)</span>
                            </label>
                            <input
                                id="site-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Defaults to the site's address"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label htmlFor="site-description" className="text-sm font-medium text-[#161c22]">
                                Note <span className="text-[#76777d]">(optional)</span>
                            </label>
                            <input
                                id="site-description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="e.g. UK tech roles, saved search"
                                className={inputClassName}
                            />
                        </div>
                        <fieldset>
                            <legend className="text-sm font-medium text-[#161c22]">Show under</legend>
                            <div className="mt-1 flex gap-2">
                                {([["job", "Job sites"], ["freelance", "Freelance sites"]] as const).map(([key, label]) => (
                                    <label
                                        key={key}
                                        className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium transition-all ${
                                            group === key
                                                ? "border-[#2170e4] bg-[#eef4fc] text-[#1f4f9c]"
                                                : "border-[#dfe4ee] bg-white text-[#45464d] hover:border-[#bfd5ff]"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="site-group"
                                            value={key}
                                            checked={group === key}
                                            onChange={() => setGroup(key)}
                                            className="sr-only"
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer rounded-lg border border-[#d6dcec] bg-white px-4 py-2 text-sm font-semibold text-[#4a4e57] transition-all hover:border-[#bacaf0]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="cursor-pointer rounded-lg border border-[#2170e4] bg-[#2170e4] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#195fc0]"
                            >
                                Add site
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
};
