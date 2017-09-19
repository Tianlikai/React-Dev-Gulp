项目目录
----
```
├── node_modules:       模块
|   └── ...
├── dist:               打包生成目录
|   ├── css:            css目录
|   ├── img:            img目录
|   ├── js:             js目录
├── src:                开发环境
|   |── actoins:        action方法
|   ├── comonents:      UI组件目录
|   ├── config:         配置文件目录
|   ├── css:            项目样式
|   ├── images:         images目录
|   ├── mock:           数据Mock
|   ├── routes:         路由组件
|   ├── service:        项目接口
|   ├── stores:         stores文件
|   └── Util:           工具函数
├── package.json:       npm 配置文件
├── .eslintrc.js:       eslint配置文件
├── gulpfile.js:        gulp配置文件
└── webpack.config.js:  webpack配置文件
```

规范
----
* 统一使用ES6语法，使用webpack打包 [js规范](https://zhuanlan.zhihu.com/p/20616464#!)
* 通过父级组件class定义组件内部css样式 [CSS规范](http://nec.netease.com/standard/css-practice.html)

启动(当前目录下命令行)
----
* npm install
* npm install -g gulp

文件改动监听打包
----
* gulp