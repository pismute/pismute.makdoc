require(['$',
            'bootstrap',
            'bootstrap-material',
            'bootstrap-material-ripples'],
        ($)=> $.material.init());

require(['$'], ($)=> {
    $(()=> {
        $('.lang-hbs').each((i, el)=> {
            require(['handlebars'], (handlebars)=> {
                const data = window.data || $(el).attr('data') || {};
                const src = $(el).text();
                const template = handlebars.compile(src);
                $(el).text(template(data));
            });
        });

        $('.lang-js-run').each((i, el)=> {
            require(['babel'], (babel)=> {
                babel.run(`require(["$", "_"], ($, _)=> {
                    ${$(el).text()}
                });`);
            });
        });

        $('.lang-js-run-d3').each((i, el)=> {
            require(['babel'], (babel)=> {
                babel.run(`require(["$", "_", "d3"], ($, _, d3)=> {
                    ${$(el).text()}
                });`);
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
