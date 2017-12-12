const gulp = require('gulp');

// gulp.task('tsCompile', function () {
//     return gulp.src('./src/libraries/**/*.ts').pipe(gulp.dest('./bundles/'));
// });

gulp.task('copy', function () {
    return gulp.src('./src/libraries/**/*.js').pipe(gulp.dest('./bundles/'));
});

gulp.task('default', ['copy']);