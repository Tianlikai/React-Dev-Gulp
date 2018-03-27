import Mock from 'mockjs';
import QS from 'qs';

const arae = [
    '黑龙江',
    '吉林',
    '辽宁',
    '河北',
    '河南',
    '山东',
    '江苏',
    '山西',
    '陕西',
    '甘肃',
    '四川',
    '青海',
    '湖南',
    '湖北',
    '江西',
    '安徽',
    '浙江',
    '福建',
    '广东',
    '广西',
    '贵州',
    '云南',
    '海南',
    '内蒙古',
    '新疆维吾尔族自治区',
    '宁夏回族自治区',
    '西藏',
    '宁夏回族自治区',
    '北京',
    '天津',
    '上海',
    '重庆',
    '香港',
    '澳门'
]
const USER = {
    errcode: 0,
    status: 0,
    result: {
        eid: '111',
        email: 'jason.tian@eisoo.com',
        ename: '田力凯-开发环境-企业',
        first_login: false,
        id: 550,
        is_active: true,
        lae_host: 'http:/172.20.6.42:9988',
        orgid: 295,
        token: '123',
        uid: 550,
        user_type: 2,
        username: 'jason.tian'
    }
}
const LOGIN_FAILURE = {
    errcode: 1005,
    status: 1,
    errmsg: 'Incorrect Username or Password'
}
const APPS = {
    errcode: 0,
    status: 0,
    result: {
        list: [
            { id: 5, name: '智能推荐' },
            { id: 2, name: '供货预测' },
            { id: 3, name: '销售线索' },
            { id: 4, name: '业绩预测' },
            { id: 6, name: '推荐引擎' }
        ]
    }
}
const LIST = {
    errcode: 0,
    status: 0,
    result: {
        list: [
            {
                beshared: 0,
                beshared_name: '',
                id: 412,
                name: 'AAA-JASON'
            },
            {
                beshared: 0,
                beshared_name: '',
                id: 413,
                name: 'AAA-LI'
            },
            {
                beshared: 0,
                beshared_name: '',
                id: 414,
                name: 'AAA-JORDAN'
            },
            {
                beshared: 1,
                beshared_name: 'JAMES',
                id: 415,
                name: 'AAA-JAMES'
            }
        ],
        total: 0
    }
}
const DASHBOARDdLIST = {
    errcode: 0,
    status: 0,
    result: {
        list: [
            {
                app_id: 0,
                beshared: 0,
                dashboard_id: 412,
                ds_id: 15,
                id: 1,
                name: '柱状堆积图',
                plot_type: 6,
                shared: 0
            }
        ],
        total: 0
    }
}
const CANVASDATA = {
    errcode: 0,
    status: 0,
    result: {
        app_id: 0,
        condition: [{
            col_desc: "职位",
            col_name: "job",
            col_type: "text",
            cond: "equal",
            value: ['产品营销工程师', '系统维护工程师', '售前主管', '技术经理', '区域产品经理', '行业销售', '销售助理']
        }],
        dimension: {
            measure: {
                col_desc: "总数",
                col_name: "fx_total",
                col_type: "int",
                method: 1
            },
            newGroup:
            [{
                col_desc: "职位",
                col_name: "job",
                col_type: "text",
                cond_second: ""
            },
            {
                col_desc: "文章标题",
                col_name: "title",
                col_type: "text",
                cond_second: ""
            }]
        },
        drill: {
            drill_condition: [
                {
                    col_desc: "partner_desc",
                    col_name: "partner_desc",
                    col_type: "varchar",
                    format: "",
                    plot_type: 2
                },
                {
                    charttype: "条形图",
                    col_desc: "action",
                    col_name: "action",
                    col_type: "varchar",
                    format: "",
                    plot_type: 1
                }
            ]
        },
        drill_values: [],
        ds_id: 15,
        filter_key: "job,title",
        groupNum: 2,
        group_type: ["text", "text"],
        hasData: 0,
        id: 1,
        legend: [
            "2017新品解读视频——AnyBackup 6.0 夯实高端数据保护技术",
            "2017新品解读视频——AnyRobot 2.0开启 IT 运营的日志云",
            "2017新品解读视频——AnyShare Family 6.0统一的文档云",
            "2017新品解读视频——AnyShare 运营服务 助力文档管理",
            "2017新品解读视频——AnyVM 5.0 高性能的超融合存储",
            "ASC新版本：多人在线编辑和强大插件功能",
            "b2b2c",
            "Proverb",
            "【人物专栏——武灵芝】安全新台阶，AnyShare新增安全应用场景介绍",
            "【医疗行业】数据中心升级整体解决方案销售指南 ? 深度解读",
            "【深度干货】AnyRobot 与监控产品的竞争差异",
            "【深度干货】企业行业——智能制造两化融合趋势下销售线索（一）",
            "【深度干货】企业行业——智能制造两化融合趋势下销售线索（二）",
            "【爱数主播】保护智慧城市政务数据，这个方案亮点足",
            "【讲师专栏 周杰】XX竞品分析及竞争策略",
            "一个10万用户规模的PB级教育云盘案例",
            "内容家2.2.6版本新功能介绍",
            "尊尚Z3第二版全新上市",
            "爱数云服务商合作伙伴认证通知",
            "蓝光归档，数据保护与归档的完美结合"
        ],
        name: "柱状堆积图",
        plot_type: 6,
        slicer: {
            data: [
                {
                    col_desc: "公司名称",
                    col_name: "company_name",
                    col_type: "text",
                    format: ""
                },
                {
                    col_desc: "职位",
                    col_name: "job",
                    col_type: "text",
                    format: ""
                }]
        },
        sum: 51,
        x: [
            [1, 1, 1, 1, 0, 0, 1],
            [1, 0, 0, 3, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 1],
            [1, 2, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 1],
            [0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 1, 0],
            [0, 1, 0, 2, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 1],
            [0, 2, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 1, 5, 1, 2, 1],
            [0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [1, 1, 2, 1, 1, 0, 0],
            [0, 1, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 1]
        ],
        x_name: "总数",
        y: [
            "产品营销工程师",
            "区域产品经理",
            "售前主管",
            "技术经理",
            "系统维护工程师",
            "行业销售",
            "销售助理"
        ],
        y_name: "职位,文章标题",
    }
}
const adminApps = {
    errcode: 0,
    status: 0,
    result: {
        list: [
            { id: 6, name: '推荐引擎' }
        ]
    }
}
const adminList = {
    errcode: 0,
    status: 0,
    result: {
        list: [
            {
                desc: '默认管理员',
                id: 0,
                name: '管理员'
            }
        ],
        total: 0
    }
}
const permission = {
    errcode: 0,
    status: 0,
    result: {}
}
const admintasks = {
    errcode: 0,
    status: 0,
    result: {
        list: []
    }
}
const reTasks = {
    errcode: 0,
    status: 0,
    result: {
        list: [
            {
                columns: {
                    alg: 'usercf',
                    items: '100',
                    model_id: 'ab',
                    online: '0',
                    runtime: ''
                },
                created_at: 'today',
                ds_id: 19,
                ds_name: '李佳慧',
                name: '212',
                status: 10,
                status_desc: '已完成',
                tid: 1
            },
            {
                columns: {
                    alg: 'usercf',
                    items: '100',
                    model_id: 'wwe',
                    online: '0',
                    runtime: ''
                },
                created_at: 'today',
                ds_id: 19,
                ds_name: '田力凯',
                name: '213',
                status: 10,
                status_desc: '已完成',
                tid: 2
            },
            {
                columns: {
                    alg: 'usercf',
                    items: '100',
                    model_id: 'dsa',
                    online: '1',
                    runtime: ''
                },
                created_at: 'today',
                ds_id: 19,
                ds_name: 'dalong',
                name: '215',
                status: 10,
                status_desc: '失败',
                tid: 3
            },
            {
                columns: {
                    alg: 'usercf',
                    items: '100',
                    model_id: 'eqweqw',
                    online: '1',
                    runtime: ''
                },
                created_at: 'today',
                ds_id: 19,
                ds_name: 'qweqweqweqw',
                name: '217',
                status: 10,
                status_desc: '失败',
                tid: 4
            },
            {
                columns: {
                    alg: 'usercf',
                    items: '100',
                    model_id: 'eqw321312eqw',
                    online: '0',
                    runtime: ''
                },
                created_at: 'today',
                ds_id: 19,
                ds_name: 'qweqweqweqw',
                name: '123',
                status: 10,
                status_desc: '运行中',
                tid: 5
            }
        ]
    }
}
const ORIENT = {
    errcode: 0,
    status: 0,
    result: {
        count: 0,
        jobs: []
    }
}
const INDUS = {
    errcode: 0,
    status: 0,
    result: {
        industry: [
            { id: 1069, name: "互联网金融" },
            { id: 1082, name: "在线教育" },
            { id: 3001, name: "普通教育" },
            { id: 3002, name: "高等教育" },
            { id: 3003, name: "医院" },
            { id: 3004, name: "在线教育集成商" },
            { id: 3005, name: "互联网金融集成商" },
            { id: 3006, name: "其他集成商" },
            { id: 3007, name: "游戏" }
        ]
    }
}
let indusDataTemplate = {
    errcode: 0,
    status: 0,
    result: {
        date: 1511951274,
        'clients|20': [{
            'name': '@EMAIL',
            'arae|1': arae,
            'industry_id': 3012,
            'type': '银行',
            'id|1-9999999999': 1,
            'score|1-100': 1,
        }],
        clients_count: 200,
        source: 'orient_recommend'
    }
}
let INDUSDATA = Mock.mock(indusDataTemplate);

export const API_UESR = (req) => {
    console.log(`api : ${req.url}`);
    console.log(`type : ${req.type}`);
    console.log(`body : ${req.body}`);
    console.table(USER)
    let { user, password } = QS.parse(req.body);
    if (user === 'user' && password === '123') return USER;
    return LOGIN_FAILURE;
}

export {
    APPS,
    LIST,
    DASHBOARDdLIST,
    CANVASDATA,
    ORIENT,
    INDUS,
    INDUSDATA
}

