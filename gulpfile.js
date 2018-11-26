var gulp = require("gulp");
var clean = require("gulp-clean");
var peg = require("pegjs");
var fs = require('fs');
var ts = require('gulp-typescript');

var tsProject = ts.createProject("./tsconfig.json");

gulp.task("clean:remove-build", function() {
    return gulp.src("build")
        .pipe(clean())
});

gulp.task("clean", ["clean:remove-build"], function(done) {
    setTimeout(done, 20); // This delay let the operating system unlock the files and the folders
});

gulp.task("make-build-folder", ["clean"], function() {
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./build'))
});

gulp.task("ts:build", ["make-build-folder"], function() {
    gulp.src(["src/**/*.ts"])
        .pipe(tsProject())
        .pipe(gulp.dest("build"));
});

gulp.task("ts:copy-definitions", ["ts:build"], function() {
    gulp.src(["src/**/*.d.ts"])
        .pipe(gulp.dest("build"));
});

gulp.task("peg:build", ["make-build-folder"], function(done) {
    fs.readFile(__dirname + "/src/parser.pegjs", function(err, data) {
        if(err) done(err);

        var parser = peg.generate(data.toString(), {
            output: "source",
            optimize: "size",
            format: "commonjs",
            trace: false
        });

        fs.writeFile(__dirname + "/build/parser.js", parser, function(err) {
            done(err);
        });
    })
});


gulp.task("build", ["peg:build", "ts:build", "ts:copy-definitions"], function() {});