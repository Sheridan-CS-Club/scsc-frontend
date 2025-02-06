import { Link } from "react-router-dom";
import styles from "@css/home.module.css";

const Home = () => {
    return (
        <>
            <section id={styles.hero_section}>
                <div id={styles.hero_container}>
                    <h1>Sheridan CS Club</h1>
                </div>
            </section>
        </>
    );
};

export default Home;