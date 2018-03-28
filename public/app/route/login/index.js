import React from 'react';
import Reflux from 'reflux';
import actions from '../../actions/actions';
import LoginStore from '../../stores/loginStore';

import BaseLayout from '../../layout/BaseLayout';
import InputWithIcon from '../../component/InputWithIcon';
import Button from '../../component/form/Button';
import Input from '../../component/form/Input';

import Lang from '../../data/lang';
import transitionTo from '../../common/utils/transitionTo';

import Mock from 'mockjs';
import { API_LOGIN } from '../../mock/Mock';

const Login = React.createClass({
    mixins: [
        Reflux.listenTo(LoginStore, 'pubsub')
    ],
    getInitialState: function () {
        let user = LoginStore.getUser();
        return {
            fields: {
                username: user.savename,
                password: '',
                valcode: ''
            },
            isCheck: user.savename,
            errors: {},
            errormsg: ''
        };
    },
    componentDidMount: function () {
        Mock.mock('/lae/auth/login', API_LOGIN)
        // 页面初次加载的时候，设置“记住用户名”是否选中
        if (this.state.isCheck) {
            this.refs.remberCheck.checked = true;
        } else {
            this.refs.remberCheck.checked = false;
        }
    },
    pubsub: function (type, data) {
        if (type === 'loginSuccess') {
            this.loginSuccess(data);
        } else if (type === 'loginFail') {
            this.loginError(data);
        }
    },
    // 登录失败
    loginError: function (msg) {
        var errormsg = Lang.login.loginerror;
        if (msg === 'your security code is wrong') {
            errormsg = Lang.login.validationerror;
        }
        this.setState({
            errormsg: msg
        });
    },
    // 登录成功
    loginSuccess: function (resp) {
        let flag = this.refs.remberCheck.checked;
        if (flag) {
            LoginStore.setUser(resp.email);
        } else {
            LoginStore.setUser('');
        }
        transitionTo('/main/Dashboard');
    },
    // 提交登录请求
    commitHandleLogin: function (event) {
        event.preventDefault();
        event.stopPropagation();
        var errors = this.state.errors;
        var fields = {
            password: this.refs.password.getValue(),
            email: this.refs.username.getValue()
        };
        var errormsg = '';
        var haserror = false;

        if (!fields.password) {
            errormsg = Lang.login.pass_empty;
            errors.password = 'error';
            haserror = true;
        }

        if (!fields.email) {
            errormsg = Lang.login.user_empty;
            errors.username = 'error';
            haserror = true;
        }

        if (haserror) {
            this.setState({ errors: errors, errormsg: errormsg });
        } else {
            var postData = {
                user: fields.email,
                password: fields.password
            };
            this.setState({
                fields: {
                    username: postData.user,
                    password: postData.password
                }
            });
            actions.login(postData);
        }
    },
    // 当输入框的值改变时触发
    handleChange: function (value, validateName, field) {
        if (value !== '') {
            this.setState({
                errormsg: ''
            });
        } else {
            var errMsg = '';
            if (field === 'username') {
                errMsg = Lang.login.user_empty;
            } else if (field === 'password') {
                errMsg = Lang.login.pass_empty;
            }
            this.setState({
                errormsg: errMsg
            });
        }
    },
    render: function () {
        return (
            <BaseLayout title={Lang.login.signin}
                handleSubmit={this.commitHandleLogin} >
                <div style={{
                    height: '52px',
                    width: '100%',
                    display: this.state.errormsg ? 'none' : 'block'
                }}></div>

                <div style={{ display: this.state.errormsg ? 'block' : 'none' }}
                    className='login_errmsg'>
                    {this.state.errormsg}
                </div>

                <InputWithIcon field='username' ref='username'
                    placeholder={Lang.login.registeremail}
                    defaultValue={this.state.fields.username}
                    onChange={this.handleChange}
                >
                    <div>
                        <img src='dist/images/user.png' />
                    </div>
                </InputWithIcon>

                <div style={{ height: '10px', width: '100%' }}></div>

                <InputWithIcon field='password' ref='password' type='password'
                    placeholder={Lang.login.password}
                    onChange={this.handleChange}
                >
                    <div>
                        <img src='dist/images/password.png' />
                    </div>
                </InputWithIcon>

                <div style={{ height: '23px', width: '100%' }}></div>

                <div className='rememberUser'>
                    <input type='checkbox'
                        id='rembercheck'
                        ref='remberCheck' />
                    <label for='rembercheck'>
                        {Lang.login.saveuser}
                    </label>
                </div>
                <Button type='submit' block >{Lang.login.login}</Button>
            </BaseLayout>
        );
    }
});

export default Login;