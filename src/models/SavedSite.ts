
export type SiteGroupKey = "job" | "freelance";

// A link the user added to the home page themselves.
export interface SavedSite {
    id: string;
    name: string;
    url: string;
    description?: string;
    group: SiteGroupKey;
}
