require(['$', 'handlebars'], function($, handlebars){
    $('.lang-hbs').each(function(){
        var data = window.data || $(this).attr('data') || {};
        var src = $(this).text();
        var template = handlebars.compile(src);
        $(this).text(template(data));
    });
});
