require(['$', 'babel'], function($, babel){
    $('.lang-js').each(function(){

        babel.run('require(["$", "_", "d3"], function($, _, d3){' +
                  $(this).text() + '});');

    });
});
