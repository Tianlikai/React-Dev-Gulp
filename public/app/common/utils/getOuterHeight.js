
const getOuterHeight = (el) => {
    var height = el.clientHeight
        + this.tryParseInt(el.style.borderTopWidth)
        + this.tryParseInt(el.style.borderBottomWidth)
        + this.tryParseInt(el.style.marginTop)
        + this.tryParseInt(el.style.marginBottom);
    return height;
}

export default getOuterHeight;