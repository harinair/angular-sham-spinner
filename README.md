# Angular Sham Spinner
This contains sham-spinner directive that allows you to add Identified Sham
Spinner to Angular applications easily.

###Note:

In 0.10 and above the sham-spinner element will not be hidden. A new div sham-spinner-blocker is added. Checkout the sample scss on how to configure it.


### Requirements
- sham-spinner
- angularjs 1.2.0 (or latest version)

### Installation

Use bower to install angular-sham-spinner. This will also install sham-spinner
bower component.

````
$ bower install angular-sham-spinner
````

In the index.html add the directive and the reference to the script. The
attribute text will be shown beside the spinner.

```html
    <sham-spinner text="Loading..."></sham-spinner>

    <script src="bower_components/angular-sham-spinner/angular-sham-spinner.js"></script>

```

Enable the angularShamSpinner module in your app.js or any application config
javascript.
```js
angular.module('yourApp', [
        'ngRoute',
        'ngResource',
        'ngSanitize',
        'ngAnimate',
        'angularShamSpinner']);
```

Import Sham Spinner scss and add appropriate style for class
sham-spinner-container, spinner and text. The following style will
show the spinner on the top left corner.

```scss
@import "sham-spinner/sham-spinner";
.sham-spinner-blocker {
    .sham-spinner-container {
        padding: 2px 15px;
        background-color: #000;
        border: 1px solid #333;
        color: #ffffff;
        position: fixed;
        left: 5px;
        top: 0px;
        z-index: 5000;
    
        .spinner {
            display: block;
            float: left;
            width: 50px;
            height: 50px;
            @include sham-spinner-spokes(LightCoral, 44px, 2s);
        }
        .text {
            padding: 10px 12px;
            float: left;
            font-weight: 700;
        }
    }
}
```

The following is another example where the spinner is shown in the 
middle of the page blocking the view.

```scss
@import "sham-spinner/sham-spinner";
.sham-spinner-blocker {
    background: #333;
    opacity: 0.8;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5000;

    .sham-spinner-container {
        border: none;
        background-color: #000000;
        display: table;
        position: relative;
        width: auto;
        top: 45%;
        margin: auto;
        @include border-radius(5px);
    
        .spinner {
            display: block;
            float: left;
            width: 50px;
            height: 50px;
            @include sham-spinner-spokes(LightCoral, 44px, 2s);
        }
    }
}
```

### Disabling Sham Spinner
(Available from release 0.0.6)

Sometimes it may be necessary to disable the spinner. For example, if the spinner is blocking the
view and you are using AJAX to do validation of user input, it may be a good idea to disable the
spinner until the current call is complete.

In your controller, directive or service, you can inject the AngularShamNotification.
The AngularShamNotification has a method: setDisabled(disable, resetTime). If resetTime
(in milliseconds) is provided, the spinner will enable itself after the resetTime. Set resetTime
to a negative number to disable automatic reset. In that case, you may have to manually reset
the spinner by invoking this method with 'false' argument.


Example:

```js
angular.module('yourApp').controller('ghValidateEnrolled', [
    'AngularShamNotification',
    'YourSomeService', function(angularShamNotification, yourSomeService) {
        // disable spinner -do not reset automatically
        angularShamNotification.setDisabled(true, -1);
        yourSomeService.doAnApiCall()
        .then(function(data) {
            angularShamNotification.setDisabled(false);
        }, function(reason) {
            angularShamNotification.setDisabled(false);
        });
    }]
);

```

### License

The MIT License
