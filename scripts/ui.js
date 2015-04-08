//ui function

var ui = (function () {

    'use strict';


    //assume the slider range is 0-10, but we can change if needed and this range is available within this scope
    var minRange = 0;
    var maxRange = 10;

    //this uses a linear change on each color channel, which is expedient, but not necessarily correct
    //it looks a bit funny to me, at least
    var setSliderColor = function (elId, elValue) {

        var minColor = {red: 0, green: 200, blue: 0};
        var maxColor = {red: 218, green: 41, blue: 28};

        var newColor = {
            red: normalizeRange(elValue, minRange, maxRange, minColor.red, maxColor.red),
            green: normalizeRange(elValue, minRange, maxRange, minColor.green, maxColor.green),
            blue: normalizeRange(elValue, minRange, maxRange, minColor.blue, maxColor.blue)
        };

        $("#" + elId + " .slider-selection").css("background", 'rgb(' + newColor.red + ',' + newColor.green + ',' + newColor.blue + ')');
        $("#" + elId + " .slider-handle").css("background", 'rgb(' + newColor.red + ',' + newColor.green + ',' + newColor.blue + ')');
        $("#" + elId + " .slider-tick").css("background", 'rgb(250,250,250)');
        $("#" + elId + " .slider-tick.in-selection").css("background", 'rgb(' + newColor.red + ',' + newColor.green + ',' + newColor.blue + ')');


    };

    //quick and dirty function to normalize percentages between two ranges, used to get color changes, smiley changes, &c.
    var normalizeRange = function (currentValue, minRange, maxRange, minTarget, maxTarget) {

        var numTargetValues = (maxTarget - minTarget) + 1;

        var percentRange = (currentValue - minRange) / (maxRange - minRange); //normalize percentage based on min/max values

        return Math.round((percentRange * numTargetValues) + minTarget);

    };

    //array to hold css class of feelings, happy to sad
    var smileyArray = [
        "smiley-really-really-good",
        "smiley-really-good",
        "smiley-good",
        "smiley-ok",
        "smiley-meh",
        "smiley-bad",
        "smiley-really-bad",
        "smiley-really-really-bad"
    ];

    var changeSmiley = function(elId, elValue) {

        var smileyIndex = normalizeRange(elValue, minRange, maxRange, 0, (smileyArray.length -2)); //-2 b/c normalizeRange is inclusive

        $("#"+elId+" > div").each(function() {
            $(this).css('opacity',0);
        });

        $("."+smileyArray[smileyIndex], $("#"+elId)).css('opacity',1);

    };

    return {
        setSliderColor: setSliderColor,
        changeSmiley: changeSmiley
    };

})();
