import sysval from '../data/SystemValue';
import changeUrl from '../common/utils/changeUrl';

const HOST = sysval.host;

const initXMLhttp = () => {
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

const downFile = (blob, fileName) => {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
    } else {
        var link = document.createElement('a');
        link.addEventListener('click', oDownLoad, false);
        document.body.appendChild(link);
        function oDownLoad() {
            link.download = fileName;
            link.href = window.URL.createObjectURL(blob);
        }
        link.click();
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
    }
}

const req = (config) => {
    if (!config.url) {
        return;
    }

    if (!config.headers) {
        config.url = changeUrl(HOST + config.url);
    }

    if (!config.type) {
        config.type = 'POST';
    }

    if (!config.method) {
        config.method = true;
    }

    if (!config.accept) {
        config.accept = 'json';
    }

    if (!config.contentType) {
        config.contentType = 'application/x-www-form-urlencoded';
    }

    if (!config.responseType) {
        config.responseType = '';
    }
    if (!config.fTitle) {
        config.responseType = '';
    }
    var xmlhttp = initXMLhttp();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                if (config.success) {
                    // window.URL.revokeObjectURL(xmlhttp.response);
                    var resp = null;
                    if (config.responseType === 'blob') {
                        if (xmlhttp.response) {
                            let DATE = new Date();
                            var fileName = config.fTitle + '_' + DATE.toLocaleString() + '.xls';
                            var type = xmlhttp.getResponseHeader('Content-Type');
                            var blob = new Blob([xmlhttp.response], { type: type });
                            downFile(blob, fileName);
                        }
                    } else {
                        resp = xmlhttp.responseText;
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
            } else if (xmlhttp.status == 500) {
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
            var tmpArr = String.prototype.split.call(sendData, '&');
            for (var i = 0, j = tmpArr.length; i < j; i++) {
                var datum = tmpArr[i].split('=');
                sendString.push(encodeURIComponent(datum[0]) + '=' + encodeURIComponent(datum[1]));
            }
        } else if (typeof sendData === 'object' && !(sendData instanceof String)) {
            //|| (FormData && sendData instanceof FormData)
            for (var k in sendData) {
                var datum = sendData[k];
                if (Object.prototype.toString.call(datum) == '[object Array]') {
                    for (var i = 0, j = datum.length; i < j; i++) {
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
        let newUrl = sendString ? config.url + '?' + sendString : config.url;
        xmlhttp.open('GET', newUrl, config.method);
        xmlhttp.responseType = config.responseType;
        if (config.headers) {
            for (var name in config.headers) {
                xmlhttp.setRequestHeader(name, config.headers[name]);
            }
        }
        xmlhttp.send();
    }
    if (config.type === 'POST') {
        xmlhttp.open('POST', config.url, config.method);
        xmlhttp.responseType = config.responseType;
        xmlhttp.setRequestHeader('Content-type', config.contentType);
        if (config.headers) {
            for (var name in config.headers) {
                xmlhttp.setRequestHeader(name, config.headers[name]);
            }
        }
        xmlhttp.send(sendString);
    }
    if (config.type === 'DEL') {
        xmlhttp.open('DELETE', config.url + '?' + sendString, config.method);
        xmlhttp.responseType = config.responseType;
        if (config.headers) {
            for (name in config.headers) {
                xmlhttp.setRequestHeader(name, config.headers[name]);
            }
        }
        xmlhttp.send();
    }
    if (config.type === 'PUT') {
        xmlhttp.open('PUT', config.url, config.method);
        xmlhttp.responseType = config.responseType;
        xmlhttp.setRequestHeader('Content-type', config.contentType);
        if (config.headers) {
            for (name in config.headers) {
                xmlhttp.setRequestHeader(name, config.headers[name]);
            }
        }
        xmlhttp.send(sendString);
    }
};
export default req;
