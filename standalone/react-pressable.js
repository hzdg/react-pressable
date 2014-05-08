!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.controlfacades=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Pressable, PropTypes, React, combineHandlers, createFrom, div, eventlistener, merge,
  __slice = [].slice;

React = (window.React);

merge = (window.React.addons.merge);

eventlistener = _dereq_('eventlistener');

PropTypes = React.PropTypes;

div = React.DOM.div;

createFrom = function(componentClass) {
  var dn, wrappedDisplayName;
  dn = componentClass.type.displayName;
  wrappedDisplayName = dn ? "" + (dn.slice(0, 1).toUpperCase()) + dn.slice(1) : 'Component';
  return React.createClass({
    displayName: "Pressable" + wrappedDisplayName,
    render: function() {
      return this.transferPropsTo(Pressable({
        component: componentClass
      }));
    }
  });
};

combineHandlers = function() {
  var handler, handlers;
  handlers = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  handlers = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = handlers.length; _i < _len; _i++) {
      handler = handlers[_i];
      if (handler) {
        _results.push(handler);
      }
    }
    return _results;
  })();
  switch (handlers.length) {
    case 0:
      return null;
    case 1:
      return handlers[0];
    default:
      return function() {
        var args, result, _i, _len;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        for (_i = 0, _len = handlers.length; _i < _len; _i++) {
          handler = handlers[_i];
          result = handler.apply.apply(handler, [this].concat(__slice.call(args)));
        }
        return result;
      };
  }
};

Pressable = React.createClass({
  displayName: 'Pressable',
  statics: {
    from: createFrom
  },
  propTypes: {
    component: PropTypes.func,
    componentProps: PropTypes.object,
    onPress: PropTypes.func,
    onRelease: PropTypes.func,
    onReleaseOutside: PropTypes.func,
    onReleaseInside: PropTypes.func
  },
  getDefaultProps: function() {
    return {
      component: div
    };
  },
  getInitialState: function() {
    return {
      isPressed: false,
      isInside: false
    };
  },
  render: function() {
    return this.props.component(this.getProps(), this.props.children);
  },
  getProps: function() {
    var usesPressEvents;
    usesPressEvents = this.props.onPress || this.props.onRelease || this.props.onReleaseOutside || this.props.onReleaseInside;
    if (!usesPressEvents) {
      return this.props;
    }
    return merge(this.props, {
      onMouseDown: combineHandlers(this.handleMouseDown, this.props.onMouseDown),
      onMouseUp: combineHandlers(this.handleMouseUp, this.props.onMouseUp),
      onMouseEnter: combineHandlers(this.handleMouseEnter, this.props.onMouseEnter),
      onMouseLeave: combineHandlers(this.handleMouseLeave, this.props.onMouseLeave),
      component: null,
      componentProps: null,
      onPress: null,
      onRelease: null,
      onReleaseOutside: null,
      onReleaseInside: null
    });
  },
  handleMouseEnter: function() {
    return this.setState({
      isInside: true
    });
  },
  handleMouseLeave: function() {
    return this.setState({
      isInside: false
    });
  },
  handleMouseDown: function() {
    var _base;
    if (typeof (_base = this.props).onPress === "function") {
      _base.onPress();
    }
    eventlistener.add(document, 'mouseup', this.handleDocumentMouseUp);
    return this.setState({
      isInside: true,
      isPressed: true
    });
  },
  handleMouseUp: function() {
    var _base, _base1;
    if (this.state.isPressed) {
      if (typeof (_base = this.props).onRelease === "function") {
        _base.onRelease();
      }
      if (typeof (_base1 = this.props).onReleaseInside === "function") {
        _base1.onReleaseInside();
      }
    }
    return this.setState({
      isPressed: false
    });
  },
  handleDocumentMouseUp: function() {
    var _base, _base1;
    eventlistener.remove(document, 'mouseup', this.handleDocumentMouseUp);
    this.setState({
      isPressed: false
    });
    if (!this.state.isInside) {
      if (typeof (_base = this.props).onRelease === "function") {
        _base.onRelease();
      }
      return typeof (_base1 = this.props).onReleaseOutside === "function" ? _base1.onReleaseOutside() : void 0;
    }
  }
});

module.exports = Pressable;

},{"eventlistener":2}],2:[function(_dereq_,module,exports){
(function(root,factory){
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.eventListener = factory();
  }
}(this, function () {
	function wrap(standard, fallback) {
		return function (el, evtName, listener, useCapture) {
			if (el[standard]) {
				el[standard](evtName, listener, useCapture);
			} else if (el[fallback]) {
				el[fallback]('on' + evtName, listener);
			}
		}
	}

    return {
		add: wrap('addEventListener', 'attachEvent'),
		remove: wrap('removeEventListener', 'detachEvent')
	};
}));
},{}]},{},[1])
(1)
});