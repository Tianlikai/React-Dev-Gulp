const withoutTransition = (el, callback) => {
    el.style.transition = 'none';
    callback();
    this.forceRedraw(el);
    el.style.transition = '';
}

export default withoutTransition;