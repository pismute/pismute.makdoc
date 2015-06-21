//requirejs.s.contexts._.config.paths
/* jshint undef: false */
require.config({
    baseUrl: '/bower_components/',
    paths: {
        '$': 'jquery/dist/jquery.min',
        '_': 'lodash/lodash.min',
        'babel': '/babel',
        'bootstrap': 'bootstrap/dist/js/bootstrap.min',
        'bootstrap-material': 'bootstrap-material-design/dist/js/material.min',
        'bootstrap-material-ripples': 'bootstrap-material-design/dist/js/ripples.min',
        'moment': 'moment/min/moment-with-locales.min',
        'd3': 'd3/d3.min',
        'handlebars': 'handlebars/handlebars.min',
        'dashbars': 'dashbars/dist/dashbars.min'
    },
    shim: {
        '$': {
            init() {
                return jQuery.noConflict();
            }
        },
        '_': {
            init() {
                return _.noConflict();
            }
        },
        'babel': {
            exports: 'babel'
        },
        'moment': {
            exports: 'moment'
        },
        'd3': {
            exports: 'd3'
        },
        'handlebars': {
            exports: 'Handlebars',
            init() {
                require(['dashbars', 'handlebars'],
                        (dashbars, handlebars)=> {
                    dashbars.help(handlebars);
                });
            }
        },
        'bootstrap': ['$'],
        'bootstrap-material': ['$', 'bootstrap'],
        'bootstrap-material-ripples': ['$', 'bootstrap-material']
    }
});
