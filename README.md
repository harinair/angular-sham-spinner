# Angular Sham Spinner

This contains sham-spinner directive that allows you to add Identified Sham
Spinner to Angular applications easily.

### Requirements
- sham-spinner
- angularjs 1.2.0 (for latest version)

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

    <script src="bower_components/angular-sham-spinner/angular-sham.spinner.js"></script>

```

Enable the angularShamSpinner module in your app.js or any application config
javascript.
```js
angular.module('greenhornApp', [
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
sham-spinner {
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
sham-spinner{
  background: #333;
  opacity: 0.8;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 5000;
  .sham-spinner-container{
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
