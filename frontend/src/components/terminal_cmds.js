
export function cmd_help(){
    return `
    Available commands:
        echo [text]   - Prints the text to the terminal.
        quit          - Closes the terminal.
        date          - Displays the current date.
        time          - Displays the current time.
        clear         - Clears the terminal screen.
        help          - Displays this help message.
        `;
}
export function cmd_echo(echo){
    return echo || "";
}
export function cmd_quit(){
    setTimeout(() => {
        var keypress = new KeyboardEvent("keydown", {
            key: 'Escape',
            code: 'Escape',
            bubbles: true
        });
        document.dispatchEvent(keypress);
    }, 2000)
    return "Terminal will close now. Goodbye :)"
}

export function cmd_date(){
    return new Date().toLocaleDateString();

}
export function cmd_time(){
    return new Date().toLocaleTimeString();
}

