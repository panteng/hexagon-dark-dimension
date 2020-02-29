var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');
var cssnano = require('cssnano');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');



/* ============================================================================================================
 ============================================ For Development ==================================================
 =============================================================================================================*/

// compile sass and save the result as bundle/bundle.css
gulp.task('compile-scss', function () {
    return gulp.src('src/style.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .on('error', errorAlert)
        .pipe(postcss([
            autoprefixer({
                browsers: ['last 4 versions']
            })
        ]))
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest('bundle'))
        .pipe(browserSync.stream());
});

// bundle CommonJS modules and save the result as bundle/bundle.js
gulp.task('bundle-js', function () {
    return browserify('src/script.js')
        .bundle()
        .on('error', errorAlert)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('bundle/'));
});


// watch files and run corresponding task(s) once files are added, removed or edited
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch('src/style.scss', ['compile-scss']);
    gulp.watch('src/script.js', ['bundle-js']);

    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('bundle/*.js').on('change', browserSync.reload);
});

// clean old files under bundle folder
gulp.task('clean-bundle', function (cb) {
    return del([
        'bundle/*'
    ], cb);
});

// development tasks combination
gulp.task('dev', function (cb) {
    runSequence(['clean-bundle'], ['compile-scss', 'bundle-js'], 'watch', cb);
});

// default task
gulp.task('default', ['dev']);



/* ============================================================================================================
 ============================================ For Production ==================================================
 =============================================================================================================*/

// minify stylesheets under bundle folder
gulp.task('minify-css', function () {
    return gulp.src('bundle/bundle.css')
        .pipe(postcss([
            cssnano({
                discardComments: { removeAll: true }
            })
        ]))
        .pipe(gulp.dest('bundle'));
});

// uglify javascripts under bundle folder
gulp.task('uglify-js', function () {
    return gulp.src('bundle/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('bundle'));
});

// production tasks combination
gulp.task('prod', function (cb) {
    runSequence(['minify-css', 'uglify-js'], cb);
});



/* ============================================================================================================
 ============================================= Functions ====================================================
 =============================================================================================================*/

// handle errors
function errorAlert(error) {
    notify.onError({
        title: 'Error in Gulp Tasks',
        message: 'Check your terminal.',
        sound: 'Sosumi'
    })(error);
    console.log(error.toString());
    this.emit('end');
};
