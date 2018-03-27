/**
 * Gulp Build: npm + gulp
 *
 * Quick Doc: http://www.cnblogs.com/jadeboy/p/4995864.html
 *
 * Install ALL:
 *     cnpm install
 * Install gulp:
 *     http://www.gulpjs.com
 *     npm install --global gulp
 * Install cnpm:
 *     https://npm.taobao.org
 *     npm install -g cnpm --registry=https://registry.npm.taobao.org
 *
 * Require Plugin:
 *     gulp                 --- 自动化构建工具
 *     gulp-load-plugins    --- 自动插件加载
 *     gulp-browserify      ---
 *     gulp-ruby-sass       ---
 *     gulp-autoprefixer    ---
 *     gulp-rename          ---
 *     gulp-minify-css      ---
 *     gulp-connect         --- 本地Web Server
 *     gulp-livereload      --- 自动刷新浏览器
 *
 * Usage:
 *     gulp default or gulp
 */

// 所需要的模块
// 编译Sass (gulp-ruby-sass)
// Autoprefixer (gulp-autoprefixer)
// 缩小化(minify)CSS (gulp-minify-css)
// JSHint (gulp-jshint)
// 拼接 (gulp-concat)
// 丑化(Uglify) (gulp-uglify)压缩
// 图片压缩 (gulp-imagemin)
// 即时重整(LiveReload) (gulp-livereload) XXX
//  browser-sync
// 清理档案 (gulp-clean)
// 图片快取，只有更改过得图片会进行压缩 (gulp-cache)
// 更动通知 (gulp-notify)
// html页面压缩(gulp-htmlmin)
// 重命名 (gulp-rename)
// 执行bower安装(gulp-bower)
// 加载所有插件 (gulp-load-plugins)
// 模板引擎库 (gulp-handlebars)
// gulp-browserify

'use strict';

let gulp = require("gulp"),
    // gulp-load-plugins可以加载package.json文件中所有的gulp模块
    gulploadplugins = require("gulp-load-plugins"),
    plugins = gulploadplugins(),
    gulp_sass = require('gulp-sass'),
    autoprefixer = require("gulp-autoprefixer"),
    rename = require("gulp-rename"),
    minifycss = require("gulp-minify-css"),
    sourcemaps = require('gulp-sourcemaps'),
    debug = require('gulp-debug'),
    cached = require('gulp-cached'),
    changed = require('gulp-changed'),
    remember = require('gulp-remember'),
    eslint = require('gulp-eslint');
    // eslintIfFixed = require('gulp-eslint-if-fixed')
    // // 使用eslint修复问题
    // gulp.task('fix', function () {
    //     return gulp.src(['./public/app/**/**.js']) //指定的校验路径
    //         .pipe(eslint({ fix: true }))
    //         .pipe(eslint.format())
    //         .pipe(eslintIfFixed('src'));
    // });
let gulp_webpack = require('gulp-webpack');

let htmlreplace = require('gulp-html-replace');
let webpack_config = require('./webpack.config');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();   // 静态服务器

let _APP_PATH = {
    'APP_DEBUG_SRC': './public/',
    'APP_DEBUG_SRC_STYLE': './public/app/styles/',
    'APP_PRODUCTION_SRC': './public/dist/',
    'APP_PRODUCTION_CSS_SRC': './public/dist/css',
    'APP_PRODUCTION_IMAGE_SRC': './public/dist/images',
    'APP_PRODUCTION_JS_SRC': './public/dist/js'
};

let _APP_STYLE_SASS = {
    'MAIN': {
        'FROM_PATH': './public/app/styles/index.scss',
        'TO_PATH': './public/dist/css/'
    },
    PRODUCTION: {
        'TO_PATH': './production/dist/css/'
    }
};

// 无效
let _APP_STYLE_CSS = {
    'MAIN': {
        'FROM_PATH': './public/app/styles/main.css',
        'TO_PATH': './public/dist/css'
    }
};

let _APP_JS_INDEX = {
    'MAIN': './public/app/app.js'
};

