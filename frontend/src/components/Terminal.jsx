import styles from "@css/components/terminal.module.css";
import React, { useEffect, useState, useRef } from "react";

const Terminal = () => {
    const [currentCommand, setCurrentCommand] = useState("");
    const [commandHistory, setCommandHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        setCurrentCommand(e.target.value);
    };

    const handleCommandExecute = () => {
        if (currentCommand.trim() === "") return;

        const userInput = `$ ${currentCommand}`;
        const commandOutput = executeCommand(currentCommand) ?? ""; 

        setCommandHistory((prevHistory) => [...prevHistory, userInput]);
        setCurrentCommand("");

        if (commandOutput) {
            animateLatestCommand(commandOutput);
        }
    };

    const executeCommand = (command) => {
        const parts = command.split(" ");
        const cmd = parts[0];
        const args = parts.slice(1).join(" ");

        switch (cmd) {
            case "help":
                return `
Available commands:
    echo [text]   - Prints the text to the terminal.
    quit          - Closes the terminal.
    date          - Displays the current date.
    time          - Displays the current time.
    clear         - Clears the terminal screen.
    help          - Displays this help message.
    `;
            case "echo":
                return args || "";
            case "quit":
                return "Terminal will close now, ong ong (press escape).";
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

    const animateLatestCommand = (text) => {
        let index = 0;
        setIsTyping(true);

        setCommandHistory((prevHistory) => [...prevHistory, ""]);

        const interval = setInterval(() => {
            setCommandHistory((prevHistory) => {
                const updatedHistory = [...prevHistory];
                updatedHistory[updatedHistory.length - 1] = text.slice(0, index + 1);
                return updatedHistory;
            });

            index++;
            if (index >= text.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 10);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [isTyping]);

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
                    <pre>{commandHistory.join("\n")}</pre>
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
