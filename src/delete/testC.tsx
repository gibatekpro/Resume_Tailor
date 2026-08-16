import React, {CSSProperties, useEffect, useState} from "react";

interface PersonType {
    id: number,
    name: string,
    email: string,
    image: string,
}

type PracticeProperties = {
    textColor?: string;
    slideTextColor?: string;
    borderColor?: string;
    firstOverlayBackgroundColor?: string;
    secondOverlayBackgroundColor?: string;
    fontSize?: string;
    padding?: string;
};
export const Example: React.FC<PracticeProperties> = ({
                                                          textColor = "#351345",
                                                          slideTextColor = "white",
                                                          borderColor = "#351345",
                                                          firstOverlayBackgroundColor = "orange",
                                                          secondOverlayBackgroundColor = "green",
                                                          fontSize = "45px",
                                                          padding = "40px 80px",
                                                      }) => {
    const [hover, setHover] = useState(false);
    const myStyles: {
        containerStyle: CSSProperties;
        buttonStyle: CSSProperties;
        firstOverlay: CSSProperties;
        secondOverlay: CSSProperties;
    } = {
        containerStyle: {
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            perspective: "1000px"
        },
        buttonStyle: {
            textDecoration: "none",
            fontFamily: "sans-serif",
            border: "2px solid gray",
            color: textColor,
            padding: padding,
            position: "relative",
            fontSize: fontSize,
            transition: "all",
        },
        firstOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            background: firstOverlayBackgroundColor,
            height: "100%",
            width: "100%",
            color: slideTextColor,
            transformOrigin: "top",
            transition: "all 2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: hover ? "rotateX(0)" : "rotateX(270deg)",
            transitionDelay: hover ? '0.1s' : '0.4s',
            zIndex: hover ? 1 : -1,
            opacity: hover ? 1 : 0,
        },
        secondOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            background: secondOverlayBackgroundColor,
            height: "100%",
            width: "100%",
            color: slideTextColor,
            transformOrigin: "top",
            transition: "all 2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: hover ? "rotateX(0)" : "rotateX(270deg)",
            transitionDelay: hover ? '0.4s' : '0.1s',
            zIndex: hover ? 1 : -1,
            opacity: hover ? 1 : 0,
        },
    };

    return (
        <div style={myStyles.containerStyle}>
            <button
                className="no-underline font-sans border-2 border-gray-500 text-[#351345] px-[80px] py-[40px] relative text-[45px] transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <span
                    className={
                        `transform-gpu
                         absolute 
                         top-0 
                         left-0 
                         w-full 
                         h-full 
                         bg-orange-500
                         text-white 
                         flex
                         items-center 
                         justify-center
                         origin-top
                         transition-all 
                         duration-[2000ms] 
                         ease`}>
                Hover Me
                </span>
                {/*<span style={myStyles.secondOverlay}>Hover Me</span>*/}
                Hover Me
            </button>
        </div>
        // <div className={"container"}>
        //     <button>
        //         Hover Me
        //     </button>
        // </div>
    );
}
// ${hover ? "opacity-1" : "opacity-0"}
// ${hover ? "z-1" : "-z-1"}
// ${hover ? "rotate-x-90" : "rotate-x-270"}
// ${hover ? "delay-[100ms]" : "delay-[400ms]"}