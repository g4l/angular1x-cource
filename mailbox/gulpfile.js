'use strict';

const gulp = require('gulp');

function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback) {
        let task = require(path).call(this, options);

        return task(callback);
    });
}

lazyRequireTask('clean', './tasks/clean', {
    dst: 'public'
});

lazyRequireTask('styles', './tasks/styles', {
    src: 'app/**/*.css'
});

lazyRequireTask('htmls', './tasks/htmls', {
    src: 'app/**/*.html'
});

lazyRequireTask('jss', './tasks/jss', {
    src: [
        'tmp/app-config.js',
        'app/**/shared.module.js',
        'app/**/*.module.js',
        'app/**/*.js',
        '!app/app.js',
        '!app/**/*.unit.spec.js',
        '!app/**/*.e2e.spec.js',
        '!app/**/*.e2e.pageobject.js',
        'app/app.js']
});

lazyRequireTask('assets', './tasks/assets', {
    src: 'app/assets/**',
    dst: 'public/assets'
});

lazyRequireTask('config', './tasks/config', {
    src: 'app/config/app-config.json',
    dst: 'tmp'
});

gulp.task('build', gulp.series(
    'clean',
    'config',
    gulp.parallel('styles', 'assets', 'htmls', 'jss'))
);

gulp.task('watch', function() {
    gulp.watch('app/**/*.css', gulp.series('styles'));
    gulp.watch('app/**/*.html', gulp.series('htmls'));
    gulp.watch('app/assets/**', gulp.series('assets'));
    gulp.watch(['app/**/*.js', '!app/**/*.spec.js'], gulp.series('jss'));
});

lazyRequireTask('serve', './tasks/serve', {
    src: 'public'
});

lazyRequireTask('lint', './tasks/lint', {
    cacheFilePath: process.cwd() + '/tmp/lintCache.json',
    src: 'app/**/*.js'
});

gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'serve'))
);

// TODO : run protractor tests
// TODO : run unit tests