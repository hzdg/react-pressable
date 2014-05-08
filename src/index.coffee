# react-pressable
# ===============

React = require 'react'
merge = require 'react/lib/merge'
eventlistener = require 'eventlistener'

{PropTypes} = React
{div} = React.DOM


# Create a pressable version of another component class.
createFrom = (componentClass) ->
  dn = componentClass.type.displayName
  wrappedDisplayName =
    if dn then "#{ dn[...1].toUpperCase() }#{ dn[1...] }"
    else 'Component'
  React.createClass
    displayName: "Pressable#{ wrappedDisplayName }"
    render: -> @transferPropsTo (Pressable component: componentClass, @props.children)

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

  getInitialState: ->
    isPressed: false
    isInside: false # This will only be accurate while the component is pressed; there's no reason to keep track otherwise.

  render: -> @props.component @getProps(), @props.children

  getProps: ->
    usesPressEvents = @props.onPress or @props.onRelease or @props.onReleaseOutside or @props.onReleaseInside

    # If no special events are being used, don't add the overhead of listening.
    return @props unless usesPressEvents

    merge @props,
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

  handleMouseEnter: -> @setState isInside: true
  handleMouseLeave: -> @setState isInside: false

  handleMouseDown: ->
    @props.onPress?()

    # Listen for a mouse up somewhere else in case the user presses then moves.
    eventlistener.add document, 'mouseup', @handleDocumentMouseUp

    @setState
      isInside: true
      isPressed: true
  handleMouseUp: ->
    # Call the release event handlers.
    if @state.isPressed
      @props.onRelease?()
      @props.onReleaseInside?()

    @setState isPressed: false

  handleDocumentMouseUp: ->
    # Remove the listener
    eventlistener.remove document, 'mouseup', @handleDocumentMouseUp

    @setState isPressed: false

    # If the mouse isn't inside the object, we need to trigger the release and
    # releaseOutside events.
    unless @state.isInside
      @props.onRelease?()
      @props.onReleaseOutside?()


module.exports = Pressable
