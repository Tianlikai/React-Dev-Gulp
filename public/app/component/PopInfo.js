import React from 'react';
import ReactDOM from 'react-dom';
import SystemValue from '../data/SystemValue';
import ShowInfo from '../component/Popover/ShowInfo';
import LoadingModal from '../component/Modal/Loading';
import Loading from './Loading';

module.exports = {
    showinfo: function (info, type, autoclose, key, time, left, top, className) {
        // type = 'success','warning','danger','info']
        var mType = type || 'success';
        // info=info.charAt(0).toUpperCase()+info.substr(1);
        var mKey = key || 'showinfo' + Date.now();
        var component = (
            <ShowInfo className={className || ''} time={time || null} left={left || null} top={top || null} info={info} type={mType} autoclose={autoclose} id={mKey} />
        );
        ReactDOM.render(component, document.createElement('div'));
    },
    showloading: function (active, othercomponent) {
        if (active) {
            var loadingContainer = document.createElement('div');
            var component = (
                <LoadingModal active={true} key='loadingmodal'>
                    <Loading />
                    {othercomponent}
                </LoadingModal>
            );
            if (component) {
                ReactDOM.render(component, loadingContainer);
            }
        } else {
            var lnode = document.getElementById('loadingmodal');
            if (lnode) {
                var pnode = lnode.parentNode;
                ReactDOM.unmountComponentAtNode(pnode);
            }
        }
    },
    hideloading: function (id) {
        if (!id) {
            id = 'loadingmodal';
        }
        var lnode = document.getElementById(id);
        if (lnode) {
            var pnode = lnode.parentNode;
            ReactDOM.unmountComponentAtNode(pnode);
            document.body.removeChild(pnode);
        }
    },
    saveSuccess: SystemValue.saveSuccess,
    saveError: SystemValue.saveError,
    cannotdel: SystemValue.cannotdel,
    hasnoselected: SystemValue.hasnoselected
};
