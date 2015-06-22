'use strict';

var gulp = require('gulp');
var Handlebars = require('handlebars');
var $ = require('gulp-load-plugins')();
var seq = require('run-sequence');
var through = require('through2');

/*************************************************************************
 * initialize makdoc
 */
var makdoc = require('gulp-makdoc'); // should init before local task
makdoc.init(gulp, Handlebars);

/*************************************************************************
 * tasks
 */

gulp.task('deploy', ['makdoc'], function () {
    var deploy = require('gulp-gh-pages');
    var path = require('path');

    return gulp.src([path.join($.makdoc.vars.DIST(),'**/*'),
                    '!**/*.map'])
        .pipe(deploy({
            remoteUrl: 'git@github.com:pismute/pismute.github.io.git',
            cacheDir: '.gh-pages',
            branch:'master'
        }));
});

// Bower helper
gulp.task('bower', function() {
    var base = 'app/bower_components/';
    var files = [
        'requirejs/require.js',
        'bootstrap/dist/**/*.min.{js,css}',
        'bootstrap-material-design/dist/**/material.min.{js,css}',
        'bootstrap-material-design/dist/**/ripples.min.{js,css}',
        '{d3,jquery,lodash,dashbars}/**/*.min.js',
        'moment/min/{locales,moment}.min.js',
        'handlebars/handlebars/handlebars.min.js'
    ];
    files = files.map(function(file){
        return 'app/bower_components/' + file;
    });

    return gulp.src(files, {base:base})
        .pipe(gulp.dest('dist/bower_components/'));
});

gulp.task('makdoc:init:after', function(done){
    var returns = function(v) {
        return function(){
            return v;
        };
    };

    $.makdoc.vars.BASE_URL = returns('http://pismute.github.io/'),

    done();
});

gulp.task('makdoc:done:after', function(done){
    seq(['bower',
         'lint'],
        done);
});

gulp.task('lint', function(){
    return gulp.src(['gulpfiles.js', './gulp/**/*.js'])
        .pipe($.cached('lint'))
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'));
});

/*************************************************************************
 * template data
 */

makdoc.templateData({
    package:require('./package.json')
});

/*************************************************************************
 * override:highlight
 */

var _alias = {
    'js-run': 'js',
    'js-run-d3': 'js'
};

makdoc.util.highlight = function() {
    var _highlight = makdoc.util.highlight_pygment();
    return function(code, lang, done){
        return _highlight(code, _alias[lang] || lang, done);
    }
}

/*************************************************************************
 * helpers
 */

var _ = require('lodash');

var arrayfy = function(value) {
    //value is string or array
    return !value? []:
        Array.isArray(value)? value:value.split(',');
}

Handlebars.registerHelper('_keyword-links', function(tags) {
    return _(arrayfy(tags))
        .map(function(it){
            it = it.trim();
            return '<a href="/site/keyword-map.html#' +
                it.toLowerCase() + '" class="keyword">' +
                it + '</a>';
        })
        .value()
            .join(' ');
});

Handlebars.registerHelper('_group-doc', function(models){
    return models.reduce(function(g, m){
        var keywords = m['keywords'];
        if( keywords ) {
            var keywords = _.isString(keywords)? keywords.split(','): keywords;

            keywords.forEach(function(keyword){
                if( (g[keyword]) ) {
                    g[keyword].push(m);
                }else{
                    g[keyword] = [m];
                }
            });
        }

        return g;
    }, {});
});

Handlebars.registerHelper('_summary', function(html) {
    if(html){
        var matched = (/<h[123456].*?>.*<\/h[123456].*?>([\s\S*]*?)<h[123456].*?>.*<\/h[123456].*?>/i).exec(html)

        if( matched ) {
            return matched[1];
        }
    }

    return "empty-summary";
});
