(function(angular) {
	'use strict';
    var juMultiSelectCtrl = ['$scope', function($scope) {

        (function init() {
            $scope.params.settings().$scope = $scope;
        })();
    }];

	angular.module('juMultiSelect', [])
	.factory('JuMultiSelectParams', ['$q', function($q){
		return function(baseParameters, baseSettings){
             function searchById(jsonArr,id) {
                for (var i in jsonArr) {
                    if (!jsonArr.hasOwnProperty(i)) continue;
                    if (jsonArr[i].id === id) {
                        return i;
                    }
                }
                return -1;
            };
            function moveParent( from, to, idx ){
                var item = from[idx];
                from.splice(idx,1);

                var destinationId = searchById(to,item.id);
                if( destinationId != -1 ){
                    var destinationItem = to[destinationId];

                    item.children.forEach(function(child){
                        destinationItem.children.push(child);
                    });
                } else {
                    to.push(item);
                }
            };
            function moveChild( from, to, idx, parent ){
                var indexOfParent = from.indexOf(parent);
                var item = parent.children[idx];
                parent.children.splice(idx,1);

                if( parent.children.length == 0 ){
                    from.splice(indexOfParent,1);
                }

                var newParent = {};
                var destinationId = searchById(to,parent.id);
                if( destinationId != -1 ){
                    newParent = to[destinationId];
                    newParent.children.push(item);
                } else {
                    angular.extend(newParent,parent);
                    newParent.children = [];
                    newParent.children.push(item);
                    to.push(newParent);
                }
            }

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

            var params = {

            };
            var settings = {
                $scope: null,
                getData: null
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