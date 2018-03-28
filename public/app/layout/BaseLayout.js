var React = require('react');
var classNames = require('classnames');
var lang = require('../data/lang');
var Form = require('../component/form/Form');

var BaseHeader = require('./base_layout/Header');
var BaseFooter = require('./base_layout/Footer');

var BaseLayout = React.createClass({
    render: function () {
        var formclassname = classNames('animated', this.props.formclassname || 'fadeInUp');
        return (
            <div className='loginPage'>
                <div className='bgImg'>
                    <img src='dist/images/background.svg' />
                </div>
                <BaseHeader />
                <div className='main_login'>
                    <Form className={formclassname} onSubmit={this.props.handleSubmit}
                        style={{ width: this.props.fwidth }}
                        horizontal={this.props.horizontal}>
                        <div className='login_content_header'>{this.props.title}</div>
                        {this.props.children}
                    </Form>
                </div>
                <BaseFooter />
            </div>
        );
    }
});

module.exports = BaseLayout;
