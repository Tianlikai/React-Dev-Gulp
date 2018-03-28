var React = require('react');

var HeaderLayout = React.createClass({
    render: function () {
        return (
            <div className="header_login">
                <div>
                    <a href='' className='company_logo'>
                        <img src='dist/images/logo.svg' />
                        React Dev Gulp
                    </a>
                </div>
            </div>
        );
    }
});

module.exports = HeaderLayout;
