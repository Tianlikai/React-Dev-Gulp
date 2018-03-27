'use strict';

var NAMESPACE = '';

var setNameSpace = function (className) {
    return (NAMESPACE ? NAMESPACE + '-' : '') + className;
};

module.exports = {
    NAMESPACE: NAMESPACE,
    CLASSES: {
        active:setNameSpace('active'),
        disabled:setNameSpace('disabled'),
        divider: setNameSpace('divider'),
        open:setNameSpace('open')  //dropdown
    },
    STYLES: {
        defaults:'default',
        primary:'primary',
        success:'success',
        wraning:'wraning',
        danger:'danger'
    }
};
