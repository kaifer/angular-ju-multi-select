angular-ju-multi-select
=======================

An AngularJS directive which creates a multiple selections. Doesn't require jQuery!

# Requirements

- [AngularJS](http://angularjs.org/)
- [Bootstrap](http://www.getbootstrap.com/)
- [AwesomeFont](http://fortawesome.github.io/Font-Awesome/)


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

Apply the directive to your form elements:

```html
<ju-multi-select 
        selectable-datas='selectableDatas' selected-datas='selectedDatas'> 
</ju-multi-select>
```

Fundamental Settings

- selectable-datas : Unselected data.
- selected-datas : Selected data.

# Options

- over-item : Data pointed by mouse.

- height
- width
- font-size
- use-search : If this option true, you can use search. default false.

- selectable-title : Title of selectable data list. 
- selected-title : Title of selected data list.