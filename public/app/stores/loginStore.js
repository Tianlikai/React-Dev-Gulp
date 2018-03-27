'use strict';

const Reflux = require('reflux');
const actions = require('../actions/actions');
const transitionToRoot = require('../common/utils/transitionToRoot');
const logOut = require('../common/utils/logOut');

let defaultUser = {
    username: '',
    email: '',
    savename: null
};

const loginStore = Reflux.createStore({
    listenables: actions,
    init: function () {
        this.users = [];
        this.user = defaultUser;
        let username = localStorage.getItem('username');
        let email = localStorage.getItem('email');
        let savename = localStorage.getItem('savename');
        if (savename) {
            this.user.username = username;
            this.user.email = email;
            this.user.savename = savename;
        }
    },
    onLoginSuccess: function (resp) {
        localStorage.setItem('username', resp.username);
        localStorage.setItem('email', resp.email);
        localStorage.setItem('userType', resp.user_type);
        localStorage.setItem('token', resp.token);  // 请求的header --token
        sessionStorage.setItem('token', resp.token);  // 请求的header --token
        sessionStorage.setItem('userType', resp.user_type);
        this.trigger('loginSuccess', resp);
    },
    onLoginFail: function (resp) {
        this.trigger('loginFail', resp);
    },
    onLogoutSuccess: function () {
        logOut();
        transitionToRoot();
    },
    getUser: function () {
        let username = localStorage.getItem('username');
        let email = localStorage.getItem('email');
        let savename = localStorage.getItem('savename');
        if (savename) {
            this.user.username = username;
            this.user.email = email;
            this.user.savename = savename;
        }
        return this.user;
    },
    setUser: function (email) { // save name  --持久化
        if (email) {
            localStorage.setItem('savename', email);
        } else {
            localStorage.setItem('savename', '');
        }
    }
});

module.exports = loginStore;
