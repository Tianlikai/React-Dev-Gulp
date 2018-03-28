import getFirstLetter from './getFirstLetter';

// 初始化分组
export const initGroups = () => {
    return {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
        K: [],
        L: [],
        M: [],
        N: [],
        O: [],
        P: [],
        Q: [],
        R: [],
        S: [],
        T: [],
        U: [],
        V: [],
        W: [],
        X: [],
        Y: [],
        Z: [],
        no: []
    };
}
/**
 * 角色分组
 * @param {*} data 
 */
const divideGroups = (data, letters) => {
    let groups = initGroups();
    let type; // 分组类型，A-Z或者 'no'
    let flag;
    for (let i = 0, j = data.length; i < j; i++) {
        flag = true; // 角色拼音首字母是否在 A-Z 里面，默认不在
        type = getFirstLetter(data[i].name).substring(0, 1).toUpperCase();
        for (let x = 0, y = letters.length; x < y; x++) {
            if (type === letters[x].id) {
                flag = false;
                groups[type].push(data[i]);
                break;
            }
        }
        if (flag) {
            // 角色拼音首字母不在 A-Z 里面
            groups.no.push(data[i]);
        }
    }
    return groups;
}

export default divideGroups;