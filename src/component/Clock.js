import React, { Component } from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: this.props.running,
      seconds: 0,
    };
    // This binding is necessary to make `this` work in the callback
    this.startClock = this.startClock.bind(this);
    this.pauseClock = this.pauseClock.bind(this);
  }

  startClock(event) {
    //this.props.onStart(event, this.props.row);
    this.setState({
      running: true,
    });

    setTimeout(this._increase.bind(this), 1000);
  }

  pauseClock() {
    this.setState({
      running: false,
    });
  }

  _increase() {
    if (this.state.running) {
      this.setState((prevState, props) => ({
        seconds: prevState.seconds + 1,
      }));
      setTimeout(this._increase.bind(this), 1000);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.running && !this.state.running) {
      this.startClock();
    }
    if (!nextProps.running && this.state.running) {
      this.pauseClock();
    }

  }

  render() {
    let controls;
    if (!this.state.running) {
      controls = <input type="button" value="Start" onClick={(event) => {
        this.props.onStart(event, this.props.row);
      }}/>;
    }
    else {
      controls = <input type="button" value="Pause" onClick={this.pauseClock}/>;
    }

    return (
      <div>
        {controls}
        {this.state.seconds}
      </div>
    );
  }
}

export default Clock;
