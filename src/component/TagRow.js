import React, { Component } from 'react';
import Clock from './Clock.js';

/**
 * Renders an individual row in the timer.
 */
class TagRow extends Component {
  constructor(props) {
    super(props);
    this.onTagChange = this.onTagChange.bind(this);
  }

  render() {
    return (
      <div>
        <input type="textfield" placeholder="Tag" onChange={this.onTagChange} />
        <input type="textfield" placeholder="Add notes..." />
        <Clock row={this.props.row} running={this.props.running} onStart={this.props.onClockStart} />
      </div>
    );
  }

  /**
   * If text is set in the last row, let the parent component respond.
   *
   * @param event
   */
  onTagChange(event) {
    if (this.props.last && event.target.value.length === 1) {
      this.props.onTagInit(event);
    }
  }
}

export default TagRow;
