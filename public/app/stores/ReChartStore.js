const Reflux = require('reflux');
const actions = require('../actions/actions');

const ReChartStore = Reflux.createStore({
    listenables: actions,
    init: function () {
        this.map = null;
    },
    getMap: function (mapName) {
        if (this.map && this.map[mapName]) {
            return this.map[mapName];
        }
        return null;
    },
    setMap: function (data, mapName) {
        if (this.map === null) {
            this.map = {};
        }
        this.map[mapName] = data;
    },
    isMapCached: function (mapName) {
        if (this.map && this.map[mapName]) {
            return true;
        }
        return false;
    },
    loadEchartMap: function (mapName = 'china') {
        actions.getEchartMap(mapName);
    },
    eChartMapLoadedCallback: function (mapName, callback) {
        if (this.isMapCached(mapName)) {
            var mapJson = this.getMap(mapName);
            callback(mapJson);
        } else {
            actions.getEchartMap(mapName, callback);
        }
    },
    onGetEchartMapSuccess: function (data, mapName) {
        this.setMap(data, mapName);
        this.trigger('getEchartMapSuccess', data);
    }
});

module.exports = ReChartStore;
