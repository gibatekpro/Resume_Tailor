import React, {useEffect, useState} from "react";
import AppLayout from "../components/shared/AppLayout";
import TopNav from "../components/shared/TopNav";
import PageLoadingOverlay from "../components/shared/PageLoadingOverlay";
import SettingsService from "../service/SettingsService";
import {fetchAvailableModels} from "../service/TailorService";
import type {AppSettings} from "../models/AppSettings";
import {DefaultSettings} from "../data/defaultSettings";

export const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<AppSettings>(SettingsService.getCachedSettings());
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [status, setStatus] = useState<{type: "success" | "error", message: string}>();
    const [newModel, setNewModel] = useState("");
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isFetchingModels, setIsFetchingModels] = useState(false);
    const [modelsError, setModelsError] = useState<string>();

    useEffect(() => {
        const loadSettings = async () => {
            setIsLoading(true);
            try {
                setSettings(await SettingsService.getSettings());
            } finally {
                setIsLoading(false);
            }
        };
        void loadSettings();
    }, []);

    const updateSettings = (next: AppSettings) => {
        setSettings(next);
        setIsDirty(true);
        setStatus(undefined);
    };

    const addModel = (model: string) => {
        const id = model.trim();
        if (!id || settings.models.includes(id)) {
            setNewModel("");
            return;
        }
        updateSettings({...settings, models: [...settings.models, id]});
        setNewModel("");
    };

    const removeModel = (model: string) => {
        const models = settings.models.filter((item) => item !== model);
        updateSettings({
            models,
            defaultModel: settings.defaultModel === model ? models[0] : settings.defaultModel,
        });
    };

    const loadAvailableModels = async () => {
        setIsFetchingModels(true);
        setModelsError(undefined);
        try {
            setAvailableModels(await fetchAvailableModels());
        } catch (error) {
            setModelsError(error instanceof Error ? error.message : "Couldn't load models from OpenAI.");
        } finally {
            setIsFetchingModels(false);
        }
    };

    const save = async () => {
        setIsSaving(true);
        try {
            setSettings(await SettingsService.saveSettings(settings));
            setIsDirty(false);
            setStatus({type: "success", message: "Settings saved."});
        } catch (error) {
            const code = ((error as Error).cause as {code?: string} | undefined)?.code;
            setStatus({
                type: "error",
                message: `Saved on this device, but couldn't save to your account${code ? ` (${code})` : ""}. Try again.`,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const suggestions = availableModels.filter((model) => !settings.models.includes(model));

    return (
        <AppLayout>
            <TopNav title="Settings" />
            <main className="relative flex-1 bg-[#f6f9ff] px-3 py-5 md:px-6 md:py-6 lg:px-8">
                <PageLoadingOverlay visible={isLoading} withinParent={true} message="Loading your settings..." />

                <div className="mx-auto max-w-3xl">
                    <section className="overflow-hidden rounded-lg border border-[#c6c6cd] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
                        <div className="border-b border-[#eaeaf0] bg-gradient-to-r from-[#eef4ff] via-[#f8fbff] to-white px-5 py-4 md:px-6">
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">AI models</p>
                            <h2 className="mt-2 text-xl font-semibold text-[#161c22]">Models for CV generation</h2>
                            <p className="mt-1 mb-0 text-sm leading-6 text-[#45464d]">
                                These are the models you can pick from on the job brief step. The default is selected for you each time.
                            </p>
                        </div>

                        <div className="p-5 md:p-6">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#76777d]">Your models</p>
                            <ul className="mb-0 divide-y divide-[#eaeaf0] rounded-lg border border-[#dfe4ee] pl-0">
                                {settings.models.map((model) => (
                                    <li key={model} className="flex items-center gap-3 px-3 py-2.5">
                                        <input
                                            type="radio"
                                            id={`default-${model}`}
                                            name="defaultModel"
                                            className="h-4 w-4 cursor-pointer accent-[#2170e4]"
                                            checked={settings.defaultModel === model}
                                            onChange={() => updateSettings({...settings, defaultModel: model})}
                                        />
                                        <label htmlFor={`default-${model}`} className="flex-1 cursor-pointer font-mono text-sm text-[#161c22]">
                                            {model}
                                        </label>
                                        {settings.defaultModel === model && (
                                            <span className="rounded-full bg-[#eef4fc] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f4f9c]">
                                                Default
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeModel(model)}
                                            disabled={settings.models.length === 1}
                                            className="cursor-pointer rounded-md p-1 text-[#76777d] transition-colors hover:bg-[#fff1f1] hover:text-[#ba1a1a] disabled:cursor-not-allowed disabled:opacity-40"
                                            aria-label={`Remove ${model}`}
                                            title={settings.models.length === 1 ? "You need at least one model" : `Remove ${model}`}
                                        >
                                            <span className="material-symbols-outlined" style={{fontSize: 18}}>delete</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <form
                                className="mt-4 flex flex-col gap-2 sm:flex-row"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    addModel(newModel);
                                }}
                            >
                                <input
                                    list="available-models"
                                    value={newModel}
                                    onChange={(event) => setNewModel(event.target.value)}
                                    placeholder="Add a model id, e.g. gpt-4.1"
                                    className="flex-1 border border-[#c6c6cd] bg-[#f6f9ff] px-3 py-2 font-mono text-sm text-[#161c22] placeholder:font-sans placeholder:text-[#76777d] focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#d8e2ff]"
                                />
                                <datalist id="available-models">
                                    {suggestions.map((model) => <option key={model} value={model} />)}
                                </datalist>
                                <button
                                    type="submit"
                                    disabled={!newModel.trim()}
                                    className="cursor-pointer rounded-lg border border-[#2170e4] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#2170e4] transition-all hover:bg-[#eef4fc] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Add model
                                </button>
                            </form>

                            <div className="mt-4 rounded-lg border border-[#dfe4ee] bg-[#f9fbff] px-4 py-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="mb-0 text-sm text-[#45464d]">
                                        {availableModels.length > 0
                                            ? `${availableModels.length} chat models available to your OpenAI key.`
                                            : "See which models your OpenAI key can use."}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => void loadAvailableModels()}
                                        disabled={isFetchingModels}
                                        className="cursor-pointer rounded-lg border border-[#d6dcec] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#4a4e57] transition-all hover:border-[#bacaf0] disabled:opacity-60"
                                    >
                                        {isFetchingModels ? "Loading..." : availableModels.length > 0 ? "Refresh" : "Load models"}
                                    </button>
                                </div>
                                {modelsError && <p className="mt-2 mb-0 text-sm text-[#ba1a1a]">{modelsError}</p>}
                                {suggestions.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {suggestions.map((model) => (
                                            <button
                                                key={model}
                                                type="button"
                                                onClick={() => addModel(model)}
                                                className="cursor-pointer rounded-full border border-[#d8e3f7] bg-white px-2.5 py-1 font-mono text-xs text-[#1f4f9c] transition-all hover:border-[#2170e4] hover:bg-[#eef4fc]"
                                                title={`Add ${model}`}
                                            >
                                                + {model}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eaeaf0] bg-[#f8fbff] px-5 py-3 md:px-6">
                            <button
                                type="button"
                                onClick={() => updateSettings(DefaultSettings)}
                                className="cursor-pointer text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6370] underline-offset-2 hover:underline"
                            >
                                Reset to defaults
                            </button>
                            <div className="flex items-center gap-3">
                                {status && (
                                    <span role="status" className={`text-sm ${status.type === "success" ? "text-[#225b34]" : "text-[#ba1a1a]"}`}>
                                        {status.message}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => void save()}
                                    disabled={!isDirty || isSaving}
                                    className="cursor-pointer rounded-lg border border-[#2170e4] bg-[#2170e4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-all hover:bg-[#195fc0] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </AppLayout>
    );
};
