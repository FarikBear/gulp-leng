const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const clear = require("del");

gulp.task("clean", () => {
  clear(["assets/dist"]);
});

gulp.task("sass", () => {
  return gulp
    .src("./src/sass/*.sass")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(concat("style.css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("assets/dist/css"));
});

gulp.task("js", () => {
  return gulp
    .src("assets/src/js/**/*.js")
    .pipe(uglify())
    .pipe(concat("script.js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("assets/dist/js"));
});

gulp.task("html", () => {
  return gulp
    .src("assets/src/pages/**/*.pug")
    .pipe(gulp.dest("assets/dist/templates/"));
});

gulp.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "assets/",
      index: "index.pug"
    },
    port: 8080,
    open: true
    //baseDir: 'app/dist'
  });
});

gulp.task("watch", () => {
  gulp.watch("assets/src/**/*.sass", gulp.parallel("sass"));
  gulp.watch("assets/src/**/*.js", gulp.parallel("js"));
  gulp.watch("assets/src/**/*.pug", gulp.parallel("html"));
});

gulp.task("default", gulp.parallel("clean", "watch", "serve"));
