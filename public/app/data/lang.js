'use strict';
// 做中英文版本 时使用

var lang = require('../lang');

if (lang() === 'en') {
    module.exports = {
        submit: 'Submit',
        domain: 'Domain',
        cancel: 'Cancel',
        save: 'Save',
        allrights: 'All Rights Reserved',
        version: 'Version',
        enter: 'Enter',
        logout: 'Logout',
        changetouser: 'change to user app',
        filedrequired: 'this filed is required',
        notice: 'Notice',
        warning: 'Warning',
        login_now: '立即登录',
        register_now: '现在注册',
        register_current_time: '立即注册',
        no_user_accout: '没有帐号？',
        haven_user_accout: '已经有一个帐户了吗？',
        input_format_error: {
            email: '邮箱格式错误'
        },
        login: {
            signin: 'Living without an aim is like sailing without a compass',
            registeremail: '请输入注册邮箱',
            username: 'Username',
            password: 'Please enter your password',
            saveuser: 'Save username',
            forgetp: 'Forgot Password?',
            login: 'Login',
            clickchange: 'click to change',
            validation: 'validation',
            loginerror: 'account or password wrong',
            validationerror: 'validation code wrong',
            user_empty: '请输入邮箱',
            pass_empty: '请输入密码',
            check_code_empty: '请输入验证码'
        },
        confirm: 'Confirm',
        dateHint: '请输入日期(例：2006/10/1)',
        text_hint: {
            limit: '支持1-64位字符',
            splitHint: '您可同时填写多个字段进行筛选,不同字段之间用","或";"隔开'
        },
        title: {
            edit: '编辑',
            del: '删除',
            share: '分享',
            refresh: '刷新',
            filtrate: '筛选',
            fullScreen: '全屏',
            fullScreenCancel: '取消全屏',
            details: '查看详情',
            add: '新建',
            export: '导出',
            export_log: '导出日志'
        }
    };
} else {
    module.exports = {
        submit: '提交',
        cancel: '取消',
        save: '保存',
        allrights: '保留所有权利',
        version: '版本',
        enter: '进入',
        logout: '退出',
        changetouser: '跳转到个人页面',
        filedrequired: '该字段为必填项',
        notice: '注意',
        warning: '警告',
        login_now: '立即登录',
        register_now: '现在注册',
        register_current_time: '立即注册',
        no_user_accout: '没有帐号？',
        haven_user_accout: '已经有一个帐户了吗？',
        input_format_error: {
            email: '邮箱格式错误'
        },
        login: {
            signin: 'Living without an aim is like sailing without a compass',
            username: '用户名',
            registeremail: '请输入注册邮箱',
            password: '请输入密码',
            saveuser: '记住用户名',
            forgetp: '忘记密码?',
            login: '登录',
            clickchange: '点击更改',
            validation: '验证码',
            loginerror: '用户名或密码错误',
            validationerror: '验证码输入错误',
            user_empty: '请输入邮箱',
            pass_empty: '请输入密码',
            check_code_empty: '请输入验证码'
        },
        confirm: '确定',
        dateHint: '请输入日期(例：2006/10/1)',
        text_hint: {
            limit: '支持1-64位字符',
            splitHint: '您可同时填写多个字段进行筛选,不同字段之间用","或";"隔开'
        },
        title: {
            edit: '编辑',
            del: '删除',
            share: '分享',
            refresh: '刷新',
            filtrate: '筛选',
            fullScreen: '全屏',
            fullScreenCancel: '取消全屏',
            details: '查看详情',
            add: '新建',
            export: '导出',
            export_log: '导出日志'
        }
    };
}
