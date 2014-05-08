react-pressable
===============

react-pressable is a [React] component that provides the convenience events
`onRelease`, `onReleaseOutside`, `onReleaseInside`, and `onPress`. It works with
any component that supports the normal React mouse events.


Installation
------------

[browserify] and [webpack] users can simply `npm install react-pressable`.

[Bower] users can `bower install react-pressable`.

You can also just download the react-pressable.js file from the standalone
directory in the repository.


Usage
-----

Composition is very easy:

```jsx
var Pressable = require('react-pressable');

var MyComponent = React.createClass({
    render: function () {
        return (
            <Pressable
                    component={ React.DOM.div }
                    onReleaseOutside={ this.handleReleaseOutside }>
                <span>Hello</span>
            </Presssable>
        );
    },
    handleReleaseOutside: function () {
        alert('You pressed the component but released the button outside!')
    }
})
```

However, Pressable also lets you create a pressable version of an existing
component using the `from` static method. This is often cleaner and avoids
markup pollution:

```jsx
var Pressable = require('react-pressable');
var PressableSpan = Pressable.from(React.DOM.span);

var MyComponent = React.createClass({
    render: function () {
        return (
            <PressableSpan onReleaseOutside={ this.handleReleaseOutside }>
                Hello
            </PresssableSpan>
        );
    },
    handleReleaseOutside: function () {
        alert('You pressed the component but released the button outside!')
    }
})
```


[React]: http://reactjs.org
[browserify]: http://browserify.org
[webpack]: http://webpack.github.io
[Bower]: http://bower.io
