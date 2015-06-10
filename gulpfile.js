(function(gulp) {

    "use strict";

    var sass         = require('gulp-sass'),
        rename       = require('gulp-rename'),
        cssmin       = require('gulp-cssmin'),
        jshint       = require('gulp-jshint'),
        processhtml  = require('gulp-processhtml'),
        autoprefixer = require('gulp-autoprefixer'),
        htmlmin      = require('gulp-minify-html');

    var fs         = require('fs'),
        path       = require('path'),
        yaml       = require('js-yaml'),
        babelify   = require('babelify'),
        browserify = require('browserify'),
        cfg        = yaml.safeLoad(fs.readFileSync('travelet.yml', 'utf8'));

    /**
     * @method compile
     * @param {String} entry
     * @param {String} destination
     * @return Object
     */
    var compile = function(entry, destination) {

        return browserify({ debug: true })
                    .transform(babelify)
                    .require(entry, { entry: true })
                    .bundle()
                    .on('error', function (model) { console.error(['Error:', model.message].join(' ')); })
                    .pipe(fs.createWriteStream(destination));

    };

    gulp.task('compile', function() {
        return compile(cfg.gulp.js.entry, cfg.gulp.js.build);
    });

    gulp.task('sass', function() {

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

    gulp.task('html', function () {

        var htmlOptions = {
            conditionals: true,
            spare:true
        };

        return gulp.src(cfg.gulp.html.entry)
                   .pipe(processhtml({}))
                   .pipe(htmlmin(htmlOptions))
                   .pipe(rename(path.basename(cfg.gulp.html.build)))
                   .pipe(gulp.dest(path.dirname(cfg.gulp.html.build)));

    });

    gulp.task('lint', function() {

        return gulp.src(cfg.gulp.js.all)
            .pipe(jshint())
            .pipe(jshint.reporter(require('jshint-stylish')));

    });

    gulp.task('watch', function () {
        return gulp.watch(cfg.gulp.sass.all, ['sass']);
    });

    gulp.task('build',   ['default']);
    gulp.task('test',   ['lint']);
    gulp.task('release', ['build', 'html']);
    gulp.task('default', ['compile', 'sass']);

})(require('gulp'));