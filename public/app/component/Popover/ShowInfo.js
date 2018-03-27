var React = require('react');
var classNames = require('classnames');
var OverlayMixin = require('../mixins/OverlayMixin');
var Close = require('../form/Close');

var ShowInfo = React.createClass({
    mixins: [OverlayMixin],
    propTypes: {
        active: React.PropTypes.bool,
        left: React.PropTypes.any,
        top: React.PropTypes.any,
        info: React.PropTypes.string,
        autoclose: React.PropTypes.bool,
        time: React.PropTypes.number,
        left: React.PropTypes.number,
        top: React.PropTypes.number,
        type: React.PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'empty'])
    },
    getDefaultProps: function () {
        return {
            top: 102,
            left: '46%',
            autoclose: true
        };
    },
    getInitialState: function () {
        return {
            active: true
        };
    },
    renderOverlay: function () { // 渲染 弹出层
        if (!this.state.active) {
            return null;
        }
        var self = this;
        var clssesobj = {};
        var wTime = this.props.time || 2000;
        clssesobj['alert-' + this.props.type] = true;
        if (this.props.autoclose) {
            if (this.props.type === 'empty') {
                setTimeout(function () {
                    self.setState({
                        active: false
                    });
                }, 1000);
                clssesobj['alert-info'] = true;
            } else {
                setTimeout(function () {
                    self.setState({
                        active: false
                    });
                }, wTime);
            }
        }
        var classes = classNames(this.props.className, "popinfo", "alert", clssesobj);
        return (
            <div id={this.props.id} className={classes} style={{ position: "fixed", left: this.props.left ? this.props.left : '46%', top: this.props.top ? this.props.top : 102 }}>
                <span>{this.props.info}</span>
                <Close icon onClick={this.close} />
            </div>
        );
    },
    close: function () {
        this.setState({
            active: false,
        })
    },
    render: function () {
        return null;
    }
});
module.exports = ShowInfo;
