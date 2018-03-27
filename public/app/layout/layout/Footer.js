'use strict';

var React = require('react');
var lang = require('../../data/lang');

var Footer = React.createClass({
    showComponentUpdate: function () {
        return false;
    },
    render: function () {
        return (
            <div className='main-footer'>
                <strong>
                上海凡响网络科技有限公司&nbsp;&nbsp;版权所有&nbsp;©&nbsp;2017
                </strong>
                <strong className='pull-right'>
                   数中数分析引擎&nbsp;2.1.0
                </strong>
            </div>
        );
    }
});

module.exports = Footer;
