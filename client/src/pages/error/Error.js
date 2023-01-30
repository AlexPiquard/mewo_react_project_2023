import PropTypes from "prop-types";
import styles from "./error.module.css";

// Composant correspondant à une page entière d'erreur.
function Error({code, message}) {
    return <div className={styles.container}>
        <div className={styles.content}>
            <h1>{code}</h1>
            <h4>Une erreur est survenue</h4>
            <p>{message}</p>
        </div>
    </div>
}

Error.propTypes = {
    message: PropTypes.string,
    code: PropTypes.number,
}

export default Error;