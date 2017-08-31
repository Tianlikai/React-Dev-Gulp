'use strict';

var sysval = require('../data/SystemValue');
var Util = require('./Util');

var HOST = sysval.host;

function initXMLhttp() {
    var xmlhttp;

    if (window.XMLHttpRequest) {
        // code for IE7,firefox chrome and above
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for Internet Explorer
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }

    return xmlhttp;
}

var AJAX = function (config) {
    if (!config.url) {
        return;
    }

    if (!config.headers) {
        config.url = Util.changeurl(HOST + config.url);
    }

    if (!config.type) {
        config.type = 'POST';
    }

    if (!config.method) {
        config.method = true;
    }

    if(!config.accept){
        config.accept = 'json';
    }

    if (!config.contentType) {
        config.contentType = 'application/x-www-form-urlencoded';
    }

    var xmlhttp = initXMLhttp();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                if (config.success) {
                    var resp = xmlhttp.responseText;
                    resp = (config.accept == 'json') ? JSON.parse(resp) : resp;
                    config.success(resp, xmlhttp.readyState);
                }
            } else {
                if (!xmlhttp.statusText) {
                    return;
                }
                if (config.error) {
                    config.error(xmlhttp);
                }
            }
        }
    };

    var sendString = [];
    var sendData = config.data;

    // 如果为请求数据为json格式
    if (config.contentType === 'application/json') {
        sendString = JSON.stringify(config.data);
    } else {
        if (typeof sendData === 'string') {
            var tmpArr = String.prototype.split.call(sendData,'&');
            for (var i = 0, j = tmpArr.length; i < j; i++) {
                var datum = tmpArr[i].split('=');
                sendString.push(encodeURIComponent(datum[0]) + '=' + encodeURIComponent(datum[1]));
            }
        } else if (typeof sendData === 'object' && !(sendData instanceof String)) {
            //|| (FormData && sendData instanceof FormData)
            for (var k in sendData) {
                var datum = sendData[k];
                if (Object.prototype.toString.call(datum) == '[object Array]') {
                    for(var i = 0, j = datum.length; i < j; i++) {
                        sendString.push(encodeURIComponent(k) + '[]=' + encodeURIComponent(datum[i]));
                    }
                } else {
                    sendString.push(encodeURIComponent(k) + '=' + encodeURIComponent(datum));
                }
            }
        }

        sendString = sendString.join('&');
    }
    // var sendString = param(config.data);

    if (config.type === 'GET') {
        xmlhttp.open('GET', config.url + '?' + sendString, config.method);
        if (config.headers) {
            for (var name in config.headers) {
                xmlhttp.setRequestHeader(name, config.headers[name]);
            }
        }
        xmlhttp.send();
    }
    if (config.type === 'POST') {
        xmlhttp.open('POST', config.url, config.method);
        xmlhttp.setRequestHeader('Content-type', config.contentType);
        if(config.headers){
            for (var name in config.headers) {
                xmlhttp.setRequestHeader(name, config.headers[name]);
            }
        }
        xmlhttp.send(sendString);
    }
    if (config.type === 'DEL') {
        xmlhttp.open('DELETE', config.url + '?' + sendString, config.method);
        if(config.headers){
            for (name in config.headers) xmlhttp.setRequestHeader(name, config.headers[name]);
        }
        xmlhttp.send();
    }
    if (config.type === 'PUT') {
        xmlhttp.open('PUT', config.url, config.method);
        xmlhttp.setRequestHeader('Content-type', config.contentType);
        if(config.headers){
            for (name in config.headers) xmlhttp.setRequestHeader(name, config.headers[name]);
        }
        xmlhttp.send(sendString);
    }
};

module.exports = AJAX;
