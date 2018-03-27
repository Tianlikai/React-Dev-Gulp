// 根据id和data获取名称
const getNameById = (id = '', data = []) => {
    let name = '';
    for (let i = 0, j = data.length; i < j; i++) {
        if (data[i].id === id) {
            name = data[i].name;
            break;
        }
    }
    return name;
}

export default getNameById;