import PropTypes from "prop-types";
import styles from "./error.module.css"

// Composant correspondant à une simple ligne d'erreur, qui apparaitra en rouge.
function ErrorLine({errorMessage}) {
    return <div><p className={styles.error_line}>{errorMessage}</p></div>
}

ErrorLine.propTypes = {
    errorMessage: PropTypes.string,
}

export default ErrorLine;