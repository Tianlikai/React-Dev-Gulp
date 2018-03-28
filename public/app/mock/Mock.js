import Mock from 'mockjs';
import QS from 'qs';
import deepClone from '../common/utils/deepClone';

const printParams = (req) => {
    console.log(`api : ${req.url}`);
    console.log(`type : ${req.type}`);
    console.log(`body : ${req.body}`);
}
const getResultModel = (errcode, res) => {
    if (!errcode) {
        let Ok = {
            errcode: 0,
            status: 0,
            result: res
        }
        console.table(Ok)
        return Ok
    } else {
        let Fail = {
            errcode: errcode,
            status: 1,
            errmsg: res
        }
        console.table(Fail)
        return Fail;
    }
}
let USER_KEY = {
    0: { username: 'admin', password: 'admin' },
    1: { username: 'user', password: 'user' }
}
let USER = {
    0: {
        email: 'admin',
        first_login: false,
        is_active: true,
        token: '1',
        user_type: 1, // 管理員
        username: 'admin',
        ds_ids: []
    },
    1: {
        email: 'user',
        first_login: false,
        is_active: true,
        token: '1',
        user_type: 2, // 普通用户
        username: 'user',
        ds_ids: [0, 1, 2, 3]
    }
}
let USER_AUTHORITY = {
    1: [2, 3, 4, 5, 6],
    2: []
}
let APPS = {
    2: {
        name: '供货预测'
    },
    4: {
        name: '销售线索'
    },
    5: {
        name: '业绩预测'
    },
    5: {
        name: '智能推荐'
    },
    6: {
        name: '推荐引擎'
    }
}
let DASHBOARD_LIST = {
    0: {
        id: 0,
        name: 'AAA-JASON',
        USER_id: '1'
    },
    1: {
        id: 1,
        name: 'AAA-LI',
        USER_id: '1'
    },
    2: {
        id: 2,
        name: 'AAA-JORDAN',
        USER_id: '1'
    },
    3: {
        id: 3,
        name: 'AAA-JAMES',
        USER_id: '0'
    },
}
let DASHBOARD_SHARE_LIST = {}
let CANVAS_LIST = {
    0: {
        id: 0,
        app_id: 0,
        dashboard_id: 0,
        beshared: 0,
        ds_id: 15,
        plot_type: 6,
        shared: 0,
        name: '柱状堆积图',
    }
}
let CANVASDATA = {
    errcode: 0,
    status: 0,
    result: {
        id: 1,
        app_id: 0,
        name: "柱状堆积图",
        plot_type: 6,
        sum: 51,
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
export const API_LOGIN = (req) => {
    printParams(req);
    let { user, password } = QS.parse(req.body);

    let User = Object.keys(USER_KEY);
    let check = User.findIndex((id) => {
        return USER_KEY[id].username === user && USER_KEY[id].password === password;
    });
    if (check >= 0) {
        return getResultModel(0, USER[check])
    } else {
        return getResultModel(1005, 'user: admin / user password: admin / user')
    }
}
export const API_GET_APPS = (req) => {
    printParams(req);
    let userType = localStorage.getItem('userType');
    let userAuthority = USER_AUTHORITY[userType];
    let list = [];
    if (!userAuthority.length) return getResultModel(0, { list });
    userAuthority.forEach((id) => {
        list.push(
            {
                id: id,
                name: APPS[id]
            }
        )
    });
    return getResultModel(0, { list })
}
export const API_GET_DS_LIST = (req) => {
    printParams(req);
    let email = localStorage.getItem('email');
    let User = Object.keys(USER);
    let userId = User.findIndex((id) => {
        return USER[id].email === email;
    });
    let list = [];
    let total = 0;
    let ds_ids = USER[userId].ds_ids;
    let dsList = deepClone(DASHBOARD_LIST);
    ds_ids.forEach((id) => {
        if (dsList[id].USER_id === `${userId}`) {
            dsList[id].beshared = 0;
            dsList[id].beshared_name = '';
        } else {
            dsList[id].beshared = 1;
            dsList[id].beshared_name = USER[dsList[id].USER_id].username;
        }
        list.push(dsList[id]);
    })
    return getResultModel(0, {
        list,
        total: list.length
    })
}
export const API_GET_CHART_LIST = (req) => {
    printParams(req);
    let { dashboard_id } = QS.parse(req.body);
    let list = [];
    let total = 0;
    for (let i in CANVAS_LIST) {
        if (CANVAS_LIST[i].dashboard_id === parseInt(dashboard_id)) list.push(CANVAS_LIST[i]);
    }
    return getResultModel(0, {
        list,
        total: list.length
    })
}
export {
    CANVASDATA
}

