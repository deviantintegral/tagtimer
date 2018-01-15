import React, { Component } from 'react';

import parseLinkHeader from 'parse-link-header';
import TagRow from './TagRow.js';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selectedProject: null,
      clocks: [{
        running: false,
        seconds: 0,
      }],
    };
    this.handleAddAnother = this.handleAddAnother.bind(this);
    this.onClockStart = this.onClockStart.bind(this);
    this.onClockPause = this.onClockPause.bind(this);
    this.onIncrement = this.onIncrement.bind(this);
    this.logAll = this.logAll.bind(this);
    this.onSelectProject = this.onSelectProject.bind(this);
  }

  componentDidMount() {
    this.projects();
  }

  projects(next = '') {
    if (!next) {
      this.setState(() => ({
        projects: [],
      }));

      next = 'https://api.letsfreckle.com/v2/projects/?enabled=true&per_page=100';
    }
    const timer = this;
    fetch(this.props.freckleProxy + '/' + next, {
      headers:  new Headers(({'Authorization': 'Bearer ' + this.props.accessToken})),
    }).then(function (response) {
      if (response.headers.has('Link')) {
        const link = parseLinkHeader(response.headers.get('Link'));
        if (link.next) {
          timer.projects(link.next.url);
        }
      }
      return response.json();
    })
   .then(function (data) {
     timer.setState((prevState) => ({
       projects: prevState.projects.concat(data),
     }));
    });
  }

  logAll() {
    const entries = 'https://api.letsfreckle.com/v2/entries';
    const timer = this;
    this.state.clocks.forEach((v, i) => {
      if (v.seconds = 0) {
        return;
      }
      const entry = {
        date: new Date().toISOString(),
        minutes: Math.max(Math.round(v.seconds / 60), 1),
        description: '',
        project_id: Number.parseInt(timer.state.selectedProject),
      };

      fetch(this.props.freckleProxy + '/' + entries, {
        method: 'POST',
        body: JSON.stringify(entry),
        headers: new Headers({
          'Authorization': 'Bearer ' + this.props.accessToken,
          'Content-Type': 'application/json'
        })
      }).then(res => res.json())
        .then(response => {
          console.log('Success:', response);
          const clocks = this.state.clocks;
          clocks[i] = {
            running: false,
            seconds: 0,
          };
          timer.setState({
            clocks: clocks,
          })
        });
    });
  }

  onIncrement(event, row) {
    this.setState((prevState) => {
      const clocks = prevState.clocks;
      clocks[row].seconds++;
      return {
        clocks: clocks,
      };
    });
  }

  onSelectProject(event) {
    this.setState({
      selectedProject: event.target.value,
    });
  }

  render() {
    let projects;
    if (this.state.projects.length) {
      const options = this.state.projects.map((project) =>
        <option value={project.id}>{project.name}</option>
      );
      projects = (
        <select onChange={this.onSelectProject}>
          {options}
        </select>
      );
    }

    let rows = [];
    for (let i = 0; i <= this.state.clocks.length - 1; i++) {
      let last = (i === this.state.clocks.length - 1);
      // @todo Fix passing the clock object.
      rows[i] = <TagRow row={i} clock={this.state.clocks[i]} onTagInit={this.handleAddAnother} onClockStart={this.onClockStart} onClockPause={this.onClockPause} onIncrement={this.onIncrement} last={last}/>;
    }
    return (
      <div>
        {projects}
        <div >
          {rows}
          <input type="button" value="Log all timers" onClick={this.logAll}/>
        </div>
      </div>
    );
  }

  handleAddAnother(event) {
    this.setState((prevState, props) => ({
      clocks: prevState.clocks.concat({
        running: false,
        seconds: 0,
      }),
    }));
  }

  onClockStart(event, row) {
    this.setState((prevState, props) => {
      const clocks = prevState.clocks;
      clocks.forEach((v, i) => {
        clocks[i].running = false;
      });
      clocks[row].running = true;
      return {
        clocks: clocks,
      };
    });
  }

  onClockPause(event, row) {
    this.setState((prevState, props) => {
      const clocks = prevState.clocks;
      clocks[row].running = false;
      return {
        clocks: clocks,
      };
    });
  }
}

export default Timer;
