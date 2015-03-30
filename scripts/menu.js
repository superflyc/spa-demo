//logic for menu
var menu = (function () {

    'use strict';

    //model and viewModel for knockout
    //model is a POJO that holds JSON data
    //viewModel is a set of knockout observables that are sync'd to the UI
    var model = {}, viewModel;


    var getDocs = function () {

        //promises are a way of handling async code without callbacks
        //http://www.html5rocks.com/en/tutorials/es6/promises/
        return Q.Promise(function (resolve, reject, notify) {

            $.ajax({
                dataType:'json',
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
            menuItem.subSections = [];

            for (var k = 0; k < docs[currentSection].length; k++) {

                var subMenuItem = {};
                subMenuItem.title = docs[currentSection][k];
                subMenuItem.url = menuItem.url + "/" + docs[currentSection][k].toLowerCase().replace(' ','');

                menuItem.subSections.push(subMenuItem);
            }

            model.docs.push(menuItem);

        }

        //convert it to a vm
        viewModel = ko.viewmodel.fromModel(model);


    };

    var init = function () {

        getDocs()
            .then(function (results) {

                    parseDocs(results);

            })
            .fail(function (err) {
                alert(err);
            });

    };

    return {
        init: init
    };

})();
