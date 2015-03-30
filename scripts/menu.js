//logic for menu
var menu = (function () {

    'use strict';

    //model and viewModel for knockout
    //model is a POJO that holds JSON data
    //viewModel is a set of knockout observables that are sync'd to the UI
    var model = {}, viewModel;

//in prod, the db and server layers would handle the lifting we're doing here
    var getDocs = function () {

        //promises are a way of handling async code without callbacks
        //http://www.html5rocks.com/en/tutorials/es6/promises/
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

    var parseDocs = function (data) {

        var docs = {}; //placeholder POJO to assist with parsing

        //break out all docs into a section/subsection tree
        //this assumes that docs on the site only have two levels
        //bonus points: there is no block level scope in javascript, so these var i = 0 in the
        //for-loops are being hoisted to the top of the closure, but the behavior is as expected and
        //declaring them in the relevant for-loop is easier to read
        for (var i = 0; i < data.length; i++) {
            if (data[i].section && !docs[data[i].section]) {
                docs[data[i].section] = [];
            }
            if (data[i].subSection) {
                docs[data[i].section].push(data[i].subSection);
            }
        }

        var sections = Object.keys(docs);

        model.docs = [];

        //build the model for the menu
        for (var j = 0; j < sections.length; j++) {

            var currentSection = sections[j];

            var menuItem = {};
            menuItem.title = currentSection;
            menuItem.url = currentSection.toLowerCase();
            menuItem.active = false;
            menuItem.subSections = [];

            for (var k = 0; k < docs[currentSection].length; k++) {

                var subMenuItem = {};
                subMenuItem.title = docs[currentSection][k];
                subMenuItem.url = menuItem.url + "/" + docs[currentSection][k].toLowerCase().replace(' ', '');
                subMenuItem.active = false;

                menuItem.subSections.push(subMenuItem);
            }

            model.docs.push(menuItem);

        }

        //convert it to a vm
        viewModel = ko.viewmodel.fromModel(model);


    };

    var setActiveItems = function (route) {
        //route is already broken down into an array: [Section,subSection]

        //catch an empty values
        var selectedSection = route.length > 0 ? route[0] : '';
        var selectedSubSection = route.length > 1 ? route[1] : '';

        for (var i = 0; i < viewModel.docs().length; i++) {
            var currentSection = viewModel.docs()[i];
            if (currentSection.url && currentSection.url() === selectedSection) {
                currentSection.active(true);
                if (selectedSubSection) {
                    for (var j = 0; j < currentSection.subSections().length; j++) {
                        //the url has the whole path, so split and pop it to get the value we want
                        if (currentSection.subSections()[j].url && currentSection.subSections()[j].url().split('/').pop() === selectedSubSection) {
                            currentSection.subSections()[j].active(true);
                        } else {
                            currentSection.subSections()[j].active(false);
                        }
                    }
                }
            } else {
                currentSection.active(false);
                for (var j = 0; j < currentSection.subSections().length; j++) {

                    currentSection.subSections()[j].active(false);
                }
            }
        }


    };


    var init = function () {

        return Q.Promise(function(resolve,reject,notify) {

            getDocs()
                .then(function (results) {
                    parseDocs(results);
                    //and then
                    ko.applyBindings(viewModel, $("#navigation")[0]);
                    resolve();
                })
                .fail(function (err) {
                    alert(err);
                    reject();
                });

        });



    };

    return {
        init: init,
        setActiveItems: setActiveItems
    };

})
();
