# react-pressable
# ===============

React = require 'react'
extend = require 'xtend'
eventlistener = require 'eventlistener'

{PropTypes} = React
{div} = React.DOM
id = (x) -> x

# Create a pressable version of another component class.
createFrom = (componentClass) ->
  PressableFactory = (React.createFactory or id) Pressable
  dn = componentClass.type.displayName
  wrappedDisplayName =
    if dn then "#{ dn[...1].toUpperCase() }#{ dn[1...] }"
    else 'Component'
  React.createClass
    displayName: "Pressable#{ wrappedDisplayName }"
    render: ->
      newProps = extend @props, component: componentClass
      (PressableFactory newProps, @props.children)

combineHandlers = (handlers...) ->
  handlers = (handler for handler in handlers when handler) # Filter out nulls

  switch handlers.length
    when 0 then null # No handlers? Don't make a function.
    when 1 then handlers[0] # One handler? Avoid wrapping.
    else # Wrap the handlers up in a single handler.
      (args...) ->
        for handler in handlers
          result = handler.apply this, args...
        result

Pressable = React.createClass
  displayName: 'Pressable'

  statics:
    from: createFrom

  propTypes:
    component: PropTypes.func
    componentProps: PropTypes.object
    onPress: PropTypes.func
    onRelease: PropTypes.func
    onReleaseOutside: PropTypes.func
    onReleaseInside: PropTypes.func

  getDefaultProps: ->
    component: div

  componentWillMount: ->
    @_isPressed = false
    @_isInside = false # This will only be accurate while the component is pressed; there's no reason to keep track otherwise.

  render: -> @props.component @getProps(), @props.children

  getProps: ->
    usesPressEvents = @props.onPress or @props.onRelease or @props.onReleaseOutside or @props.onReleaseInside

    # If no special events are being used, don't add the overhead of listening.
    return @props unless usesPressEvents

    extend @props,
      onMouseDown: combineHandlers @handleMouseDown, @props.onMouseDown
      onMouseUp: combineHandlers @handleMouseUp, @props.onMouseUp
      onMouseEnter: combineHandlers @handleMouseEnter, @props.onMouseEnter
      onMouseLeave: combineHandlers @handleMouseLeave, @props.onMouseLeave

      # Don't pass along the press event handlers
      component: null
      componentProps: null
      onPress: null
      onRelease: null
      onReleaseOutside: null
      onReleaseInside: null

  handleMouseEnter: -> @_isInside = true; return
  handleMouseLeave: -> @_isInside = false; return

  handleMouseDown: ->
    @props.onPress?()

    # Listen for a mouse up somewhere else in case the user presses then moves.
    eventlistener.add document, 'mouseup', @handleDocumentMouseUp

    @_isInside = true
    @_isPressed = true
    return

  handleMouseUp: ->
    # Call the release event handlers.
    if @_isPressed
      @props.onRelease?()
      @props.onReleaseInside?()

    @_isPressed = false
    return

  handleDocumentMouseUp: ->
    # Remove the listener
    eventlistener.remove document, 'mouseup', @handleDocumentMouseUp

    @_isPressed = false

    # If the mouse isn't inside the object, we need to trigger the release and
    # releaseOutside events.
    unless @_isInside
      @props.onRelease?()
      @props.onReleaseOutside?()
    return


module.exports = Pressable
