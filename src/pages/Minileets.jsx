import { useState, useEffect, useRef } from "react";
import { createSwapy } from "swapy";
import styles from "@css/minileets.module.css";
import zen from "@assets/icons/minileets/zen.svg";
import hint from "@assets/icons/minileets/hint.svg";
import share from "@assets/icons/minileets/share.svg";
import next_arrow from "@assets/icons/minileets/next_arrow.svg";
import minileets from "@data/mockMinileets.json";
import { toast } from "sonner";
import { useReward } from "react-rewards";

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
    // function highlight
    if (token === "invertTree")
        return "#DCDCAA";

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
    const [solved, setSolved] = useState(false);
    const containerRef = useRef(null);
    const swapyInstance = useRef(null);
    const { reward, isAnimating } = useReward("rewardConfetti", "confetti");
    
    // Competitive mode states
    const [gameMode, setGameMode] = useState('practice'); // 'practice' or 'competitive'
    const [isGameActive, setIsGameActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
    const [score, setScore] = useState(0);
    const [completedProblems, setCompletedProblems] = useState([]);
    const [gameStartTime, setGameStartTime] = useState(null);
    const [showNameModal, setShowNameModal] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [triesLeft, setTriesLeft] = useState(3);
    const [problemStartTime, setProblemStartTime] = useState(null);
    const timerRef = useRef(null);

    // Load leaderboard from localStorage on component mount
    useEffect(() => {
        const savedLeaderboard = localStorage.getItem('minileets-leaderboard');
        if (savedLeaderboard) {
            setLeaderboard(JSON.parse(savedLeaderboard));
        }
    }, []);

    // Timer effect for competitive mode
    useEffect(() => {
        if (isGameActive && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isGameActive) {
            endGame();
        }
        
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isGameActive, timeLeft]);

    // update code lines
    useEffect(() => {
        // Destroy swapy instance before updating code lines
        if (swapyInstance.current) {
            swapyInstance.current.destroy();
            swapyInstance.current = null;
        }
        
        const codeData = minileets[currentProblem].code;
        // Handle both array and string formats for backward compatibility
        const lines = Array.isArray(codeData) ? codeData : codeData.split("\n");
        setCodeLines(lines);
        setHintIndex(0);
        setSolved(false);
        setTriesLeft(3);
        setProblemStartTime(Date.now());
    }, [currentProblem]);

    // init swapy
    useEffect(() => {
        if (containerRef.current && codeLines.length > 0) {
            // Always destroy the previous instance
            if (swapyInstance.current) {
                swapyInstance.current.destroy();
                swapyInstance.current = null;
            }
            
            // Clear any existing swapy attributes from DOM elements
            const container = containerRef.current;
            const swapyElements = container.querySelectorAll('[data-swapy-slot], [data-swapy-item]');
            swapyElements.forEach(el => {
                // Remove any swapy-specific attributes that might interfere
                const attributes = [...el.attributes];
                attributes.forEach(attr => {
                    if (attr.name.startsWith('data-swapy-') && !['data-swapy-slot', 'data-swapy-item'].includes(attr.name)) {
                        el.removeAttribute(attr.name);
                    }
                });
            });
            
            // Small delay to ensure DOM is updated with new content
            const timer = setTimeout(() => {
                if (containerRef.current && !solved) {
                    swapyInstance.current = createSwapy(containerRef.current);
                }
            }, 100);
            
            return () => {
                clearTimeout(timer);
            };
        }
    
        return () => {
            if (swapyInstance.current) {
                swapyInstance.current.destroy();
                swapyInstance.current = null;
            }
        };
    }, [codeLines, currentProblem, solved]);
    
    // Game management functions
    const startCompetitiveGame = () => {
        setGameMode('competitive');
        setIsGameActive(true);
        setTimeLeft(180);
        setScore(0);
        setCompletedProblems([]);
        setCurrentProblem(0);
        setTriesLeft(3);
        setGameStartTime(Date.now());
        setProblemStartTime(Date.now());
        toast.success("Competitive mode started! You have 3 minutes!");
    };

    const endGame = () => {
        setIsGameActive(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        
        if (completedProblems.length > 0) {
            setShowNameModal(true);
        } else {
            toast.info("Game over! Try again to get on the leaderboard.");
            resetToPractice();
        }
    };

    const handleProblemSolved = () => {
        const solveTime = Date.now() - problemStartTime;
        const timeBonus = Math.max(0, 60 - Math.floor(solveTime / 1000)); // Bonus points for speed
        const problemScore = 100 + timeBonus;
        
        setScore(prev => prev + problemScore);
        setCompletedProblems(prev => [...prev, {
            problemIndex: currentProblem,
            solveTime: solveTime,
            score: problemScore
        }]);

        toast.success(`Problem solved! +${problemScore} points`);

        // Move to next problem or end game if no more problems
        setTimeout(() => {
            if (currentProblem < minileets.length - 1) {
                setCurrentProblem(prev => prev + 1);
            } else {
                // Completed all problems
                endGame();
            }
        }, 1500);
    };

    const handleSubmit = () => {
        if (solved) return; // Already solved
        
        const currentOrder = Array.from(containerRef.current.querySelectorAll("[data-swapy-item]"))
            .map((el) => parseInt(el.getAttribute("data-swapy-item"), 10) + 1);

        if (JSON.stringify(currentOrder) === JSON.stringify(minileets[currentProblem].solution)) {
            setSolved(true);
            toast.success("Correct! Well done!");
            reward();
            
            if (gameMode === 'competitive' && isGameActive) {
                handleProblemSolved();
            }
        } else {
            setTriesLeft(prev => prev - 1);
            if (triesLeft - 1 > 0) {
                toast.error(`Incorrect! ${triesLeft - 1} tries remaining.`);
            } else {
                if (gameMode === 'competitive' && isGameActive) {
                    endGame();
                }
                // toast.error("No tries left! Moving to next problem...");
                // if (gameMode === 'competitive' && isGameActive) {
                //     // Move to next problem after failed attempts
                //     setTimeout(() => {
                //         if (currentProblem < minileets.length - 1) {
                //             setCurrentProblem(prev => prev + 1);
                //         } else {
                //             endGame();
                //         }
                //     }, 1500);
                // }
            }
        }
    };

    const resetToPractice = () => {
        setGameMode('practice');
        setIsGameActive(false);
        setTimeLeft(180);
        setScore(0);
        setCompletedProblems([]);
        setCurrentProblem(0);
        setTriesLeft(3);
        setShowNameModal(false);
        setShowLeaderboard(false);
    };

    const submitScore = () => {
        if (!playerName.trim()) {
            toast.error("Please enter your name!");
            return;
        }

        const newEntry = {
            name: playerName.trim(),
            score: score,
            problemsSolved: completedProblems.length,
            totalTime: 180 - timeLeft,
            timestamp: Date.now()
        };

        const updatedLeaderboard = [...leaderboard, newEntry]
            .sort((a, b) => {
                // Sort by score first, then by problems solved, then by time
                if (b.score !== a.score) return b.score - a.score;
                if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved;
                return a.totalTime - b.totalTime;
            })
            .slice(0, 10); // Keep top 10

        setLeaderboard(updatedLeaderboard);
        localStorage.setItem('minileets-leaderboard', JSON.stringify(updatedLeaderboard));
        
        setShowNameModal(false);
        setShowLeaderboard(true);
        toast.success("Score submitted to leaderboard!");
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
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
                        
                        {/* Game Mode Selection */}
                        {!isGameActive && (
                            <div id={styles.game_mode_selector}>
                                <button 
                                    className={`${styles.mode_button} ${gameMode === 'practice' ? styles.active : ''}`}
                                    onClick={() => setGameMode('practice')}
                                >
                                    Practice Mode
                                </button>
                                <button 
                                    className={`${styles.mode_button} ${gameMode === 'competitive' ? styles.active : ''}`}
                                    onClick={startCompetitiveGame}
                                >
                                    Competitive Mode
                                </button>
                                <button 
                                    className={styles.leaderboard_button}
                                    onClick={() => setShowLeaderboard(true)}
                                >
                                    Leaderboard
                                </button>
                            </div>
                        )}

                        {/* Competitive Game Stats */}
                        {gameMode === 'competitive' && (
                            <div id={styles.game_stats}>
                                <div className={styles.stat}>
                                    <span>Time: {formatTime(timeLeft)}</span>
                                </div>
                                <div className={styles.stat}>
                                    <span>Score: {score}</span>
                                </div>
                                <div className={styles.stat}>
                                    <span>Solved: {completedProblems.length}</span>
                                </div>
                                {isGameActive && (
                                    <button 
                                        className={styles.end_game_button}
                                        onClick={endGame}
                                    >
                                        End Game
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Practice Mode Controls */}
                        {gameMode === 'practice' && (
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
                        )}
                    </div>
                    
                    <div 
                        ref={containerRef} 
                        id={styles.puzzle} 
                        key={`puzzle-${currentProblem}`}
                        style={{ cursor: solved ? "default" : "grab" }}
                    >
                        {codeLines.map((line, index) => (
                            <pre key={`${currentProblem}-${index}`} data-swapy-slot={index} className={styles.code_line}>
                                <div data-swapy-item={index}>{highlightCodeLine(line)}</div>
                            </pre>
                        ))}
                        <div className={styles.confetti} id="rewardConfetti" />
                    </div>

                    {/* Submit Button */}
                    <div className={styles.submit_container}>
                        <button 
                            className={styles.submit_button}
                            onClick={handleSubmit}
                            disabled={solved || (gameMode === 'competitive' && triesLeft === 0)}
                        >
                            {solved ? "Solved!" : "Submit Answer"}
                        </button>
                        {gameMode === 'competitive' && (
                            <div className={styles.tries_display}>
                                Tries remaining: {triesLeft}/3
                            </div>
                        )}
                    </div>
                </div>
                
                <pre id={styles.description}>
                    {minileets[currentProblem]?.description.split("\n").map((line, index) => (
                        <span
                            key={index}
                            style={{
                                fontWeight: index === 0 ? "bold" : "normal",
                                color: index >= 2 ? "var(--light_15)" : "var(--light_60)"
                            }}
                        >
                            {line}{"\n"}
                        </span>
                    ))}
                </pre>
            </div>

            {/* Name Entry Modal */}
            {showNameModal && (
                <div id={styles.modal_overlay}>
                    <div id={styles.modal}>
                        <h2>Game Complete!</h2>
                        <p>Final Score: {score}</p>
                        <p>Problems Solved: {completedProblems.length}</p>
                        <p>Time Used: {formatTime(180 - timeLeft)}</p>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && submitScore()}
                            maxLength={20}
                        />
                        <div className={styles.modal_buttons}>
                            <button onClick={submitScore}>Submit Score</button>
                            <button onClick={resetToPractice}>Skip</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Leaderboard Modal */}
            {showLeaderboard && (
                <div id={styles.modal_overlay}>
                    <div id={styles.modal}>
                        <h2>Leaderboard</h2>
                        <div className={styles.leaderboard}>
                            {leaderboard.length === 0 ? (
                                <p>No scores yet! Be the first to compete!</p>
                            ) : (
                                leaderboard.map((entry, index) => (
                                    <div key={index} className={styles.leaderboard_entry}>
                                        <span className={styles.rank}>#{index + 1}</span>
                                        <span className={styles.name}>{entry.name}</span>
                                        <span className={styles.score}>{entry.score} pts</span>
                                        <span className={styles.problems}>{entry.problemsSolved} solved</span>
                                        <span className={styles.time}>{formatTime(entry.totalTime)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <button onClick={() => setShowLeaderboard(false)}>Close</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Minileets;
