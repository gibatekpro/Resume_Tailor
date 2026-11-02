import type {AppSettings} from "../models/AppSettings";

export const DefaultSettings: AppSettings = {
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini"],
    defaultModel: "gpt-4o",
};
