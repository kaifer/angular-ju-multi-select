(function(angular) {
    'use strict';
    var juMultiSelectCtrl = ['$scope', 'JuMultiSelectParams', function($scope, JuMultiSelectParams) {
        function reload(){
            $scope.params.settings().$scope = $scope;
            $scope.params.reload();
        };

        (function init() {
            if (!$scope.params) {
                $scope.params = new JuMultiSelectParams();
            }
            reload();
        })();

        $scope.$watch('params', function () {
            reload();
        }, true);
    }];

    angular.module('juMultiSelect', [])
        .factory('JuMultiSelectParams', ['$q', function($q){
            return function(baseParameters, baseSettings){
                function searchById(jsonArr,id) {
                    for (var i in jsonArr) {
                        if (!jsonArr.hasOwnProperty(i)) continue;
                        if (jsonArr[i][params.id] === id) {
                            return i;
                        }
                    }
                    return -1;
                };

                function addItems(target, parent, children){
                    var newParent = {};
                    var destinationId = searchById(target, parent[params.id]);

                    if( destinationId != -1 ){
                        newParent = target[destinationId];
                    } else {
                        angular.extend(newParent,parent);
                        newParent[params.children] = [];
                        target.push(newParent);
                    }

                    children.forEach(function (child) {
                        newParent[params.children].push(child);
                    });
                };

                function moveParent( from, to, idx ){
                    var item = from[idx];
                    from.splice(idx,1);

                    var destinationId = searchById(to,item[params.id]);
                    if( destinationId != -1 ){
                        var destinationItem = to[destinationId];

                        item[params.children].forEach(function(child){
                            destinationItem[params.children].push(child);
                        });
                    } else {
                        to.push(item);
                    }
                };
                function moveChild( from, to, idx, parent ){
                    var indexOfParent = from.indexOf(parent);
                    var item = parent[params.children][idx];
                    parent[params.children].splice(idx,1);

                    if( parent[params.children].length == 0 ){
                        from.splice(indexOfParent,1);
                    }

                    addItems(to, parent, [item]);
                };

                this.moveParentToSelected = function(idx) {
                    moveParent(settings.$scope.$selectable, settings.$scope.$selected, idx);
                };
                this.moveChildToSelected = function(idx,parent,$event) {
                    moveChild(settings.$scope.$selectable, settings.$scope.$selected, idx, parent);
                    $event.stopPropagation();
                };
                this.moveParentToSelectable = function(parent) {
                    moveParent(settings.$scope.$selected, settings.$scope.$selectable, parent);
                };
                this.moveChildToSelectable = function(idx,parent,$event) {
                    moveChild(settings.$scope.$selected, settings.$scope.$selectable, idx, parent);
                    $event.stopPropagation();
                };

                this.addDatasToSelectable = function(parent, children){
                    var _children = parent[params.children] || [];
                    if(angular.isArray(children)){
                        addItems(settings.$scope.$selectable, parent, _children.concat(children));
                    } else {
                        addItems(settings.$scope.$selectable, parent, _children);
                    }
                };
                this.addDatasToSelected = function(parent, children){
                    var _children = parent[params.children] || [];
                    if(angular.isArray(children)){
                        addItems(settings.$scope.$selected, parent, _children.concat(children));
                    } else {
                        addItems(settings.$scope.$selected, parent, _children);
                    }
                };

                this.parameters = function(newParameters){
                    if(angular.isDefined(newParameters)){
                        params = angular.extend(params, newParameters);
                    } else {
                        return params;
                    }
                };
                this.settings = function(newSetting){
                    if(angular.isDefined(newSetting)){
                        settings = angular.extend(settings, newSetting);
                    } else {
                        return settings;
                    }
                };

                this.reload = function(){
                    var defer = $q.defer();

                    settings.getData(defer, self.params);

                    defer.promise.then(function(result){
                        var selectable = result.selectable;
                        var selected = result.selected;

                        settings.$scope.$selectable = selectable;
                        settings.$scope.$selected = selected;
                    });
                };

                this.getSelected = function(){
                    return settings.$scope.$selected;
                };
                this.getSelectable = function(){
                    return settings.$scope.$selectable;
                };

                var params = this.$params = {
                    id: 'id',
                    children: 'children'
                };
                var settings = {
                    $scope: null,
                    getData: function(defer, params){
                        defer.resolve({
                            selectable: [],
                            selected: []
                        });
                    }
                };

                this.parameters(baseParameters);
                this.settings(baseSettings);
            };
        }])
        .directive('juMultiSelect', function() {
            return {
                restrict: 'A',
                scope: true,
                controller: juMultiSelectCtrl,
                link: function( scope, element, attrs ) {
                    scope.$watch(attrs.juMultiSelect, (function (params) {
                        if (angular.isUndefined(params)) {
                            return;
                        }
                        scope.params = params;
                    }), true);
                } // end link
            }; // end return
        }); // end directive

})(angular);