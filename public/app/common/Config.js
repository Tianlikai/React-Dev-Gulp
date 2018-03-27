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
    pageLimit6: 12, // dashboard详情页 表格
    port: 9988,
    dsSelectSize: 100,
    errcode: 162001, // 名称重复 错误码
    errcode2: 171002, // 应用的二级菜单未开通(销售热点)
    errmsg: '抱歉，出错了', // 默认错误提示消息
    noPermission: '您暂无此模块权限，若有需要请与管理员联系',
    First_level_administrative_region: [
        '黑龙江',
        '吉林',
        '辽宁',
        '北京',
        '天津',
        '河北',
        '山西',
        '内蒙古',
        '山东',
        '江苏',
        '安徽',
        '上海',
        '浙江',
        '江西',
        '福建',
        '河南',
        '湖北',
        '湖南',
        '广东',
        '广西',
        '海南',
        '新疆',
        '甘肃',
        '宁夏',
        '青海',
        '陕西',
        '重庆',
        '四川',
        '贵州',
        '云南',
        '西藏',
        '香港',
        '澳门',
        '台湾'
    ], // 中国一级城市
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
        datePeriodType: [ // 日期阶段类型
            { id: 'Y', name: '年' },
            { id: 'Y-Q', name: '年-季' },
            { id: 'Y-M', name: '年-月' },
            { id: 'Y-W', name: '年-周' },
            { id: 'Y-D', name: '年-月-日' },
            {
                'Y': '年',
                'Y-Q': '年-季',
                'Y-M': '年-月',
                'Y-W': '年-周',
                'Y-D': '年-月-日'
            }
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
        supportType: [
            'tinyint',
            'smallint',
            'mediumint',
            'int',
            'bigint',
            'float',
            'double',
            'decimal'
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
        conditionObj: { // 筛选条件
            equal: '等于',
            notequal: '不等于',
            include: '包含(至少一个)',
            includeAll: '包含(所有)',
            exclude: '不包含',
            between: '介于',
            notbetween: '不介于',
            scope: '绝对'
        },
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
    },
    TrainingCycle: [
        { name: '仅一次', type: 1 },
        { name: '月', type: 2 },
        { name: '周', type: 3 },
        { name: '日', type: 4 }
    ],
    TrainingCycleTime: {
        Week: [
            { name: '周一', WeekNumber: 1 },
            { name: '周二', WeekNumber: 2 },
            { name: '周三', WeekNumber: 3 },
            { name: '周四', WeekNumber: 4 },
            { name: '周五', WeekNumber: 5 },
            { name: '周六', WeekNumber: 6 },
            { name: '周日', WeekNumber: 7 },
        ],
        Day: [
            { name: '1' },
            { name: '2' },
            { name: '3' },
            { name: '4' },
            { name: '5' },
            { name: '6' },
            { name: '7' },
            { name: '8' },
            { name: '9' },
            { name: '10' },
            { name: '11' },
            { name: '12' },
            { name: '13' },
            { name: '14' },
            { name: '15' },
            { name: '16' },
            { name: '17' },
            { name: '18' },
            { name: '19' },
            { name: '20' },
            { name: '21' },
            { name: '22' },
            { name: '23' },
            { name: '24' },
            { name: '25' },
            { name: '26' },
            { name: '27' },
            { name: '28' },
        ],
        Hour: [
            { name: '0' },
            { name: '1' },
            { name: '2' },
            { name: '3' },
            { name: '4' },
            { name: '5' },
            { name: '6' },
            { name: '7' },
            { name: '8' },
            { name: '9' },
            { name: '10' },
            { name: '11' },
            { name: '12' },
            { name: '13' },
            { name: '14' },
            { name: '15' },
            { name: '16' },
            { name: '17' },
            { name: '18' },
            { name: '19' },
            { name: '20' },
            { name: '21' },
            { name: '22' },
            { name: '23' },
        ],
        Minute: [
            { name: '0' },
            { name: '1' },
            { name: '2' },
            { name: '3' },
            { name: '4' },
            { name: '5' },
            { name: '6' },
            { name: '7' },
            { name: '8' },
            { name: '9' },
            { name: '10' },
            { name: '11' },
            { name: '12' },
            { name: '13' },
            { name: '14' },
            { name: '15' },
            { name: '16' },
            { name: '17' },
            { name: '18' },
            { name: '19' },
            { name: '20' },
            { name: '21' },
            { name: '22' },
            { name: '23' },
            { name: '24' },
            { name: '25' },
            { name: '26' },
            { name: '27' },
            { name: '28' },
            { name: '29' },
            { name: '30' },
            { name: '31' },
            { name: '32' },
            { name: '33' },
            { name: '34' },
            { name: '35' },
            { name: '36' },
            { name: '37' },
            { name: '38' },
            { name: '39' },
            { name: '40' },
            { name: '41' },
            { name: '42' },
            { name: '43' },
            { name: '44' },
            { name: '45' },
            { name: '46' },
            { name: '47' },
            { name: '48' },
            { name: '49' },
            { name: '50' },
            { name: '51' },
            { name: '52' },
            { name: '53' },
            { name: '54' },
            { name: '55' },
            { name: '56' },
            { name: '57' },
            { name: '58' },
            { name: '59' },
        ]
    },
    ModelDrilling: {
        example:
        `{
    "errcode": 0, 
    "result": {
        "rec_obj": [
               {
                    "obj_id": "ee01514e-1104-44d8-a69f-5ebe4327f8a9",
                    "value": 1
               },
               {
                    "obj_id": "6c100ca6-a429-4cdd-9885-f35e823487c3",
                    "value": 1
               },
               {
                    "obj_id": "78296e59-b4a9-4164-b309-010e87a3b1e6",
                    "value": 1
               },
               {
                    "obj_id": "98228b9a-39a1-4e76-86f8-56c4b37d3d70",
                    "value": 1
               },
               {
                    "obj_id": "06a55dfe-f4e7-4c97-85f6-d0f752396769",
                    "value": 0.7342934748
               },
               {
                    "obj_id": "ceb8ad5b-6d40-4747-889f-aa6bdd7456d4",
                    "value": 0.6336206897
               },
               {
                    "obj_id": "658f3b3e-40d5-4a2b-a9f9-ee4d403706cb",
                    "value": 0.5040328118
               },
               {
                    "obj_id": "8caf658b-a23f-4cca-bb1c-8847ccf260c6",
                    "value": 0.5
               },
               {
                    "obj_id": "dc121584-8919-4027-9c35-07201806e11f",
                    "value": 0.4233547527
               },
               {
                    "obj_id": "3347bb1f-0e70-4497-b528-35d570efdaad",
                    "value": 0.3735717834
               },

        ],
        "total": 88, 
        "user_id": "016688a4-75d0-11e7-a292-00163e01020f"
    }, 
    "status": 0
                        
}`
    }
};
