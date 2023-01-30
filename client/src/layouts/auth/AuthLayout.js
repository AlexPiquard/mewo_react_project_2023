import styles from './auth_layout.module.css'
import PropTypes from "prop-types";

function AuthLayout({children}) {
    return <div className={styles.auth_container}>
        {children}
    </div>
}

AuthLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
}

export default AuthLayout;