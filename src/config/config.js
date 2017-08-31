module.exports = {
    productName: '数中数', // 产品名称
    minHeight: 768, // 设计：页面最小高度
    minHeight2: 650, // 设计：页面最小高度
    apps: [
        { id: -1, name: 'Dashboard' },
        { id: 0, name: '数据源管理' },
        { id: 1, name: '数据整理' },
        { id: 2, name: '供货预测' },
        { id: 3, name: '销售线索' }
    ],
    pageLimit: 20,
    pageLimit1: 10,
    pageLimit2: 1000,
    pageLimit3: 4, // Dashboard 滚动翻页，每页的条目数
    pageLimit4: 200, // Dashboard 滚动翻页，每页的条目数
    pageLimit5: 5000, // 数据权限-->角色 侧边列表
    port: 9988,
    dsSelectSize: 100,
    errcode: 162001, // 名称重复 错误码
    errcode2: 171002, // 应用的二级菜单未开通(销售热点)
    errmsg: '抱歉，出错了', // 默认错误提示消息
    noPermission: '您暂无此模块权限，若有需要请与管理员联系',
    letters: [
        { id: 'A', name: 'A' },
        { id: 'B', name: 'B' },
        { id: 'C', name: 'C' },
        { id: 'D', name: 'D' },
        { id: 'E', name: 'E' },
        { id: 'F', name: 'F' },
        { id: 'G', name: 'G' },
        { id: 'H', name: 'H' },
        { id: 'I', name: 'I' },
        { id: 'J', name: 'J' },
        { id: 'K', name: 'K' },
        { id: 'L', name: 'L' },
        { id: 'M', name: 'M' },
        { id: 'N', name: 'N' },
        { id: 'O', name: 'O' },
        { id: 'P', name: 'P' },
        { id: 'Q', name: 'Q' },
        { id: 'R', name: 'R' },
        { id: 'S', name: 'S' },
        { id: 'T', name: 'T' },
        { id: 'U', name: 'U' },
        { id: 'V', name: 'V' },
        { id: 'W', name: 'W' },
        { id: 'X', name: 'X' },
        { id: 'Y', name: 'Y' },
        { id: 'Z', name: 'Z' },
        { id: 'no', name: '#' }
    ],

    crud: [
        'create', // 增加
        'retrieve', // 读取查询
        'update', // 更新
        'delete' // 删除
    ],

    saleClues: {
        defaultColumns: { // 销售线索的默认字段
            project_created_at: '创建时间',
            project_sales: '关联销售',
            project_name: '项目名称'
        },
        defaultColumns2: { // M14版本设计变更-销售线索的默认字段
            project_created_at: { desc: '创建时间', flag: 0 },
            project_sales: { desc: '关联销售', flag: 0 },
            project_name: { desc: '项目名称', flag: 1 } // 只有项目名称默认为1
        },
        product: [ // 产品下拉框
            { id: 'all', name: '所有' },
            { id: 'product_ab', name: 'AnyBackup' },
            { id: 'product_as', name: 'AnyShare' },
            { id: 'product_dcos', name: 'DCOS' },
            { id: 'product_sds', name: 'SDS' }
        ],
        graph: [ // 图表类型
            { id: 1, name: '条形图' },
            { id: 2, name: '柱状图' },
            { id: 3, name: '折线图' }
        ],
        measure: [ // 度量方式
            { id: 1, name: '计数' },
            { id: 2, name: '总和' },
            { id: 3, name: '平均' },
            { id: 4, name: '最大值' },
            { id: 5, name: '最小值' }
        ],
        dateType: [ // 时间类型
            { id: 'year', name: '年' },
            { id: 'quarter', name: '季' },
            { id: 'month', name: '月' },
            { id: 'week', name: '周' },
            { id: 'day', name: '日' }
        ],
        condition: [ // 筛选条件
            { id: 'include', name: '包含(至少一个)' },
            { id: 'includeAll', name: '包含(所有)' },
            { id: 'exclude', name: '不包含' },
            { id: 'between', name: '介于' },
            { id: 'notbetween', name: '不介于' },
            { id: 'scope', name: '绝对' },
            { id: 'relative', name: '相对' },
            { id: 'equal', name: '等于' },
            { id: 'notequal', name: '不等于' }
        ],
        isInclude: [ // 字符串类型
            { id: 'include', name: '包含(至少一个)' },
            { id: 'includeAll', name: '包含(所有)' },
            { id: 'exclude', name: '不包含' },
            { id: 'equal', name: '等于' },
            { id: 'notequal', name: '不等于' }
        ],
        isBetween: [ // 数值类型
            { id: 'between', name: '介于' },
            { id: 'notbetween', name: '不介于' },
            { id: 'equal', name: '等于' },
            { id: 'notequal', name: '不等于' }
        ],
        dateScope: [ // 时间类型
            { id: 'scope', name: '绝对' },
            { id: 'relative', name: '相对' }
        ],
        // 当度量方式为“计数”时，后面的选择框添加“总数”
        defaultMeasureColData: [
            { name: '总数', id: 'fx_total', type: 'int' }
        ],
        deskColName: ['area_ids', 'industry_id'],
        deskCol: [
            { col_desc: '数中数区域', col_name: 'area_ids', col_type: 'desk51' }
            // { col_desc: '51DESK行业', col_name: 'industry_id', col_type: 'desk51' }
        ],
        deskCond: [ // 51DESK区域，51DESK行业
            { id: 'equal', name: '等于' }
        ],
        pushRule: { // 推送规则
            col: [
                { id: 'industry', name: '行业-KOM' }
            ],
            att: [
                { id: 'new_num', name: '最小新增项目数', type: 'int' },
                { id: 'new_add', name: '最小新增项目增幅', type: 'percent' }
            ]
        },
        relativeTime: [
            { id: '7', name: '近7天' },
            { id: '30', name: '近30天' },
            { id: '90', name: '近90天' },
            { id: '365', name: '近365天' }
        ],
        importStatus: [
            { id: 1, name: '导入' },
            { id: 2, name: '不导入' }
        ],
        importStatus2: [
            { id: 1, name: '导入' },
            { id: 2, name: '不导入' },
            { id: 0, name: '未设置' }
        ]
    },
    dashboard: {
        errcode: 163001, // 画布不存在-错误码
        chart1: {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '6%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                name: '',
                nameLocation: 'middle',
                nameGap: 25,
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                name: '',
                type: 'category',
                data: [],
                axisLabel: {
                    formatter: function (value) {
                        if (value && value.length > 10) {
                            return value.substring(0, 7) + '...';
                        }
                        return value;
                    }
                }
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    filterMode: 'filter',
                    xAxisIndex: 0,
                    showDetail: false,
                    showDataShadow: false
                }
            ],
            series: [
                {
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#FB6271'
                        }
                    },
                    data: []
                }
            ]
        },
        colorArray: [
            '#FB6271',
            '#F0AF44',
            '#5CB3D9',
            '#F96E51',
            '#55C2C5',
            '#5295D9',
            '#FD7A7A',
            '#FE9B6A',
            '#F4D93E',
            '#EC9AF9',
            '#ED5DBB',
            '#94D8B3',
            '#1BB691',
            '#5A99E5',
            '#C6AAFF',
            '#F99C86',
            '#EEAA3B',
            '#8980EC',
            '#ED7940',
            '#78C657'
        ]
    },
    dataPermission: {
        condition: [ // 筛选条件
            { id: 'equal', name: '等于' },
            { id: 'notequal', name: '不等于' },
            { id: 'include', name: '包含(至少一个)' },
            { id: 'includeAll', name: '包含(所有)' },
            { id: 'exclude', name: '不包含' },
            { id: 'between', name: '介于' },
            { id: 'notbetween', name: '不介于' },
            { id: 'scope', name: '绝对' }
        ],
        isInclude: [ // 字符串类型
            { id: 'empty', name: '空' },
            { id: 'equal', name: '等于' },
            { id: 'notequal', name: '不等于' },
            { id: 'include', name: '包含(至少一个)' },
            { id: 'includeAll', name: '包含(所有)' },
            { id: 'exclude', name: '不包含' }
        ],
        isInclude2: ['include', 'exclude'],
        isBetween: [ // 数值类型
            { id: 'empty', name: '空' },
            { id: 'equal', name: '等于' },
            { id: 'notequal', name: '不等于' },
            { id: 'between', name: '介于' },
            { id: 'notbetween', name: '不介于' }
        ],
        isBetween2: ['between', 'notbetween'],
        dateScope: [ // 时间类型
            { id: 'empty', name: '空' },
            { id: 'scope', name: '绝对' }
        ],
        isEqual: ['equal', 'notequal'],
        selectedDataType: [
            -1, // 用户输入
            0, // 字符串数组
            1 // 对象数组
        ]
    },
    systemSettings: {
        protocol: ['http', 'https']
    }
};
