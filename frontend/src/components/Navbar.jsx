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
            <div className={styles.nav} data-toggled={toggled} data-mode="mini">
                {/* left decal */}
                <svg className={styles.nav_decal} width="101" height="42" viewBox="0 0 101 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M90.4573 40.5C59.9573 40.5 62.4573 42.478 37.9573 22.0317C13.4573 1.58538 14.21 1.5 2.20973 1.5C-9.79049 1.5 71.4573 1 71.4573 1C71.4573 1 120.957 40.5 90.4573 40.5Z" fill="#1A1A1A" stroke="#1A1A1A" />
                </svg>
                {/* mobile left decal */}
                <svg className={styles.nav_decal} width="101" height="50" viewBox="0 0 101 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M90.1094 48.9369C59.728 48.9369 62.2183 51.3374 37.8136 26.5239C13.4088 1.71042 14.1586 1.6068 2.20503 1.6068C-9.74854 1.6068 71.1833 1 71.1833 1C71.1833 1 120.491 48.9369 90.1094 48.9369Z" fill="#1A1A1A" stroke="#1A1A1A" />
                </svg>
                {/* bottom-right decal */}
                <svg className={styles.nav_decal} width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5 0H29V15V30C29 30 29 17.2881 20.0969 8.64407C11.1939 0 0 0 0 0H14.5Z" fill="#1A1A1A" />
                </svg>

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