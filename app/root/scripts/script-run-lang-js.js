require(['$', 'babel'], function($, babel){
    $('.lang-js').each(function(){

        babel.run('require(["$", "_"], function($, _){' +
                  $(this).text() + '});');

    });
});
