import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, IndexRoute, hashHistory } from 'react-router';

// 登录页
const Login = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./route/login').default);
    }, 'Login');
};

/* 普通用户平台  start */
const Main = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./route/main').default);
    }, 'Main');
};

// 仪表盘
const Dashboard = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./route/dashboard').default);
    }, 'Dashboard');
};

/* 管理员平台  end */
const routes = (
    <Router history={hashHistory}>
        <Route path="/">
            <IndexRoute getComponent={Login} />
            <Route getComponent={Login} path="login"></Route>
            <Route getComponent={Main} path="main">
                <IndexRoute getComponent={Dashboard} />
                <Route getComponent={Dashboard} path="Dashboard"></Route>
                <Redirect from='/main/*' to='/main/Dashboard' />
            </Route>
        </Route>
    </Router>
);

ReactDOM.render(routes, document.getElementById('app'));
