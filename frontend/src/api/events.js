
const base = import.meta.env.VITE_API_URL;

export function GetEvents(){
    let events = fetch(`${base}/events/get-events`)
        .then(res => res.json())
        .then(res => res['Events'])
    return events;
}