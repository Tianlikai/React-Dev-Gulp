'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
// 弹出层的通用组件 -- 先渲染弹出层部分
module.exports = {
    propTypes: {
        container: React.PropTypes.node,
    },
    componentDidMount: function () {
        this._renderOverlay();
    },
    componentDidUpdate: function () {
        this._renderOverlay();
    },
    componentWillUnmount: function () {
        this._unMountOverlay();
        if (this._overlayWrapper) {
            this.getContainerDOMNode().removeChild(this._overlayWrapper);
            this._overlayWrapper=null;
        }
    },
    // create overlay wrapper and appendTo body
    _mountOverlayWrapper: function () {
        this._overlayWrapper = document.createElement('div');
        this.getContainerDOMNode().appendChild(this._overlayWrapper);
    },
    _renderOverlay: function () {
        if (!this._overlayWrapper) {
            this._mountOverlayWrapper();
        }

        var overlay = this.renderOverlay();
        if (overlay !=null) {
            this._overlayInstance = ReactDOM.render(overlay, this._overlayWrapper);
        } else {
            this._unMountOverlay();
        }
    },
    _unMountOverlay: function () {
        ReactDOM.unmountComponentAtNode(this._overlayWrapper);
        if (this._overlayWrapper) {
            this.getContainerDOMNode().removeChild(this._overlayWrapper);
            this._overlayWrapper=null;
        }
    },
    getOverlayDOMNode: function () {
        if (this._overlayInstance) {
            return ReactDOM.findDOMNode(this._overlayInstance);
        }
    },
    getContainerDOMNode: function () {
        return ReactDOM.findDOMNode(this.props.container) || document.body;
    }
};
