import { useState, useEffect, useRef } from "react";
import { createSwapy } from "swapy";
import styles from "@css/minileets.module.css";
import zen from "@assets/icons/minileets/zen.svg";
import hint from "@assets/icons/minileets/hint.svg";
import share from "@assets/icons/minileets/share.svg";
import next_arrow from "@assets/icons/minileets/next_arrow.svg";
import minileets from "@data/mockMinileets.json";
import { toast } from "sonner";

const pythonControlFlow = [
    "if", "else", "elif", "for", "while", "return", "break", "continue", "pass"
];

const pythonKeywords = [
    "def", "import", "from", "as", "with", "class", "try", "except", "finally",
    "in", "not", "and", "or", "is"
];

const pythonConstants = [
    "None", "True", "False", "self", "cls", "super", 
];

const pythonVariables = [
    "temp", "node", "result", "res", "answer", "root", "head", "tail", "curr", "current", 
    "i", "j", "k", "n", "m", "x", "y", "z", "a", "b", "c", "d", "e", "f", "g", "h", "s", "t", "u", "v", "w", "l", "r",
];

const getSyntaxColor = (token) => {
    // orange brackets
    if (["{", "}", "[", "]", "(", ")"].includes(token))
        return "#FFD710";

    // purple control flow keywords
    if (pythonControlFlow.includes(token))
        return "#C586C0";

    // blue keywords
    if (pythonKeywords.includes(token))
        return "#569CD6";

    // sky blue constants
    if (pythonConstants.includes(token))
        return "#4FC1FF";

    // light blue variables
    if (pythonVariables.includes(token))
        return "#9CDCFE";

    // orange strings
    if (/^['"].*['"]$/.test(token)) {
        return "#d69d85"; 
    }

    // green numbers
    if (/^[0-9]+(\.[0-9]+)?$/.test(token)) {
        return "#b5cea8";
    }

    return "#F5F5F5";
};

const highlightCodeLine = (line) => {
    const tokens = line.split(/([{}()\[\]\s:.,;])/).filter(Boolean);
    return tokens.map((token, index) => (
        <span key={index} style={{ color: getSyntaxColor(token) }}>
            {token}
        </span>
    ));
};

const Minileets = () => {
    const [currentProblem, setCurrentProblem] = useState(0);
    const [codeLines, setCodeLines] = useState([]);
    const [hintIndex, setHintIndex] = useState(0);
    const containerRef = useRef(null);
    const swapyInstance = useRef(null);

    // update code lines
    useEffect(() => {
        const lines = minileets[currentProblem].code.split("\n");
        setCodeLines(lines);
        setHintIndex(0); // Reset hint index on problem change
    }, [currentProblem]);

    // init swapy
    useEffect(() => {
        if (containerRef.current) {
            swapyInstance.current?.destroy();
            swapyInstance.current = createSwapy(containerRef.current);
            swapyInstance.current.onSwap((event) => {
                console.log("swap", event);
            });
        }
        return () => {
            swapyInstance.current?.destroy();
        };
    }, [codeLines]);

    const handleHint = () => {
        const hints = minileets[currentProblem]?.hint || [];
        if (hints.length === 0) return;
        if (hintIndex < hints.length) {
            toast.info(hintIndex + 1 + ". " + hints[hintIndex]);
            setHintIndex((prev) => prev + 1);
        } else {
            toast.info("All hints:\n" + hints.join("\n + "));
        }
    };

    return (
        <section id={styles.minileets_section}>
            <div id={styles.minileets_container}>
                <div id={styles.puzzle_container}>
                    <div id={styles.header}>
                        <h1>minileets</h1>
                        <div id={styles.controls}>
                            <button id={styles.prev} onClick={() => setCurrentProblem((prev) => Math.max(0, prev - 1))}>
                                <img src={next_arrow} alt="Previous" />
                            </button>
                            <button id={styles.zen} onClick={() => {}}>
                                <img src={zen} alt="Zen mode" />
                            </button>
                            <button id={styles.hint} onClick={handleHint}>
                                <img src={hint} alt="Hint" />
                            </button>
                            <button id={styles.share} onClick={() => {}}>
                                <img src={share} alt="Share" />
                            </button>
                            <button id={styles.next} onClick={() => setCurrentProblem((prev) => Math.min(minileets.length - 1, prev + 1))}>
                                <img src={next_arrow} alt="Next" />
                            </button>
                        </div>
                    </div>
                    <div ref={containerRef} id={styles.puzzle}>
                        {codeLines.map((line, index) => (
                            <pre key={index} data-swapy-slot={index} className={styles.code_line}>
                                <div data-swapy-item={index}>{highlightCodeLine(line)}</div>
                            </pre>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Minileets;
