'use strict';

module.exports = function getLocation() {
    if (sessionStorage.getItem('lang')) {
        return sessionStorage.getItem('lang').indexOf('zh') > -1 ? 'zh-CN' : 'en';
    }
    var nlan = navigator.language || navigator.userLanguage;
    return nlan.indexOf('zh') > -1 ? 'zh-CN' : 'en';
};
