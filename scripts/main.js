//our entry point into the app
//each of these scripts takes the from of an IFFE: http://benalman.com/news/2010/11/immediately-invoked-function-expression/
//this provides scope
var main = (function () {

    'use strict'; //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode




//once we're ready, let's go!
    $(function () {
        menu.init()
            .then(function (){
                content.init();
                router.init();
                //take us home if we're not there already
                if (!window.location.hash) router.handleRequest();
            });


    });


})();