import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom'
import PageMethod from '../../../../common/PageMethod';
import UtilStore from '../../../../stores/UtilStore';
import ChartDetail from '../ChartDetail';

//新建或者编辑仪表盘-模态框
class DetailPage extends PureComponent {
    constructor(props) {
        super(props);
        this.onBack = this.onBack.bind(this);
    }
    componentDidMount() {
        this.unsubscribe1 = UtilStore.listen(this.pubsub, this);
    }
    componentWillUnmount() {
        this.unsubscribe1();
    }
    pubsub(type, data, from) {
        if (type === 'updateHeight') {
            let pageContent = ReactDOM.findDOMNode(this.refs.content);
            if (pageContent) {
                pageContent.style.height = PageMethod.getInnerHeight2() + 'px';
            }
        }
    }
    // 返回Main页面
    onBack() {
        if (this.props.onChangeActivePage) this.props.onChangeActivePage('Main');
    }
    renderTitleDiv() {
        return (
            <div
                className='titleDiv'>
                <h2>
                    查看详情
            </h2>
                <div className='btnGroup'>
                    <button type='button' className='btn add'
                        onClick={this.onBack}>
                        返回
                </button>
                </div>
            </div>
        );
    }
    render() {
        let minheights = PageMethod.getInnerHeight2();
        let titleDiv = this.renderTitleDiv();
        return (
            <div className='chartDetail-page'>
                {titleDiv}
                <div ref='content' className='content' style={{ height: minheights }}>
                    <ChartDetail
                        name={this.props.name}
                        pageLimit={this.props.pageLimit}
                        showCondition={true}
                    />
                </div>
            </div>
        );
    }
}
DetailPage.propTypes = {
    onBack: React.PropTypes.func, // 返回
    name: React.PropTypes.string, // 祖先页面名称('CreatedByMe', 'FromSharing')
    pageLimit: React.PropTypes.number
};

export default DetailPage;