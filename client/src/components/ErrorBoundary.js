import {useRouteError} from "react-router-dom";
import Error from "../pages/error/Error";

function ErrorBoundary() {
    const error = useRouteError();
    return <Error code={error?.code} message={error?.message ?? error?.statusText}/>
}

export default ErrorBoundary;