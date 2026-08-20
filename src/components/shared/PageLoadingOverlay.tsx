import React from "react";

type PageLoadingOverlayProps = {
    visible: boolean;
    message?: string;
    withinParent?: boolean;
};

const spinnerRingStyle: React.CSSProperties = {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: "4px solid rgba(33, 112, 228, 0.2)",
    borderTopColor: "#2170e4",
    animation: "page-loading-spin 900ms linear infinite",
};

const pulseDotStyle = (delayMs: number): React.CSSProperties => ({
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    backgroundColor: "#2170e4",
    opacity: 0.35,
    animation: `page-loading-pulse 1.2s ease-in-out ${delayMs}ms infinite`,
});

const injectAnimationStyles = () => {
    if (typeof document === "undefined") {
        return;
    }

    const existing = document.getElementById("page-loading-overlay-animations");
    if (existing) {
        return;
    }

    const style = document.createElement("style");
    style.id = "page-loading-overlay-animations";
    style.innerHTML = `
        @keyframes page-loading-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes page-loading-pulse {
            0%, 100% { opacity: 0.2; transform: translateY(0px); }
            50% { opacity: 1; transform: translateY(-3px); }
        }
    `;

    document.head.appendChild(style);
};

export const PageLoadingOverlay: React.FC<PageLoadingOverlayProps> = ({
    visible,
    message = "Loading your page...",
    withinParent = false,
}) => {
    injectAnimationStyles();

    if (!visible) {
        return null;
    }

    return (
        <div
            style={{
                position: withinParent ? "absolute" : "fixed",
                inset: 0,
                background: "linear-gradient(160deg, rgba(244, 248, 255, 0.92), rgba(255, 255, 255, 0.92))",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: withinParent ? 80 : 2100,
            }}
            role="status"
            aria-live="polite"
            aria-label={message}
        >
            <div
                style={{
                    minWidth: "260px",
                    maxWidth: "86vw",
                    borderRadius: "18px",
                    border: "1px solid #d7e4ff",
                    backgroundColor: "#ffffff",
                    padding: "24px 26px",
                    boxShadow: "0px 22px 44px rgba(33, 112, 228, 0.14)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "center",
                }}
            >
                <div style={spinnerRingStyle} aria-hidden="true" />

                <div
                    style={{
                        marginTop: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                    }}
                    aria-hidden="true"
                >
                    <span style={pulseDotStyle(0)} />
                    <span style={pulseDotStyle(120)} />
                    <span style={pulseDotStyle(240)} />
                </div>

                <div>
                    <h3
                        style={{
                            margin: "0 0 4px",
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            color: "#161c22",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Please wait
                    </h3>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "0.92rem",
                            color: "#4b5563",
                            lineHeight: 1.5,
                        }}
                    >
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PageLoadingOverlay;
