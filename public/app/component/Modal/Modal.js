'use strict';

var React = require('react');
var classNames = require('classnames');
var ClassNameMixin = require('../mixins/ClassNameMixin');
var DimmerMixin = require('../mixins/DimmerMixin');
var Events = require('../utils/Events');
var Close = require('../Close');
var Icon = require('../Icon');

var Modal = React.createClass({
  mixins: [ClassNameMixin, DimmerMixin],

  propTypes: {
    classPrefix: React.PropTypes.string.isRequired,
    type: React.PropTypes.oneOf(['alert', 'confirm', 'prompt', 'loading',
      'actions', 'popup']),
    title: React.PropTypes.node,
    confirmText: React.PropTypes.string,
    cancelText: React.PropTypes.string,
    closeIcon: React.PropTypes.bool,
    closeViaDimmer: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      classPrefix: 'modal',
      closeIcon: true,
    };
  },

  getInitialState: function() {
    return {
      transitioning: false
    };
  },

  componentDidMount: function() {
    this._documentKeyupListener =
      Events.on(document, 'keyup', this.handleDocumentKeyUp, false);

    this.setDimmerContainer();

    // TODO: 何为添加动画效果的最佳时机？ render 完成以后添加动画 Class？
    this.setState({
      transitioning: true
    });
  },

  componentWillUnmount: function() {
    this._documentKeyupListener.off();
    this.resetDimmerContainer();
  },

  handleDimmerClick: function() {
    if (this.props.closeViaDimmer) {
      this.props.onRequestClose();
    }
  },

  handleBackdropClick: function(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    this.props.onRequestClose();
  },

  handleDocumentKeyUp: function(e) {
    if (!this.props.keyboard && e.keyCode === 27) {
      this.props.onRequestClose();
    }
  },

  render: function() {
    var classSet = this.getClassSet();
    var props = this.props;
    // var footer = this.renderFooter();
    var style = {
        display: 'block',
        width: props.modalWidth,
        height: props.modalHeight,
        marginLeft: props.marginLeft,
        marginTop: props.marginTop
      };
    classSet[this.prefixClass('active')] = this.state.transitioning;

    // .am-modal-no-btn -> refactor this style using `~` selector
    //classSet[this.prefixClass('no-btn')] = !footer;
    props.type && (classSet[this.prefixClass(props.type)] = true);

    var modal = (
      <div
        {...props}
        style={style}
        ref="modal"
        title={null}
        className={classNames(classSet, props.className)}>
        <div className={this.prefixClass('dialog')}>
          <div className={this.prefixClass('bd')} ref="modalBody">
            {this.props.children}
          </div>
        </div>
      </div>
    );

    return this.renderDimmer(modal);
  }
});

module.exports = Modal;