// // 发布前 清理 dist 发布目录
// gulp.task("APP_PRODUCTION_PATH_CLEAN", function () {
//     return gulp.src([_APP_PATH.APP_PRODUCTION_CSS_SRC, _APP_PATH.APP_PRODUCTION_IMAGE_SRC, _APP_PATH.APP_PRODUCTION_JS_SRC],
//         {read:false}).pipe(plugins.clean());
// });
//
// gulp.task('APP_STYLE_NODE_SASS', function () {
//     return group(_APP_STYLE_SASS, function (key, sass_file_set) {
//           return gulp.src(sass_file_set.FROM_PATH)
//               .pipe(gulp_sass().on('error', gulp_sass.logError))
//               .pipe(gulp.dest(sass_file_set.TO_PATH));
//       })();
// });
//
// gulp.task('APP_STYLE_NODE_SASS_RT', function () {
//     gulp.watch(_APP_PATH.APP_DEBUG_SRC_STYLE + '**/*.scss', ['APP_STYLE_NODE_SASS'])
// });
//
// gulp.task("APP_STYLE_CSS_WATCH", function () {
//     gulp.watch("public/app/styles/main.css", ["APP_STYLE_CSS"]);
// });
//
// gulp.task("APP_JS_INDEX", function () {
//     gulp.src(_APP_JS_INDEX.MAIN)
//         .pipe(browserify({transform: 'reactify'}))
//         .pipe(gulp.dest('public/dist'))
//         .pipe(rename({suffix: '.min'}))
//         // .pipe(sourcemaps.init())
//             .pipe(plugins.uglify())
//         // .pipe(sourcemaps.write('.', {sourceMappingURLPrefix: '.',
//         //     includeContent: false}))
//         .pipe(gulp.dest('public/dist'));
// });
//
// //只编译，合并文件，不做压缩
// gulp.task("APP_JS_DEBUG", function () {
//     gulp.src(_APP_JS_INDEX.MAIN)
//         .pipe(browserify({transform: 'reactify'}))
//         .pipe(gulp.dest('public/dist'));
// });
//
// gulp.task("APP_JS_INDEX_WATCH", function () {
//     gulp.watch("public/app/**/*.js", ["APP_JS_INDEX"]);
// });
//
// // 压缩图片
// gulp.task("APP_STYLE_IMAGE", function () {
//     //.pipe(plugins.imagemin({optimizationLevel:3,progressive:true,interlaced:true
//     return gulp.src("./public/app/images/**/*").pipe(gulp.dest("./public/dist/images"));
// });
//
// gulp.task("APP_BUILDER_SERVER", function () {
//     connect.server();
// });
//
// gulp.task("APP_BUILDER", ["APP_STYLE_CSS", "APP_STYLE_IMAGE", "APP_JS_INDEX"], function () {
//     gulp.watch(_APP_STYLE_CSS.MAIN.FROM_PATH, ["APP_STYLE_CSS"]);
//     gulp.watch("public/app/images/**/*", ["APP_STYLE_IMAGE"]);
//     gulp.watch(_APP_JS_INDEX.MAIN, ["APP_JS_INDEX"]);
// });
//
// gulp.task("default", ["APP_BUILDER_SERVER", "APP_BUILDER"], function () {
//     let builder_server = livereload();
//     gulp.watch(_APP_JS_INDEX.MAIN, function (file) {
//         builder_server.change(file.path);
//     });
// });


