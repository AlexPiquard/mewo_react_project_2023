import PropTypes from "prop-types";

function LoadingButton({children, loading, ...attributes}) {
    return <button {...attributes}>{loading ? "Loading..." : children}</button>
}

LoadingButton.propTypes = {
    loading: PropTypes.bool,
    attributes: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
}

export default LoadingButton;