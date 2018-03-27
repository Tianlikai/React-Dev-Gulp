/**
 * 是否超过10000像素
 */
const isOverFlow10000px = (data) => {
    if (!data) {
        return true;
    }
    let { x, y, legend, plot_type } = data;
    switch (plot_type) {
        case 1:
            if (!legend.length) {
                return y.length * 59 + 300 > 10000;
            } else {
                let gridGap = this.getLegendHeight(legend, 1280);
                return (38 * x.length + 50) * y.length + 300 + (gridGap.y - 140) > 10000;
            }
            break;
        case 2:
            if (!legend.length) {
                return x.length * 59 + 200 > 10000;
            } else {
                return (38 * y.length + 50) * x.length + 200 > 10000;
            }
            break;
        case 3:
            return 100 * x.length + 200 > 10000;
            break;
        case 6:
            if (!legend.length) {
                return false;
            } else {
                let gridGap = this.getLegendHeight(legend, 1280);
                return (38 * x.length + 50) * y.length + 300 + (gridGap.y - 140) > 10000;
            }
            break;
        case 7:
            if (!legend.length) {
                return false;
            } else {
                return (38 * y.length + 50) * x.length + 200 > 10000;
            }
            break;
        default:
            break;
    }
}

export default isOverFlow10000px;