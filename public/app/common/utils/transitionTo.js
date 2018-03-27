const transitionTo = (url) => {
    let loc = window.location;
    loc.hash = '#' + url;
}

export default transitionTo;