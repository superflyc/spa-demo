//router logic
var router = (function() {

    var handleRequest = function (section, subSection) {

        //parse this into an array and ship it off to the menu
        var requestArray = [];
        if (section) requestArray.push(section);
        if (subSection) requestArray.push(subSection);

        menu.setActiveItems(requestArray);
        content.loadContent(requestArray);

    };

    //let's set up our router : https://github.com/flatiron/director
    //this could go into its own file, but for ten lines of code, I'm okay with it here
    var router = Router({
        '': handleRequest,
        '/render': {
            '/:section': {
                on: function (section) {
                    handleRequest(section)
                }
            },
            '/:section/:subSection': {
                on: function (section, subSection) {
                    handleRequest(section, subSection)
                }
            }
        }
    });

    var init = function() {
        router.init();
    };

    return {
        init: init,
        handleRequest: handleRequest
    };

})();
