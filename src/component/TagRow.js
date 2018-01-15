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
          <input type="textfield" placeholder="Tag" onChange={this.onTagChange} value={this.props.tag} />
          <input type="textfield" placeholder="Add notes..." value={this.props.note} onChange={(event) => {
            this.props.onNoteChange(event, this.props.row);
          }}/>
        <Clock row={this.props.row} running={this.props.running} seconds={this.props.seconds} onStart={this.props.onClockStart} onPause={this.props.onClockPause} onIncrement={this.props.onIncrement} />
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

    this.props.onTagChange(event, this.props.row);
  }

}

export default TagRow;
