import React from 'react';

import {
  Router, Route, Switch, Redirect,
} from 'react-router-dom';
import NotificationAlert from 'react-notification-alert';
import { StoreProvider } from './Store';
import LeaveManagementInit from './LeaveManagementInit';
import history from './history';
import AdminLayout from './layouts/Admin';

interface Props {
  data: object;
}

const LeaveManagementApp: React.FC<Props> = ({ data }) => {
  const notificationAlertRef = React.useRef(null);

  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <StoreProvider>
        <Router history={history}>
          <Switch>
            <Route path="/admin" render={(props) => <LeaveManagementInit userData={data} notificationAlertRef={notificationAlertRef}><AdminLayout /></LeaveManagementInit>} />
            <Redirect from="/" to="/admin/dashboard" />
          </Switch>
        </Router>
      </StoreProvider>
    </>
  );
};

export default LeaveManagementApp;
