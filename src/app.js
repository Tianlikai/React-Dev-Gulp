/*
 * @Author: jason.tian 
 * @Date: 2017-09-17 11:58:07 
 * @Last Modified by: jason.tian
 * @Last Modified time: 2017-09-19 23:22:11
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, IndexRoute, hashHistory, IndexRedirect } from 'react-router';


import Login from './routes/login/Login';
import App from './routes/App';
import Dashboard from './routes/dashboard/Dashboard';
import Tables from "./routes/tables/Tables";

const routes = (
    <Router history={hashHistory}>
        <Route path="/">
            <IndexRedirect to='/app/table' />
            <Route component={App} path="app">
                <IndexRoute component={Tables} />
                <Route component={Dashboard} path="dashboard"></Route>
                <Route component={Tables} path="table"></Route>
                <Redirect from='/app/*' to='/app/dashboard' />
            </Route>
            <Route component={Login} path="login"></Route>
            <Redirect from='*' to='/' />
        </Route>
    </Router>
);

ReactDOM.render(routes, document.getElementById('content'));
