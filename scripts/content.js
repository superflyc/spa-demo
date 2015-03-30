//content loader and parser
var content = (function () {

    "use strict";

    //model and viewModel for knockout
    //model is a POJO that holds JSON data
    //viewModel is a set of knockout observables that are sync'd to the UI
    //let's init model with some values expected by the UI
    var model = {

        title: "",
        contentText: "",
        contentQuestions: "",
        action: ""

    };

    var viewModel;

    //get content from the db
    //filtering and heavy lifting would be done on db/server
    var getContent = function () {

        return Q.Promise(function (resolve, reject, notify) {

            $.ajax({
                dataType: 'json',
                url: 'data/docs.js',
                success: function (data, status, jqXHR) {
                    resolve(data);
                },
                error: function (jsXHR, status, errorText) {
                    console.log("error loading data: " + errorText);
                    reject("Error loading data: " + errorText);
                }
            });

        });

    };

    //load content into the viewModel
    //filtering and heavy lifting would be done on db/server
    var loadContent = function (requestArray) {

        var selectedSection = requestArray.length > 0 ? requestArray[0] : "";
        var selectedSubSection = requestArray.length > 1 ? requestArray[1] : "";

        getContent().then(function (data) {

            var selectedDoc = data.filter(function (e) {
                var matchSection = false;
                var matchSubSection = false;

                if (e.section.toLowerCase() === selectedSection) matchSection = true;
                if (!selectedSubSection || (e.subSection && e.subSection.replace(' ', '').toLowerCase() === selectedSubSection)) matchSubSection = true;

                return matchSection && matchSubSection;
            });

            if (!selectedDoc.length) {
                throw new Error("Cannot find requested document!");
            } else {
                ko.viewmodel.updateFromModel(viewModel, selectedDoc[0]);
            }

        })
            .fail(function (err) {
                alert(err);
            });

    };

    //handle a form submit
    var submitForm = function() {
        //this skips ko.computed and function definitions, so it is a POJO representing the model
        var model = ko.viewmodel.toModel(viewModel);
        model = JSON.stringify(model);
        console.log(model); //check here to verify doc submission

        $.ajax({
            url:viewModel.action(),
            method:"POST",
            data: model
        }).done(function() {
            alert("data posted. check console or network traffic for confirmation");
        })
    }

    var init = function () {
        viewModel = ko.viewmodel.fromModel(model);
        viewModel.submitForm = submitForm;
        ko.applyBindings(viewModel, $("#mainContent")[0]);
    };

    return {
        init: init,
        loadContent: loadContent
    };

})();