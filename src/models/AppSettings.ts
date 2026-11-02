
export interface AppSettings {
    models: string[];       // model ids offered when generating a CV
    defaultModel: string;   // pre-selected model; always one of `models`
}
