var React = require('react');
var classNames = require('classnames');
var OverlayMixin = require('../mixins/OverlayMixin');
var ClassNameMixin = require('../mixins/ClassNameMixin');

var Loading = React.createClass({
  mixins: [OverlayMixin, ClassNameMixin],
  propTypes: {
    active: React.PropTypes.bool,
    left: React.PropTypes.any,
    top: React.PropTypes.any,
  },
  getDefaultProps: function () {
    return {
      top: 60,
      left: "50%",
    }
  },
  getInitialState: function () {
    return {
      active: this.props.active
    }
  },
  renderOverlay: function () { //渲染 弹出层
    if (!this.state.active)
      return null;
    var self = this;
    var classSet = {};
    classSet[this.setClassNamespace('modal-backdrop')] = true;
    classSet[this.setClassNamespace('fade')] = true;
    classSet[this.setClassNamespace('in')] = this.props.active;
    return (
      <div id="loadingmodal" className={classNames(this.props.className, classSet)} style={{ opacity: 1, background: "transparent" }}>
        {this.props.children}
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
module.exports = Loading;
