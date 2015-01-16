angular-ju-multi-select
=======================

An AngularJS directive which creates a multiple selections. Doesn't require jQuery!

# Requirements

- [AngularJS](http://angularjs.org/)
- [Bootstrap](http://www.getbootstrap.com/)
- [AwesomeFont](http://fortawesome.github.io/Font-Awesome/)


# Installing via Bower

```
bower install angular-ju-multi-select
```


# Dependency 

### css
```html
<link href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
<link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
```

### javascript
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.18/angular.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.18/angular-route.min.js"></script>
```

# Usage

Add the juMultiSelect module as a dependency to your application module:

```javascript
var demoAppModule = angular.module('demoApp', ['ngRoute','juMultiSelect'])
```

Apply the directive to your elements:

```html
<div ju-multi-select="params">
    <div class="col-xs-6">
        <ul ng-repeat="selectable in $selectable" ng-click="params.moveParentToSelected($index)">{{selectable.name}}
            <li ng-repeat="children in selectable.song" ng-click="params.moveChildToSelected($index,selectable,$event)">{{children.name}}</li>
         </ul>
        </div>
        <div class="col-xs-6">
            <ul ng-repeat="selected in $selected" ng-click="params.moveParentToSelectable($index)">{{selected.name}}
                <li ng-repeat="children in selected.song" ng-click="params.moveChildToSelectable($index,selected,$event)">{{children.name}}</li>
            </ul>
        </div>
    </div>
</div>
```

# JuMultiSelectParams 
## Parameters
- id : Property of identity field.
- children : Property of children field.

## Setting
- getData : Function of data feed. 