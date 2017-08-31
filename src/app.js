/* 加载：公共组件插件 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, IndexRoute, hashHistory, browserHistory } from 'react-router';

// import App from './Routes/App'
// import Login from './Routes/login/Login'
// import Dashboard from './Routes/dashboard/Dashboard'
// import Tables from './Routes'

const routes = (
    <Router history={hashHistory}>
        <Route path="/">
            <Route component={App} path="app">
                <IndexRoute component={Dashboard} />
                <Route component={Tables} path="tables"></Route>
                <Redirect from='/app/*' to='/app/dashboard' />
            </Route>
            <Route component={Login} path="login"></Route>
            <Redirect from='*' to='/' />
        </Route>
    </Router>
);

ReactDOM.render(routes, document.getElementById('content'));
