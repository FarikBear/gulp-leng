const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer')

gulp.task('sass', () => {
    return gulp.src('app/src/sass/*.sass')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('app/dist/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function () {
    return gulp.src('app/src/js/*.js')
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('html', function(){
    return gulp.src('app/src/*.html')
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: './',
        port: 8080,
        open: false
    });
});

gulp.task('watch', () => {
    gulp.watch('app/src/**/*.sass', gulp.parallel('html'));
    gulp.watch('app/src/*.html', gulp.parallel('html'));
});



gulp.task('default', gulp.parallel('browser-sync', 'watch'));