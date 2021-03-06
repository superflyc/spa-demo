//content loader and parser
var content = (function () {

    "use strict";

    //model and viewModel for knockout
    //model is a POJO that holds JSON data
    //viewModel is a set of knockout observables that are sync'd to the UI

    var model={}, viewModel;

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
                viewModel.contentQuestions = ko.observable(); //there's a bug in the ko.viewmodel plugin that will crash if an empty observableArray is passed to updateViewModel

                if(selectedDoc[0].docType === "survey") decorateModel(selectedDoc[0]);

                ko.viewmodel.updateFromModel(viewModel, initModel(selectedDoc[0]));
            }

        })
            .fail(function (err) {
                alert(err);
            });

    };

    //initialize the model with defaults
    //different models for different docTypes is preferrable in the long run
    var initModel = function(model) {

        var modelDefaults = {
            title: "",
            contentText: "",
            contentQuestions: "",
            docType: "",
            selectedSection: 0,
            totalQuestions:0
        };

        $.extend(modelDefaults,model);
        return modelDefaults;

    };

    //decorator function for surveys
    var decorateModel = function(model) {
        model.totalQuestions = 0;

        for(var i = 0; i < model.contentQuestions.length; i ++) {
            model.contentQuestions[i].startQuestion = model.totalQuestions + 1;

            for(var j = 0; j < model.contentQuestions[i].questions.length; j++) {
                model.totalQuestions++;
            }
            model.contentQuestions[i].endQuestion = model.totalQuestions;

        }

    };

    //handle a tab click
    var clickTab = function(index) {
        viewModel.selectedSection(index);
    };

    //handle a form submit
    var submitForm = function() {
        //this skips ko.computed and function definitions, so it is a POJO representing the model
        var model = ko.viewmodel.toModel(viewModel);
        model = JSON.stringify(model);
        console.log(model); //check here to verify doc submission

        $.ajax({
            url:"",
            method:"POST",
            data: model
        }).done(function() {
            alert("data posted. check console or network traffic for confirmation");
        });
    };

    var init = function () {

       viewModel = ko.viewmodel.fromModel(initModel(model));
        ko.applyBindings(viewModel, $("#mainContent")[0]);
    };

    return {
        init: init,
        loadContent: loadContent,
        submitForm: submitForm,
        clickTab: clickTab
    };

})();