require(['$',
            'bootstrap',
            'bootstrap-material',
            'bootstrap-material-ripples'],
        function($){
    $.material.init();
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
