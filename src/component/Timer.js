import React, {Component} from 'react';

import parseLinkHeader from 'parse-link-header';
import TagRow from './TagRow.js';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selectedProject: null,
      clocks: [Timer._initialClock()],
    };

    // Binding callback methods.
    this.handleAddAnother = this.handleAddAnother.bind(this);
    this.onClockStart = this.onClockStart.bind(this);
    this.onClockPause = this.onClockPause.bind(this);
    this.onIncrement = this.onIncrement.bind(this);
    this.logAll = this.logAll.bind(this);
    this.onSelectProject = this.onSelectProject.bind(this);
    this.onTagChange = this.onTagChange.bind(this);
    this.onNoteChange = this.onNoteChange.bind(this);
  }

  /**
   * Return an object for a new clock.
   *
   * @returns {{running: boolean, seconds: number, tag: string, note: string}}
   * @private
   */
  static _initialClock() {
    return {
      running: false,
      seconds: 0,
      lastTick: new Date(),
      tag: '',
      note: '',
    };
  }

  /**
   * Initiate an API request to fetch all projects.
   */
  componentDidMount() {
    this.projects();
  }

  freckleFetch(url, options = {}) {
    if (options.headers instanceof Headers) {
      options.headers.append('Authorization', 'Bearer ' + this.props.accessToken);
    }

    // Todo add centralized refreshToken handling.
    return fetch (this.props.freckleProxy + '/' + url, Object.assign({
      headers: new Headers(({'Authorization': 'Bearer ' + this.props.accessToken})),
    }, options));
  }

  /**
   * Fetch all projects from Freckle.
   *
   * @param {string} next
   *   The next page request, if available. Otherwise, it is assumed this is
   *   the first request.
   */
  projects(next = '') {
    // Reset the state of projects, and prepare our initial API call.
    if (!next) {
      this.setState(() => ({
        projects: [],
      }));

      next = 'https://api.letsfreckle.com/v2/projects/?enabled=true&per_page=100';
    }

    const timer = this;
    this.freckleFetch(next).then(function (response) {
      // Queue the next API call if required.
      if (response.headers.has('Link')) {
        const link = parseLinkHeader(response.headers.get('Link'));
        if (link.next) {
          timer.projects(link.next.url);
        }
      }
      return response.json();
    })
   .then(function (data) {
     // Freckle looks to always return in alphanumeric order.
     timer.setState((prevState) => ({
       projects: prevState.projects.concat(data),
     }));
    });
  }

  /**
   * Log all non-zero timers to Freckle.
   */
  logAll() {
    const entries = 'https://api.letsfreckle.com/v2/entries';
    const timer = this;

    this.state.clocks.forEach((v, i) => {
      // Skip unused clocks.
      if (v.seconds === 0) {
        return;
      }

      // An empty description is allowed.
      const description = (v.tag + ' ' + v.note).trim();

      // Round up all entries to at least one minute.
      const entry = {
        date: new Date().toISOString(),
        minutes: Math.max(Math.round(v.seconds / 60), 1),
        description: description,
        project_id: Number.parseInt(timer.state.selectedProject, 10),
      };

      timer.freckleFetch(entries, {
        method: 'POST',
        body: JSON.stringify(entry),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then(res => res.json())
        .then(response => {
          // @todo Error handling for failed requests.
          const clocks = this.state.clocks;
          clocks.splice(i, 1);
          timer.setState({
            clocks: clocks,
          })
        });
    });
  }

  onIncrement(event, row) {
    this.setState((prevState) => {
      const clocks = prevState.clocks;

      // Background timers may slow, so we need to use the real time to keep
      // clocks in sync.
      const now = new Date();
      clocks[row].seconds += Math.round((now - clocks[row].lastTick) / 1000);
      clocks[row].lastTick = now;
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

  onTagChange(event, row) {
    event.persist();
    this.setState((prevState) => {
      const clocks = prevState.clocks;
      clocks[row].tag = event.target.value;
      return {
        clocks: clocks,
      };
    });
  }

  onNoteChange(event, row) {
    event.persist();
    this.setState((prevState) => {
      const clocks = prevState.clocks;
      clocks[row].note = event.target.value;
      return {
        clocks: clocks,
      };
    });
  }

  render() {
    let projects;
    let rows = [];
    let logAll;
    if (this.state.projects.length) {
      const options = this.state.projects.map((project) =>
        <option key={project.id} value={project.id}>{project.name}</option>
      );
      options.unshift(<option key="select" value="">Select a project...</option>);
      projects = (
        <select onChange={this.onSelectProject}>
          {options}
        </select>
      );
      for (let i = 0; i <= this.state.clocks.length - 1; i++) {
        let last = (i === this.state.clocks.length - 1);
        rows[i] = <TagRow key={i} row={i}
                          {...this.state.clocks[i]}
                          onTagInit={this.handleAddAnother}
                          onTagChange={this.onTagChange}
                          onNoteChange={this.onNoteChange}
                          onClockStart={this.onClockStart}
                          onClockPause={this.onClockPause}
                          onIncrement={this.onIncrement} last={last}/>;
      }

      logAll = <input className="App-submit" type="button" value="Log all timers" onClick={this.logAll}/>;
    }

    return (
      <div>
        {projects}
        <div>
          {rows}
          {logAll}
        </div>
        <div className="App-known-issues">
          <p>Known issues:</p>
          <ul>
            <li>There is absolutely no timer data saved unless they are logged, either client or server side. Take screenshots before submitting!</li>
            <li>Timer data is not synced between tabs or computers.</li>
            <li>OAuth refreshing is not implemented yet. Be prepared to manually delete cookies.</li>
          </ul>
        </div>
      </div>
    );
  }

  handleAddAnother(event) {
    this.setState((prevState, props) => ({
      clocks: prevState.clocks.concat(Timer._initialClock()),
    }));
  }

  onClockStart(event, row) {
    this.setState((prevState, props) => {
      const clocks = prevState.clocks;
      clocks.forEach((v, i) => {
        clocks[i].running = false;
      });
      clocks[row].running = true;
      clocks[row].lastTick = new Date();
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
