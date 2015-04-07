//ui function

var ui = (function () {

    'use strict';

    var setSliderColor = function (elId, elValue) {

        //assume currentValue is part of a range, 0-10
        //could configure this for more flexibility
        var minRange = 0;
        var maxRange = 10;

        var minColor = {red: 0, green: 200, blue: 0};
        var maxColor = {red: 218, green: 41, blue: 28};

        var newColor =  {
            red: computeColor(elValue, minRange, maxRange, minColor.red, maxColor.red),
            green: computeColor(elValue, minRange, maxRange, minColor.green, maxColor.green),
            blue: computeColor(elValue, minRange, maxRange, minColor.blue, maxColor.blue)
        };

        $("#"+elId + " .slider-selection").css("background", 'rgb('+newColor.red+','+newColor.green+','+newColor.blue+')');
        $("#"+elId + " .slider-handle").css("background", 'rgb('+newColor.red+','+newColor.green+','+newColor.blue+')');
        $("#"+elId + " .slider-tick").css("background", 'rgb(250,250,250)');
        $("#"+elId + " .slider-tick.in-selection").css("background", 'rgb('+newColor.red+','+newColor.green+','+newColor.blue+')');



    };

//quick and dirty function to normalize percentages between two ranges that will get us % of color based on % of slider range
    var computeColor = function(currentValue, minRange, maxRange, minColor, maxColor) {

        var numColorValues = maxColor - minColor + 1;

        var percentRange = (currentValue - minRange) / (maxRange - minRange); //normalize percentage based on min/max values

        return Math.round((percentRange * numColorValues) + minColor);

    };

    return {
        setSliderColor: setSliderColor
    };

})();
