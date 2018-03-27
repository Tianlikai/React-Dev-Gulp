const logOut = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    sessionStorage.clear();
}

export default logOut;