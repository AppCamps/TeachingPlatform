import React from "react";
import ReactDOM from "react-dom";

import { browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import store from "./store";
import Root from "./containers/root";

// global css styles
import "./style.scss";

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById("root")
);
