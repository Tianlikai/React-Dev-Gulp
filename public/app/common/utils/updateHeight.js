// 当浏览器大小改变时，触发
const updateHeight = (obj, height) => {
    let pageContent = ReactDOM.findDOMNode(obj);
    if (pageContent) {
        pageContent.style.height = height + 'px';
    }
}

export default updateHeight;