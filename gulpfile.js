// 获取 gulp
var gulp = require('gulp')
// 获取 gulp-less 模块
// var less = require('gulp-less')
// 获取 minify-css 模块（用于压缩 CSS）
var minifyCSS = require('gulp-minify-css');

var gutil = require('gulp-util')

var webpack = require('gulp-webpack');

var eslint = require('gulp-eslint');

var livereload = require('gulp-livereload');

// gulp.task('lint', () => {
//     // ESLint ignores files with "node_modules" paths. 
//     // So, it's best to have gulp ignore the directory as well. 
//     // Also, Be sure to return the stream from the task; 
//     // Otherwise, the task may end before the stream has finished. 
//     return gulp.src(['src/**/*.jsx', 'src/**/*.js'])
//         // eslint() attaches the lint output to the "eslint" property 
//         // of the file object so it can be used by other modules. 
//         .pipe(eslint({
//             configFile: '.eslintrc.js'
//         }))
//         // eslint.format() outputs the lint results to the console. 
//         // Alternatively use eslint.formatEach() (see Docs). 
//         .pipe(eslint.format())
//         // To have the process exit with an error code (1) on 
//         // lint error, return the stream and pipe to failAfterError last. 
//         .pipe(eslint.failAfterError());
// });

gulp.task('webpack', function (callback) {
    return gulp.src('./src/app.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/js'));
});

// 编译less
// 在命令行输入 gulp images 启动此任务
gulp.task('css', function () {
    // 1. 找到 less 文件
    gulp.src('src/css/**.css')
        // 2. 编译为css
        // .pipe(less())
        // 2\. 压缩文件
        .pipe(minifyCSS())
        // 3. 另存文件
        .pipe(gulp.dest('dist/css'))
});

gulp.task("images", function () {
    gulp.src('src/images/**/*')
        .pipe(gulp.dest('dist/images'))
});

// 在命令行使用 gulp auto 启动此任务
gulp.task('autoless', function () {
    gulp.watch('src/css/**.css', ['css'])
})

gulp.task('autojs', function () {
    //['webpack', 'lint']
    gulp.watch('src/**/**.js', ['webpack'])
    gulp.watch('src/**/**.jsx', ['webpack'])
})

gulp.task("auto_images", function () {
    gulp.watch('src/images/**/*', ['images'])
});

gulp.task('watch', function () {
    // Create LiveReload server
    livereload.listen();
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 less 任务和 auto 任务
//'lint', 未启动代码检测
gulp.task('default', ['css', 'images', 'auto_images', 'autoless', 'webpack', 'autojs', 'watch'])