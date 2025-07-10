import styles from "@css/components/terminal.module.css";
import React, { useEffect, useState, useRef } from "react";
import * as cmds from "./terminal_cmds";
import { runCommand } from "@api/cs-club-console/console";

const Terminal = () => {
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [displayedHistory, setDisplayedHistory] = useState([]);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const handleInputChange = (e) => {
    setCurrentCommand(e.target.value);
  };

  const handleCommandExecute = () => {
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
