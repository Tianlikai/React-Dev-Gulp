'use strict';

var React = require('react');

var Loading = React.createClass({
    render: function () {
        return (
            <div className='spinner'>
                <div className='double-bounce1'></div>
                <div className='double-bounce2'></div>
            </div>
        );
    }
});

module.exports = Loading;
