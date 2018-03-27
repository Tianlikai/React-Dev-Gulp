/**
 * 系统表单验证信息映射关系数据
 *
 * Created by Administrator on 2016/5/16.
 */

'use strict';

var lang = require('../lang');

if (lang() == 'en') {
    module.exports = {
        resetpass_form: {
            normalRPPassword: {
                required: '请输入密码',
                min_6: '长度只能在6-20个字符之间',
                max_20: '长度只能在6-20个字符之间'
            },
            normalRPRePassword: {
                required: '请再次输入密码',
                min_6: '长度只能在6-20个字符之间',
                max_20: '长度只能在6-20个字符之间',
                eq_normalRPPassword: '两次输入的密码不一致，请重新输入'
            }
        },
        register_form: {
            firstname: {
                required: '请输入真实的姓',
                onlychartdis: '真实姓名中包含不符合规范的字符',
                min_1: '请输入真实的姓，长度1-40个',
                max_40: '请输入真实的姓，长度1-40个',
                userName: '真实姓名中包含不符合规范的字符'
            },
            lastname: {
                required: '请输入真实的名',
                onlychartdis: '真实姓名中包含不符合规范的字符',
                min_1: '请输入真实的名，长度1-40个',
                max_40: '请输入真实的名，长度1-40个',
                userName: '真实姓名中包含不符合规范的字符'
            },
            password: {
                required: '请输入密码',
                min_6: '长度只能在6-20个字符之间',
                max_20: '长度只能在6-20个字符之间',
                neq_email: '密码与注册邮箱相似，有被盗风险，请更换密码'
            },
            repassword: {
                required: '请再次输入密码',
                eq_password: '两次输入的密码不一致，请重新输入'
            },
            orgname: {
                required: '公司名称长度只能在4-40为字符之间',
                min_4: '请填写工商注册的全称。4-40位字符，可由中英文、数字、（）、()、_、— 组成',
                max_40: '请填写工商注册的全称。4-40位字符，可由中英文、数字、（）、()、_、— 组成'
            },
            email: {
                required: '请输入邮箱',
                email: '格式错误'
            },
            phone: {
                required: '请输入联系方式',
                phone: '格式错误'
            }
        },
        input_validation: {
            input_validation_hint_type1: {
                hint: '支持1-30位中英文、数字、“-_()（）.，、”的字符组合',
                maxLength: 30,
                errhint1: '仅支持“-_()（）.，、”7种字符',
                errhint2: '仅支持1-30位字符',
            },
            input_validation_hint_type2: {
                hint: '支持1-20位中英文、数字、“-_()（）.，、”的字符组合',
                maxLength: 20,
                errhint1: '仅支持“-_()（）.，、”7种字符',
                errhint2: '仅支持1-20位字符',
            },
            input_validation_hint_type3: {
                hint: '支持1-15位中英文、数字的字符组合',
                maxLength: 15,
                errhint1: '不支持任何符号',
                errhint2: '仅支持1-15位字符',
            },
            input_validation_hint_type4: {
                hint: '支持1-15位中英文、数字、“-_()（）.，、”的字符组合',
                maxLength: 15,
                errhint1: '仅支持“-_()（）.，、”7种字符',
                errhint2: '仅支持1-15位字符',
            },
            input_validation_hint_type5: {
                hint: '支持1-10位的中文、英文、数字、-（短横线）、_（下划线）、（）（括号）',
                maxLength: 10,
                errhint1: '仅支持中文、英文、数字、-、_、（）',
                errhint2: '仅支持1-10位字符',
            },
        }
    };
} else {
    module.exports = {
        resetpass_form: {
            normalRPPassword: {
                required: '请输入密码',
                min_6: '长度只能在6-20个字符之间',
                max_20: '长度只能在6-20个字符之间'
            },
            normalRPRePassword: {
                required: '请再次输入密码',
                min_6: '长度只能在6-20个字符之间',
                max_20: '长度只能在6-20个字符之间',
                eq_normalRPPassword: '两次输入的密码不一致，请重新输入'
            }
        },
        register_form: {
            firstname: {
                required: '请输入真实的姓',
                onlychartdis: '真实姓名中包含不符合规范的字符',
                min_1: '请输入真实的姓，长度1-40个',
                max_40: '请输入真实的姓，长度1-40个',
                userName: '真实姓名中包含不符合规范的字符'
            },
            lastname: {
                required: '请输入真实的名',
                onlychartdis: '真实姓名中包含不符合规范的字符',
                min_1: '请输入真实的名，长度1-40个',
                max_40: '请输入真实的名，长度1-40个',
                userName: '真实姓名中包含不符合规范的字符'
            },
            password: {
                required: '请输入密码',
                min_6: '长度只能在6-20个字符之间',
                max_20: '长度只能在6-20个字符之间',
                neq_email: '密码与注册邮箱相似，有被盗风险，请更换密码'
            },
            repassword: {
                required: '请再次输入密码',
                eq_password: '两次输入的密码不一致，请重新输入'
            },
            orgname: {
                required: '公司名称长度只能在4-40为字符之间',
                min_4: '请填写工商注册的全称。4-40位字符，可由中英文、数字、（）、()、_、— 组成',
                max_40: '请填写工商注册的全称。4-40位字符，可由中英文、数字、（）、()、_、— 组成'
            },
            email: {
                required: '请输入邮箱',
                email: '格式错误'
            },
            phone: {
                required: '请输入联系方式',
                phone: '格式错误'
            }
        },
        input_validation: {
            input_validation_hint_type1: {
                hint: '支持1-30位中英文、数字、“-_()（）.，、”的字符组合',
                maxLength: 30,
                errhint1: '仅支持“-_()（）.，、”7种字符',
                errhint2: '仅支持1-30位字符',
            },
            input_validation_hint_type2: {
                hint: '支持1-20位中英文、数字、“-_()（）.，、”的字符组合',
                maxLength: 20,
                errhint1: '仅支持“-_()（）.，、”7种字符',
                errhint2: '仅支持1-20位字符',
            },
            input_validation_hint_type3: {
                hint: '支持1-15位中英文、数字的字符组合',
                maxLength: 15,
                errhint1: '不支持任何符号',
                errhint2: '仅支持1-15位字符',
            },
            input_validation_hint_type4: {
                hint: '支持1-15位中英文、数字、“-_()（）.，、”的字符组合',
                maxLength: 15,
                errhint1: '仅支持“-_()（）.，、”7种字符',
                errhint2: '仅支持1-15位字符',
            },
            input_validation_hint_type5: {
                hint: '支持1-10位的中文、英文、数字、-（短横线）、_（下划线）、（）（括号）',
                maxLength: 10,
                errhint1: '仅支持中文、英文、数字、-、_、（）',
                errhint2: '仅支持1-10位字符',
            },
        }
    };
}
