import styles from "./app_layout.module.css"
import PropTypes from "prop-types";
import {useContext} from "react";
import {ThemeContext} from "../../App";
import {UilMoon, UilSun} from "@iconscout/react-unicons";

function AppLayout({children}) {
    const {theme, onThemeChange} = useContext(ThemeContext);

    return <div className={styles.container + " " + theme}>
        <div className={styles.themeComponent}>
            <button onClick={onThemeChange}>{theme == 'white' ? <UilMoon color={"white"} size={30}/> : <UilSun color={"white"} size={30}/>}</button>
        </div>
        {children}
    </div>
}

AppLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
}

export default AppLayout;