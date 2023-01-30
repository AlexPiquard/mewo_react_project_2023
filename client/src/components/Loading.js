import PropTypes from "prop-types";

function Loading({loading, children}) {
    if (loading) return <p>Loading...</p>
    return <>
        {children}
    </>
}

Loading.propTypes = {
    loading: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default Loading;