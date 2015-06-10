(function(gulp) {

    "use strict";

    var sass         = require('gulp-sass'),
        rename       = require('gulp-rename'),
        cssmin       = require('gulp-cssmin'),
        autoprefixer = require('gulp-autoprefixer');

    var fs   = require('fs'),
        path = require('path'),
        yaml = require('js-yaml'),
        cfg  = yaml.safeLoad(fs.readFileSync('travelet.yml', 'utf8'));

    gulp.task('sass', function () {

        return gulp.src(cfg.gulp.sass.all)
            .pipe(sass().on('error', sass.logError))
            .pipe(cssmin())
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(rename(path.basename(cfg.gulp.sass.build)))
            .pipe(gulp.dest(path.dirname(cfg.gulp.sass.build)));

    });

    gulp.task('watch', function () {
        return gulp.watch(cfg.gulp.sass.all, ['sass']);
    });

    gulp.task('default', ['sass']);

})(require('gulp'));