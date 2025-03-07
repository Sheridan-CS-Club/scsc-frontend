import { useEffect, useState } from "react";
import styles from "@css/events.module.css";
import { GetEvents } from "api/events";

const eventCategories = ["All", "Social", "Hacks", "Workshops", "Talks"];
const handleSectionClick = () => {
    window.open("https://discord.com/channels/1249826862738313297/1249826863426175088", "_blank");
};

const Events = () => {
    const [activeCategory, setActiveCategory] = useState(eventCategories[0]);

    const [eventsLoaded, setEventsLoaded] = useState(false)
    const [events, setEvents] = useState([])

    useEffect(() => {
        async function handleLoad(){
            if (!eventsLoaded){
                let events = await GetEvents();
                setEvents(events)
                setEventsLoaded(true)
            }
        }

        handleLoad()

    }, [eventsLoaded])

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    const filteredEvents = events
        .filter(event => activeCategory === "All" || event.category === activeCategory)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const eventsByYear = filteredEvents.reduce((acc, event) => {
        const year = new Date(event.date).getFullYear();
        acc[year] = acc[year] || [];
        acc[year].push(event);
        return acc;
    }, {});

    const sortedYears = Object.keys(eventsByYear).sort((a, b) => b - a);

    return (
        <>
            <section id={styles.events_section}>
                <div id={styles.events_container}>
                    <ul id={styles.events_categories}>
                        {eventCategories.map((category) => (
                            <li
                                key={category} tabIndex="0" role="button"
                                className={activeCategory === category ? styles.active : ""}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                    <div id={styles.events_list_container}>
                        {sortedYears.map(year => (
                            <div key={year} className={styles.year_group}>
                                <h2>{year}</h2>
                                <ul className={styles.events_list}>
                                    {eventsByYear[year].map(event => (
                                        <li key={event.id} tabIndex="0" className={styles.event} onClick={handleSectionClick}>
                                            <span>{event.name}</span>
                                            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })} · {event.location}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Events;
