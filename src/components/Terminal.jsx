import styles from "@css/components/terminal.module.css";
import React, { useEffect, useState, useRef } from "react";
import * as cmds from "./terminal_cmds";

// Fallback console implementation
const fallbackRunCommand = (cmd) => {
  const commands = {
    help: () => ["Available commands: help, clear, about, contact"],
    about: () => ["SCSC Terminal v0.1.0", "Sheridan Computer Science Club"],
    contact: () => ["Discord: https://discord.gg/3CXVBXeeSr", "Email: sheridancsclub@gmail.com"],
    clear: () => []
  };
  
  const command = cmd.toLowerCase().trim();
  if (commands[command]) {
    return commands[command]();
  }
  return [`Command '${cmd}' not found. Type 'help' for available commands.`];
};

const getRunCommand = async () => {
  // Always use fallback for now since the console API is not available
  console.warn("Console API not available, using fallback implementation");
  return fallbackRunCommand;
};

const Terminal = () => {
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [displayedHistory, setDisplayedHistory] = useState([]);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const handleInputChange = (e) => {
    setCurrentCommand(e.target.value);
  };

  const handleCommandExecute = async () => {
    setCurrentCommand(currentCommand.trim());
    if (currentCommand.trim() === "") return;

    const userInput = `$ ${currentCommand}`;
    setDisplayedHistory((prevHistory) => [...prevHistory, userInput]);
    setCommandHistory((prevHistory) => [...prevHistory, currentCommand]);

    if (currentCommand == "clear") {
      setCurrentCommand("");
      setDisplayedHistory([]);
      return;
    }

    let output;

    try {
      const runCommand = await getRunCommand();
      output = runCommand(currentCommand).map((s) => ({
        content: s,
        is_err: false,
      }));
    } catch (e) {
      output = [{ content: e.message ?? String(e), is_err: true }];
    }

    output.forEach(({ content, is_err }) => displayMessage(content, is_err));
    setCurrentCommand("");
  };

  const displayMessage = (msg, is_err) => {
    setDisplayedHistory((prev) => [...prev, { content: msg, err: is_err }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedHistory]);

  useEffect(() => {
    // Focus the input when the terminal component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div id={styles.terminal}>
      <div id={styles.terminalHeader}>
        <div className={styles.terminalTitle}>SCSC Commodore v0.1.0</div>
      </div>

      <div id={styles.terminalScrollBody} ref={scrollRef}>
        <pre>
          {displayedHistory.map((entry, i) =>
            typeof entry === "string" ? (
              <div key={i}>{entry}</div>
            ) : (
              <div key={i} className={entry.err ? styles.errText : ""}>
                {entry.content}
              </div>
            )
          )}
        </pre>

        <div className={styles.terminalInputLine}>
          ${" "}
          <input
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
      </div>
    </div>
  );
};

export default Terminal;
