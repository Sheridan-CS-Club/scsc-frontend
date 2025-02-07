import styles from "@css/components/terminal.module.css";
import React, { useEffect, useState, useRef } from "react";

const Terminal = () => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentCommand, setCurrentCommand] = useState("");
    const [commandHistory, setCommandHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        setCurrentCommand(e.target.value);
    };

    const handleCommandExecute = () => {
        if (currentCommand.trim() !== "") {
            setCommandHistory((prevHistory) => [
                ...prevHistory,
                `$ ${currentCommand}`, 
                executeCommand(currentCommand),
            ]);
            setCurrentCommand("");
        }
    };

    const executeCommand = (command) => {
        const parts = command.split(" ");
        const cmd = parts[0];
        const args = parts.slice(1).join(" ");

        switch (cmd) {
            case "echo":
                return args;
            case "date":
                return new Date().toLocaleDateString();
            case "time":
                return new Date().toLocaleTimeString();
            case "clear":
                setCommandHistory([]);
                return "";
            default:
                return `Command '${cmd}' not found.`;
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (commandHistory.length > 0) {
            let textToDisplay = commandHistory.join("\n");
            let index = 0;
            setIsTyping(true);
            const interval = setInterval(() => {
                if (index <= textToDisplay.length) {
                    setDisplayedText(textToDisplay.slice(0, index));
                    index++;
                } else {
                    clearInterval(interval);
                    setIsTyping(false);
                }
            }, 10);
            return () => clearInterval(interval);
        } else {
            setDisplayedText("");
        }
    }, [commandHistory]);

    return (
        <div id={styles.terminal}>
            <div className={styles.terminalWindow}>
                <div className={styles.terminalHeader}>
                    <div className={styles.terminalButtons}>
                        <span className={styles.redButton}></span>
                        <span className={styles.yellowButton}></span>
                        <span className={styles.greenButton}></span>
                    </div>
                    <div className={styles.terminalTitle}>Fake SCSC Terminal</div>
                </div>
                <div className={styles.terminalBody}>
                    <pre>{displayedText}</pre>
                    {!isTyping && (
                        <div className={styles.terminalInputLine}>
                            $ <input
                                type="text"
                                value={currentCommand}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCommandExecute();
                                    }
                                }}
                                ref={inputRef}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Terminal;