// 使用webpack打包,不做压缩
gulp.task('debug', function () {
    let config = Object.assign({}, webpack_config);
    delete config.plugins;
    gulp.src(_APP_JS_INDEX.MAIN)
        .pipe(gulp_webpack(config))
        .pipe(gulp.dest('public/dist'));
});
gulp.task('build', function () {
    gulp.src(_APP_JS_INDEX.MAIN)
        .pipe(gulp_webpack(webpack_config))
        .pipe(gulp.dest('public/dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.init())
        .pipe(plugins.uglify())
        .on('error', function (e) {
            console.log(e);
        })
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest('public/dist'));
});
gulp.task('d_build', function () {
    gulp.src(_APP_JS_INDEX.MAIN)
        .pipe(gulp_webpack(webpack_config))
        .pipe(cached('js-task'))
        .pipe(debug({ title: '编译:' }))
        .pipe(gulp.dest('public/dist'))
        // .pipe(changed('./public/dist', { hasChanged: changed.compareContents }))
        .pipe(remember('js-task'))  // 和 cached() 参数一致
        .pipe(gulp.dest('public/dist'))
        .pipe(browserSync.reload({ stream: true }));
});
gulp.task('p_build', function () {
    gulp.src(_APP_JS_INDEX.MAIN)
        .pipe(gulp_webpack(webpack_config))
        .pipe(gulp.dest('public/dist'))
        .pipe(plugins.uglify())
        .on('error', function (e) {
            console.log(e);
        })
        .pipe(gulp.dest('production/dist'));
});
gulp.task('sass', function () {
    return gulp.src(_APP_STYLE_SASS.MAIN.FROM_PATH)
        .pipe(gulp_sass.sync().on('error', gulp_sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie8', 'ie9', 'opera12.1'))
        .pipe(gulp.dest(_APP_STYLE_SASS.MAIN.TO_PATH))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(_APP_STYLE_SASS.MAIN.TO_PATH));
});
gulp.task('d_sass', function () {
    return gulp.src(_APP_STYLE_SASS.MAIN.FROM_PATH)
        .pipe(changed('./public/dist/css', { hasChanged: changed.compareContents }))
        .pipe(gulp_sass.sync().on('error', gulp_sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie8', 'ie9', 'opera12.1'))
        .pipe(gulp.dest(_APP_STYLE_SASS.MAIN.TO_PATH))
        .pipe(browserSync.reload({ stream: true }));
});
gulp.task('p_sass', function () {
    return gulp.src(_APP_STYLE_SASS.MAIN.FROM_PATH)
        .pipe(gulp_sass.sync().on('error', gulp_sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie8', 'ie9', 'opera12.1'))
        .pipe(gulp.dest(_APP_STYLE_SASS.MAIN.TO_PATH))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(_APP_STYLE_SASS.MAIN.TO_PATH))
        .pipe(gulp.dest(_APP_STYLE_SASS.PRODUCTION.TO_PATH));
});
gulp.task('html', function () {
    // 加入编译日期
    let timestamp = '?_=' + new Date().getTime();
    gulp.src('template.html')
        .pipe(htmlreplace({
            css: 'dist/css/index.min.css' + timestamp,
            js: 'dist/app.min.js' + timestamp
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(_APP_PATH.APP_DEBUG_SRC));
});
gulp.task('d_html', function () {
    // 加入编译日期
    let timestamp = '?_=' + new Date().getTime();
    gulp.src('template.html')
        .pipe(htmlreplace({
            css: 'dist/css/index.css' + timestamp,
            js: 'dist/app.js' + timestamp
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(_APP_PATH.APP_DEBUG_SRC));
});
gulp.task('p_html', function () {
    // 加入编译日期
    let timestamp = '?_=' + new Date().getTime();
    gulp.src('template.html')
        .pipe(htmlreplace({
            css: 'dist/css/index.min.css' + timestamp,
            js: 'dist/app.js' + timestamp
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(_APP_PATH.APP_DEBUG_SRC))
        .pipe(gulp.dest('./production/'));
});
gulp.task('min_vendor', function () {
    let vendor = './public/dist/app.vendor.js';
    gulp.src(vendor)
        .pipe(sourcemaps.init())
        .pipe(plugins.uglify())
        .on('error', function (e) {
            console.log(e);
        })
        .pipe(gulp.dest('./production/dist/'))
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest('./public/dist'));
});
gulp.task('clean_vendor', function () {
    gulp.src(['./public/dist/app.vendor*.js',
        './production/dist/app.vendor*.js',
        './public/dist/map/app.vendor*.js.map'], { read: false })
        .pipe(clean());
});
gulp.task('clean', function () {
    gulp.src([
        './public/dist/*.chunk.js'
    ], { read: false })
        .pipe(clean());
});
gulp.task('c', function () {
    gulp.src([
        './public/dist/*.chunk.js',
        './production/dist/map/*.chunk.js.map',
        './production/dist/*.chunk.js'
    ], { read: false })
        .pipe(clean());
});

gulp.task('bs', ['build', 'sass']);
// 开发环境
gulp.task('default', ['clean', 'd_build', 'd_sass', 'd_html']);
// 生成环境
gulp.task('p', ['p_build', 'p_sass', 'p_html']);

//启动热更新  
gulp.task('server', ['clean'], function () {
    gulp.start('d_build', 'd_sass', 'd_html');
    browserSync.init({
        proxy: "http://localhost:8000"
    });
    gulp.watch('./public/app/**/**.js', ['d_build']);         //监控文件变化，自动更新  
    gulp.watch('./public/app/**/**.css', ['d_sass']);
    gulp.watch('./public/app/**/**.scss', ['d_sass']);
});
// 用eslint检查
gulp.task('eslint', function () {
    return gulp.src(['./public/app/**/**.js']) //指定的校验路径
        .pipe(eslint({ fix: true }))
        .pipe(eslint({ configFle: "./.eslintrc" })) //使用你的eslint校验文件
        .pipe(eslint.format())
});
