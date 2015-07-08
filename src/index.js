// react-pressable
// ===============

import React, {PropTypes} from 'react';
import eventlistener from 'eventlistener';


const id = (x) => x;
const {div} = React.DOM;
let Pressable;

// Create a pressable version of another component class.
function createFrom(componentClass) {
  const PressableFactory = (React.createFactory || id)(Pressable);
  const dn = componentClass.type.displayName;
  const wrappedDisplayName = dn ? `${ dn.charAt(0).toUpperCase() }${ dn.slice(1) }` : 'Component';
  return React.createClass({
    displayName: `Pressable${ wrappedDisplayName }`,
    render() {
      const newProps = Object.assign({}, this.props, {component: componentClass});
      return (
        <PressableFactory {...newProps}>{this.props.children}</PressableFactory>
      );
    },
  });
}

function combineHandlers(...handlers) {
  handlers = handlers.filter(handler => !!handler); // Filter out nulls

  switch (handlers.length) {
    case 0:
      return null; // No handlers? Don't make a function.
    case 1:
      return handlers[0]; // One handler? Avoid wrapping.
    default:
      // Wrap the handlers up in a single handler.
      return (...args) => {
        let result;
        for (let handler of handlers) {
          result = handler.apply(this, args);
        }
        return result;
      };
  }
}

Pressable = React.createClass({
  displayName: 'Pressable',

  statics: {
    from: createFrom,
  },

  propTypes: {
    component: PropTypes.func,
    componentProps: PropTypes.object,
    onPress: PropTypes.func,
    onRelease: PropTypes.func,
    onReleaseOutside: PropTypes.func,
    onReleaseInside: PropTypes.func,
  },

  getDefaultProps() {
    return {component: div};
  },

  componentWillMount() {
    this._isPressed = false;
    this._isInside = false; // This will only be accurate while the component is pressed; there's no reason to keep track otherwise.
  },

  render() {
    return this.props.component(this.getProps(), this.props.children);
  },

  getProps() {
    const usesPressEvents = this.props.onPress || this.props.onRelease || this.props.onReleaseOutside || this.props.onReleaseInside;

    // If no special events are being used, don't add the overhead of listening.
    if (!usesPressEvents) return this.props;

    return Object.assign({}, this.props, {
      onMouseDown: combineHandlers(this.handleMouseDown, this.props.onMouseDown),
      onMouseUp: combineHandlers(this.handleMouseUp, this.props.onMouseUp),
      onMouseEnter: combineHandlers(this.handleMouseEnter, this.props.onMouseEnter),
      onMouseLeave: combineHandlers(this.handleMouseLeave, this.props.onMouseLeave),

      // Don't pass along the press event handlers
      component: null,
      componentProps: null,
      onPress: null,
      onRelease: null,
      onReleaseOutside: null,
      onReleaseInside: null,
    });
  },

  handleMouseEnter() {
    this._isInside = true;
  },

  handleMouseLeave() {
    this._isInside = false;
  },

  handleMouseDown() {
    if (this.props.onPress) this.props.onPress();

    // Listen for a mouse up somewhere else in case the user presses then moves.
    eventlistener.add(document, 'mouseup', this.handleDocumentMouseUp);

    this._isInside = true;
    this._isPressed = true;
  },

  handleMouseUp() {
    // Call the release event handlers.
    if (this._isPressed) {
      if (this.props.onRelease) this.props.onRelease();
      if (this.props.onReleaseInside) this.props.onReleaseInside();
    }

    this._isPressed = false;
  },

  handleDocumentMouseUp() {
    // Remove the listener
    eventlistener.remove(document, 'mouseup', this.handleDocumentMouseUp);

    this._isPressed = false;

    // If the mouse isn't inside the object, we need to trigger the release and
    // releaseOutside events.
    if (!this._isInside) {
      if (this.props.onRelease) this.props.onRelease();
      if (this.props.onReleaseOutside) this.props.onReleaseOutside();
    }
  },

});

export default Pressable;
