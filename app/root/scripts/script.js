require(['$',
            'bootstrap',
            'bootstrap-material',
            'bootstrap-material-ripples'],
        function($){
    $.material.init();
});

require(['$'], function($){
    $(function(){
        $('.lang-hbs').each(function(){
            var that = this;
            require(['handlebars'], function(handlebars){
                var data = window.data || $(that).attr('data') || {};
                var src = $(that).text();
                var template = handlebars.compile(src);
                $(that).text(template(data));
            });
        });

        $('.lang-js-run').each(function(){
            var that = this;
            require(['babel'], function(babel){
                babel.run('require(["$", "_"], function($, _){' +
                        $(that).text() + '});');
            });
        });

        $('.lang-js-run-d3').each(function(){
            var that = this;
            require(['babel'], function(babel){
                babel.run('require(["$", "_", "d3"], function($, _, d3){' +
                        $(that).text() + '});');
            });
        });
    });
});

//ga
// if( '{{{package.homepage}\}\}' === 'http://' + window.location.hostname ) {
//     var _gaq = _gaq || [];
//     _gaq.push(['_setaccount', 'ua-27493298-1']);
//     _gaq.push(['_trackpageview']);

//     (function() {
//     var ga = document.createelement('script'); ga.type = 'text/javascript'; ga.async = true;
//     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//     var s = document.getelementsbytagname('script')[0]; s.parentnode.insertbefore(ga, s);
//     })();
// }
