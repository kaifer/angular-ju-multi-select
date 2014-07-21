(function() {
	'use strict';

	angular.module('juMultiSelect', [])
	.filter('parentsFilter',function(){
		return function( parents, word ) {
			var out = [];

			if(word && angular.isArray(parents) ) {
				var wordLowerCase = word.toLowerCase();

				parents.forEach(function(parent) {
					var parentMatches = false;

					if (parent.name.toLowerCase().indexOf(wordLowerCase) !== -1) {
						parentMatches = true;
					} else if( angular.isArray(parent.children) ) {
						parent.children.forEach(function(child) {
							if (child.name.toLowerCase().indexOf(wordLowerCase) !== -1) {
								parentMatches = true;
								return;
							}
						}); // end children for each
					}

					if (parentMatches) {
						out.push(parent);
					}
				}); // end parents for each
			} else { 
				out = parents;
			}

			return out;
		} // end return filter
	})
	.filter('childrenFilter',function(){
		return function( children, word ) {
			var out = [];

			if(word && angular.isArray(children) ) {
				var wordLowerCase = word.toLowerCase();

				children.forEach(function(child) {
					if (child.name.toLowerCase().indexOf(wordLowerCase) !== -1) {
						out.push(child);
					} 
				}); // end children for each
			} else { 
				out = children;
			}

			return out;
		} // end return filter
	})
	.directive('juMultiSelect', function() {

		// Set default config
		var multiSelectConfig = {
			height: "200px;",
			width: "500px",
			fontSize: "10px",
			useSearch: false,

			selectableTitle: "",
			selectedTitle: "",
		}

		return {
			restrict: 'E',

			scope:{
				selectableDatas: '=',
				selectedDatas: '=',
				overParentItem: '=',
				overChildItem: '=',

				height: '@',
				width: '@',
				fontSize: '@',
				useSearch: '@',

				selectableTitle: '@',
				selectedTitle: '@'
			},

			template: 
			'<div class="row jms-container" style="{{setWidth()}}">'+
				'<div class="row jms-header">'+
					'<div class="jms-selectable">'+
						'<div class="jms-header-contents">'+
							'<span>{{selectableTitle}}</span>'+
							'<input class="form-control" type="text" ng-show="setUseSearch()" ng-model="selectableWord"/>'+
						'</div>'+
					'</div>'+
					'<div class="jms-center">'+
						'<div>'+
							'<a style="font-size: 0px;">jms</a>'+
						'</div>'+
					'</div>'+
					'<div class="jms-selected">'+
						'<div class="jms-header-contents">'+
							'<span>{{selectedTitle}}</span>'+
							'<input class="form-control" type="text" ng-show="setUseSearch()" ng-model="selectedWord"/>'+
						'</div>'+
					'</div>'+
				'</div>'+

				'<div class="row jms-contents">'+
					'<div class="jms-selectable">'+
						'<div class="panel panel-default jms-list" style="overflow:scroll; {{setHeight()}}">'+
							'<ul class="list-group" style="{{setParentFontSize()}}" '+
									'ng-repeat="parent in selectableDatas | parentsFilter:selectableWord track by $index" '+
									'ng-click="parentToSelected($index)"'+
									'ng-mouseover="emitOverParentItem(parent,$event)">'+
								'<span>{{parent.name}}</span>'+
								'<a href="#" class="list-group-item" style="{{setChildFontSize()}}" '+
									'ng-repeat="child in parent.children | childrenFilter:selectableWord track by $index" '+
									'ng-click="childToSelected($index,parent,$event)"'+
									'ng-mouseover="emitOverChildItem(child,$event)">'+
									'{{child.name}}'+
								'</a>'+
							'</ul>'+
						'</div>'+
					'</div>'+
					'<div class="jms-center" style="{{setCenterHeight()}}">'+
						'<div>'+
							'<a style="font-size: 0px;">jms</a>'+
							'<i class="fa fa-arrows-h"></i>'+
						'</div>'+
					'</div>'+
					'<div class="jms-selected">'+
						'<div class="panel panel-default jms-list" style="overflow:scroll; {{setHeight()}}">'+
							'<ul class="list-group" style="{{setParentFontSize()}}" '+
								'ng-repeat="parent in selectedDatas | parentsFilter:selectedWord track by $index" '+
								'ng-click="parentToSelectable($index)"'+
								'ng-mouseover="emitOverParentItem(parent,$event)">'+
								'<span>{{parent.name}}</span>'+
								'<a href="#" class="list-group-item" style="{{setChildFontSize()}}" '+
									'ng-repeat="child in parent.children | childrenFilter:selectedWord track by $index" '+
									'ng-click="childToSelectable($index,parent,$event)"'+
									'ng-mouseover="emitOverChildItem(child,$event)">'+
									'{{child.name}}'+
								'</a>'+
							'</ul>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>',

			link: function( scope, element, attrs ) {

				{ // setting functions
					scope.setHeight = function() {
						if ( typeof scope.height !== 'undefined' ) {
							multiSelectConfig.height = scope.height;
						} 
						return 'height: ' + multiSelectConfig.height + ';';
					}

					scope.setWidth = function() {
						if ( typeof scope.width !== 'undefined' ) {
							multiSelectConfig.width = scope.width;
						} 
						return 'width: ' + multiSelectConfig.width + ';';
					}

					scope.setCenterHeight = function() {
						if ( typeof scope.height !== 'undefined' ) {
							multiSelectConfig.height = scope.height;
						} 
						return 'line-height: ' + multiSelectConfig.height + ';';
					}

					scope.setUseSearch = function() {
						if ( typeof scope.useSearch !== 'undefined' ) {
							multiSelectConfig.useSearch = scope.useSearch;
						}
						return multiSelectConfig.useSearch;
					}

					scope.setParentFontSize = function() {
						if ( typeof scope.fontSize !== 'undefined' ) {
							multiSelectConfig.fontSize = scope.fontSize;
						} 
						return 'font-size: ' + multiSelectConfig.fontSize + 5 + ';';
					}
					scope.setChildFontSize = function() {
						if ( typeof scope.fontSize !== 'undefined' ) {
							multiSelectConfig.fontSize = scope.fontSize;
						} 
						return 'font-size: ' + multiSelectConfig.fontSize + ';';
					}
				}

				scope.emitOverParentItem = function( src, $event ){
					if( typeof scope.overParentItem !== 'undefined' ){
						angular.extend(scope.overParentItem, src);
					}
				}
				scope.emitOverChildItem = function( src, $event ){
					if( typeof scope.overChildItem !== 'undefined' ){
						angular.extend(scope.overChildItem, src);
						$event.stopPropagation();
					}
				}

				scope.searchById = function(jsonArr,id) {
					for (var i in jsonArr) {
						if (!jsonArr.hasOwnProperty(i)) continue;
						if (jsonArr[i].id === id) { 
							return i; 
						}
					}
					return -1;
				}

				scope.moveParent = function( from, to, idx ){
					var item = from[idx];
					from.splice(idx,1);

					var destinationId = scope.searchById(to,item.id);
					if( destinationId != -1 ){
						var destinationItem = to[destinationId];

						item.children.forEach(function(child){
							destinationItem.children.push(child);
						});
					} else {
						to.push(item);
					}
				}

				scope.moveChild = function( from, to, idx, parent ){
					var indexOfParent = from.indexOf(parent);
					var item = parent.children[idx];
					parent.children.splice(idx,1);

					if( parent.children.length == 0 ){
						from.splice(indexOfParent,1);
					}

					var newParent = {};
					var destinationId = scope.searchById(to,parent.id);
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

				scope.parentToSelected = function(idx) {
					scope.moveParent(scope.selectableDatas,scope.selectedDatas,idx);
				}
				scope.childToSelected = function(idx,parent,$event) {
					scope.moveChild(scope.selectableDatas, scope.selectedDatas, idx, parent);
					$event.stopPropagation();
				}

				scope.parentToSelectable = function(parent) {
					scope.moveParent(scope.selectedDatas,scope.selectableDatas,parent);
				}
				scope.childToSelectable = function(idx,parent,$event) {
					scope.moveChild(scope.selectedDatas, scope.selectableDatas, idx, parent);
					$event.stopPropagation();
				}
				
			} // end link
		}; // end return
	}); // end directive

})()