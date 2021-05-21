import React from 'react';

import {
  Router, Route, Switch, Redirect,
} from 'react-router-dom';
import NotificationAlert from 'react-notification-alert';
import { StoreProvider } from './Store';
import LeaveManagementInit from './LeaveManagementInit';
import history from './history';


// eslint-disable-next-line react/prop-types
export default function LeaveManagementApp({ data }) {
  const notificationAlertRef = React.useRef(null);

  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <StoreProvider>
        <Router history={history}>
          <Switch>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Route path="/" render={(props) => <LeaveManagementInit userData={data} notificationAlertRef={notificationAlertRef}></LeaveManagementInit>} />
            {/* <Redirect from="/" to="/admin/dashboard" /> */}
          </Switch>
        </Router>
      </StoreProvider>
    </>
  );
}
