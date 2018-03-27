const isOverFlow = (el, pad) => {
    var padding = pad || 0;
    var height = window.innerHeight || document.documentElement.clientHeight;
    var bottom = el.getBoundingClientRect().bottom + padding;
    return bottom > height;
}

export default isOverFlow;