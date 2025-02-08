import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from '@css/components/navbar.module.css';
import mini_logo from '@assets/logos/logo_light.svg';
import discord from '@assets/icons/discord.svg';
import { toast } from 'sonner'

const warningMessage = "Sorry! This part of the website is still under development. Join the discord for more information instead (꩜﹏꩜)";

function Navbar() {
    const location = useLocation();
    const [toggled, setToggled] = useState(false);

    function getActive(path){
        if (location.pathname === path){
            return styles.active;
        }
        return '';
    }

    function clickHandler(){
        window.scrollTo({top: 0, behavior: 'smooth'});
        if (toggled){
            setToggled(false);
        }
    }

    return (
        <nav className={styles.nav_container}>
            <div className={styles.nav} data-toggled={toggled}>
                <Link id={styles.logo} to="/" onClick={() => clickHandler()}>
                    Sheridan CS Club &nbsp;🖥️ <span>| 2025</span>
                </Link>
                <ul className={styles.list}>
                    <li>
                        <img id={styles.mini_logo} src={mini_logo} alt="SCSC logo" />
                    </li>
                    {/* <li className={`${styles.list_item} ${getActive('/')}`}>
                        <Link to="/" onClick={() => clickHandler()}>Home</Link>
                    </li> */}
                    <li className={`${styles.list_item} ${getActive('/about')}`}>
                        {/* <Link to="/about" onClick={() => clickHandler()}>About</Link> */}
                        <Link onClick={() => toast.warning(warningMessage)}>About</Link>
                    </li>
                    <li className={`${styles.list_item} ${getActive('/events')}`}>
                        {/* <Link to="/services" onClick={() => clickHandler()}>Events</Link> */}
                        <Link onClick={() => toast.warning(warningMessage)}>Events</Link>
                    </li>
                    <li className={`${styles.list_item} ${getActive('/faq')}`}>
                        {/* <Link to="/parts" onClick={() => clickHandler()}>FAQ</Link> */}
                        <Link onClick={() => toast.warning(warningMessage)}>FAQ</Link>
                    </li>
                    <li className={styles.list_item}>
                        <a href="https://discord.gg/3CXVBXeeSr" target="_blank">
                            <img id={styles.discord} src={discord} alt="Discord"/>
                        </a>
                    </li>
                    {/* <li className={`${styles.list_item} ${getActive('/faq')}`}>
                        <Link to="/faq" onClick={() => clickHandler()}>FAQ</Link>
                    </li> */}
                    {/* <li id={styles.contact_link} className={`${styles.list_item} ${getActive('/contact')}`}>
                        <Link to="/contact" onClick={() => clickHandler()}>Contact</Link>
                    </li> */}
                </ul>
                <div className={styles.burger} onClick={() => setToggled(!toggled)}> 
                    <div />
                    <div />
                    <div />
                </div>
                <div className={`${styles.overlay} ${toggled && styles.active}`} onClick={() => setToggled(!toggled)}></div>
            </div>
        </nav>
    )
}

export default Navbar;