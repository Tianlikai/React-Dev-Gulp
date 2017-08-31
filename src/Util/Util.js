import ReactDOM from 'react-dom';
import Config from "../config/config";

module.exports = {
    changeurl: function (url) {
        var result = url;
        if (url.indexOf('?') > -1) {
            result += '&r=' + Math.random();
        } else {
            result += '?r=' + Math.random();
        }
        return result;
    },
    transitionTo: function (url) {
        var loc = window.location;
        loc.hash = '#' + url;
    },
    // 当浏览器大小改变时，触发
    updateHeight: function (obj, height) {
        let pageContent = ReactDOM.findDOMNode(obj);
        if (pageContent) {
            pageContent.style.height = height + 'px';
        }
    },
    transitionToRoot: function (type = '') {
        if (type === 'user') {
            // 调转到 普通用户平台
            this.transitionTo('/main/Dashboard');
        } else if (type === 'admin') {
            // 调转到 管理员平台
            this.transitionTo('/admin/RoleManagement');
        } else {
            let loc = window.location;
            let port = loc.port ? ':' + loc.port : '';
            let url = loc.protocol + '//' + loc.hostname + port + '/';
            window.location.replace(url);
        }
    },
    // 获取 页面最小高度
    getContentMinHeight: function () {
        var winHeight = window.innerHeight;
        // if (window.innerHeight)
        //     winHeight = window.innerHeight;
        // else if ((document.body) && (document.body.clientHeight))
        //     winHeight = document.body.clientHeight;
        // return (winHeight-103);
        if (winHeight < Config.minHeight2) {
            return Config.minHeight - 96;
        }

        return winHeight - 96;
    },
    /*
     把 ajax 要传递的数据对象 加上 & ，拼接成字符串
     data: 必须为Object类型，不能多层嵌套
   */
    paramSerialize: function (data) {
        var sendString = [];
        if (typeof data === 'object' && !(data instanceof String)) {
            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    sendString.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
                }
            }
        }
        sendString = sendString.join('&');
        return sendString;
    },
}

