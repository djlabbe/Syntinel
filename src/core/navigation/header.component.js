(function(){
    "use strict";
    angular
        .module('core')
        .component('headerComp',{
            templateUrl: 'src/core/navigation/header.tmpl.html',
            controller: headerCtrl
        });
    function headerCtrl(){
        var vm = this;

        vm.menuTree = [{
            label: 'Import',
            sref: false,
            submenu: [{
                label: 'Scripts',
                sref: 'importModal'
            }, {
            }]
        },{
            label: 'Applications',
            sref: 'applications'
        },{
            label: 'Scripts',
            sref: 'allTestScripts'
        }];
    }
}());