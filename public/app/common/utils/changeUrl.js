const changeUrl = (url) => {
    var result = url;
    if (url.indexOf('?') > -1) {
        result += '&r=' + Math.random();
    } else {
        result += '?r=' + Math.random();
    }
    return result;
}

export default changeUrl;