//our entry point into the app
//each of these scripts takes the from of an IFFE: http://benalman.com/news/2010/11/immediately-invoked-function-expression/
//this provides scope
var main = (function () {

    'use strict'; //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode




//once we're ready, let's go!
    $(function () {

        //custom binding to create slider
       ko.bindingHandlers.slider = {
           init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

               var sliderId = "slider-"+bindingContext.$parentContext.$index()+"-"+bindingContext.$index();
               var smileyId = "smiley-"+bindingContext.$parentContext.$index()+"-"+bindingContext.$index();
               var theSlider = $(element).slider({
                   ticks: [0,1,2,3,4,5,6,7,8,9,10],
                   ticks_labels: ['0','1','2','3','4','5','6','7','8','9','10'],
                   value: Number(valueAccessor()),
                   id: sliderId
               });

               ui.setSliderColor(sliderId, valueAccessor());
               ui.changeSmiley(smileyId, valueAccessor());

               theSlider.on("change",(function(retObj) {
                   var newVal = retObj.value.newValue;
                   valueAccessor(newVal);
                   ui.setSliderColor(sliderId, newVal);
                   ui.changeSmiley(smileyId, newVal);
               }
               ));


               //shim for sliders which aren't currently visible
               $("#"+sliderId+" .slider-tick-label").width(21);
               $("#"+sliderId+" .slider-tick-label-container").css('margin-left', '-10.5px');
               $("#"+sliderId).css('margin-bottom', '24px');

           }
       };

        menu.init()
            .then(function (){
                content.init();
                router.init(menu,content);
                //take us home if we're not there already
                if (!window.location.hash) router.handleRequest();
            });


    });


})();