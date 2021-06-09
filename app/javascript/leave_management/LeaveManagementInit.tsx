import React, { useEffect } from 'react';
import { useStoreContext } from './Store';
import { setUserData, setNotificationRef } from './Actions';

interface UserData {
  role?: string;
}

interface Props {
  userData: UserData;
  children: React.ReactNode;
  notificationAlertRef: object;
}

const LeaveManagementInit:React.FC<Props> = ({ userData, children, notificationAlertRef }) => {
  const { dispatch } = useStoreContext();

  useEffect(
    () => {
      setUserData(dispatch, userData);
      setNotificationRef(dispatch, notificationAlertRef);
    },
    [],
  );

  return (
    <>
      {children}
    </>
  );
}
export default LeaveManagementInit;
