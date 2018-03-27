'use strict';

module.exports = {
    url: /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    number: /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    numberOrNull: /^\d{0,}$/,
    // 'date': /^(\d{4})-(\d{2})-(\d{2})$/,
    alpha: /^[a-z ._-]+$/i,
    alphanum: /^[a-z0-9_]+$/i,
    password: /^[\x00-\xff]+$/,
    integer: /^[-+]?[0-9]+$/,
    tel: /^[\d\s \+().-]+$/,
    hex: /^#[0-9a-f]{6}?$/i,
    rgb: new RegExp('^rgb\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*\\)$'),
    rgba: new RegExp('^rgba\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*((0.[1-9]*)|[01])\\s*\\)$'),
    hsv: new RegExp('^hsv\\(\\s*(0|[1-9]\\d?|[12]\\d\\d|3[0-5]\\d)\\s*,\\s*((0|[1-9]\\d?|100)%)\\s*,\\s*((0|[1-9]\\d?|100)%)\\s*\\)$'),
    sampleName: /^[\\(\\)\\（\\）a-zA-Z0-9\u4e00-\u9fa5]+$/,
    companyName: /^[\\(\\)\\（\\）a-zA-Z0-9\u4e00-\u9fa5]+$/,
    companyWebsite: /^[a-z0-9\u4e00-\u9fa5:\.#/-]+$/i,
    companyAddr: /^[-#\+()\sa-z0-9\u4e00-\u9fa5]+$/i,
    companyPhone: /^[\d\s() \+.-]+$/,
    userPhone: /^1[2|3|4|5|6|7|8|9]\d{9}$/,
    userName: /^[a-z\u4e00-\u9fa5]+$/i,
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
    // 定向推荐，用户自定义区域或者行业名称
    sliderName: /^[0-9a-z\u4e00-\u9fa5_-]+$/i,
    nameAll: /^[()（）0-9a-z\u4e00-\u9fa5_-]+$/i,
    // 支持中文、英文、数字
    columnExplain: /^[0-9a-z\u4e00-\u9fa5]+$/i,
    objRegExpDay: /^([1-9]{0,1}|(1[0-9]){0,2}|(2[0-8]){0,2})$/, // 匹配1-28号
    objRegExpHour: /^([0-9]{0,1}|(1[0-9]){0,2}|(2[0-3]){0,2})$/, // 匹配0-23小时
    objRegExpMin: /^([0-9]{0,1}|(1[0-9]){0,2}|(2[0-9]){0,2}|(3[0-9]){0,2}|(4[0-9]){0,2}|(5[0-9]){0,2})$/, // 匹配0-59分钟
};
