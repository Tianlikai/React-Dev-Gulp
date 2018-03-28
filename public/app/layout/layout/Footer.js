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
                <strong className='pull-right'>
                    <a href="https://github.com/Tianlikai/React-Dev-Gulp">Github&nbsp;@&nbsp;React-Dev-Gulp</a>
                </strong>
            </div>
        );
    }
});

module.exports = Footer;
