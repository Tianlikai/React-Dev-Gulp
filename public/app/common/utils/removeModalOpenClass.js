const removeModalOpenClass = () => {
    let mBody = document.getElementsByTagName('body')[0];
    mBody.setAttribute('class', '');
}

export { removeModalOpenClass };