import React, { Component } from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.startClock = this.startClock.bind(this);
  }

  startClock(event) {
    setTimeout(this._increase.bind(this), 1000);
  }

  _increase(event) {
    if (this.props.running) {
      this.props.onIncrement(event, this.props.row);
      setTimeout(this._increase.bind(this), 1000);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.running && nextProps.running) {
      this.startClock();
    }
  }

  render() {
    let controls;
    if (!this.props.running) {
      controls = <input type="button" value="Start" onClick={(event) => {
        this.props.onStart(event, this.props.row);
      }}/>;
    }
    else {
      controls = <input type="button" value="Pause" onClick={(event) => {
        this.props.onPause(event, this.props.row)
      }}/>;
    }

    return (
      <div className="App-clock">
        {controls}
        {this.props.seconds}
      </div>
    );
  }
}

export default Clock;
