const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const rename = require('gulp-rename');

gulp.task('sass', function() {
    return gulp.src('app/src/sass/**/*.sass')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/dist/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function() {
    return gulp.src('app/**/*.html')
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});

gulp.task('watch', function() {
    gulp.watch('app/src/sass/**/*.sass', gulp.parallel('sass'))
    gulp.watch('app/*.html', gulp.parallel('html'))
});

gulp.task('default', gulp.parallel('browser-sync', 'watch'))