# Tag timer for Freckle

Freckle's timer is project focused, which is a poor UI for teams who stick to a
small number of projects. This alternative take on a timer captures multiple
entries for a single project at the same time, encouraging team members to be
more explicit in their logging (without adding significant friction to the time
logging process).

## Requirements

* The [Freckle Auth OAuth proxy](https://github.com/deviantintegral/freckle_auth).
* A CORS proxy like [cors-anywhere](https://github.com/Rob--W/cors-anywhere), as
  Freckle doesn't set CORS headers in their API.

## Running locally

Use the following environment variables to configure the URIs for the other
required services, such as:

`$ OAUTH_PROXY=http://localhost:8080 FRECKLE_PROXY=http://localhost:8081 yarn start`
