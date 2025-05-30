import styles from "@css/components/terminal.module.css";
import React, { useEffect, useState, useRef } from "react";
import * as cmds from "./terminal_cmds";

const Terminal = () => {
    const [currentCommand, setCurrentCommand] = useState("");
    const [commandHistory, setCommandHistory] = useState([]);
    const [displayedHistory, setDisplayedHistory] = useState([])
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);

    // "cmd": [cmd_function, arg_count]
    const commands = {
        "help": [cmds.cmd_help, 0],
        "echo": [cmds.cmd_echo, 1],
        "quit": [cmds.cmd_quit, 0],
        "date": [cmds.cmd_date, 0],
        "time": [cmds.cmd_time, 0], 
        "clear": [() => {
            setDisplayedHistory([])
        }, 0],
    }

    const handleInputChange = (e) => {
        setCurrentCommand(e.target.value);
    }; 

    const handleCommandExecute = () => {
        if (currentCommand.trim() === "") return;

        const userInput = `$ ${currentCommand}`;
        setDisplayedHistory((prevHistory) => [...prevHistory, userInput]);
        setCommandHistory((prevHistory) => [...prevHistory, currentCommand]);

        const commandOutput = executeCommand(currentCommand) ?? null; 
        console.log(commandOutput);

        setCurrentCommand("");

        if (commandOutput) {
            animateLatestCommand(commandOutput);
        }
    };

    const executeCommand = (input) => {
        const argv = input.split(" ");
        const command = argv[0];
        const arg_string = argv.slice(1).join(" ");

        if (!Object.keys(commands).includes(command)){
            return `Command "${command}" not found.`;
        }

        const [method, parameter_count] = commands[command];

        const regex = /"([^"]*)"|\S+/g;
        const args = [...arg_string.matchAll(regex).map(m => m[1] || m[0])]
        console.log(args)
        const argument_count = args.length;
        if (argument_count != parameter_count){
            return `Incorrect number of arguments provided. Expected ${parameter_count} but received ${argument_count} `
        }

        return method(...args);
    };

    const animateLatestCommand = (text) => {
        let index = 0;
        setIsTyping(true);

        setDisplayedHistory((prevHistory) => [...prevHistory, ""]);

        const interval = setInterval(() => {
            setDisplayedHistory((prevHistory) => {
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
                    <div className={styles.terminalTitle}>SCSC Commodore v0.1.0</div>
                </div>
                <div className={styles.terminalBody}>
                    <pre>{displayedHistory.join("\n")}</pre>
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
