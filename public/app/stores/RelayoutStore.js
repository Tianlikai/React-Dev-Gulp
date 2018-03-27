const Reflux = require('reflux');
const actions = require('../actions/actions');

const RelayoutStore = Reflux.createStore({
    listenables: actions,
    onResizeEchartsSuccess: function () {
        this.trigger('resizeEchartsSuccess');
    },
    onSyncTablesPageSuccess: function (page) {
        this.trigger('syncTablesPageSuccess', page);
    },
});

module.exports = RelayoutStore;
