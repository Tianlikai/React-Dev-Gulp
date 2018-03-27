const transitionToRoot = (type = '') => {
    if (type === 'user') {
        // 调转到 普通用户平台
        this.transitionTo('/main/Dashboard');
    } else if (type === 'admin') {
        // 调转到 管理员平台
        this.transitionTo('/admin/RoleManagement');
    } else {
        let loc = window.location;
        let port = loc.port ? ':' + loc.port : '';
        let url = loc.protocol + '//' + loc.hostname + port + '/';
        window.location.replace(url);
    }
}

export default transitionToRoot