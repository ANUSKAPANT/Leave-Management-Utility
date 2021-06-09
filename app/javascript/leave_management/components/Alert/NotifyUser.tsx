import React from 'react';

export default function NotifyUser (message:string, position:string, type:string, notifierRef) {
  const options = {
    place: position,
    message: (
      <div>
        <div className="text-capitalize">
          <i className="tim-icons icon-bell-55 pr-4"></i>
          { message }
        </div>
      </div>
    ),
    type,
    icon: '',
    autoDismiss: 2,
  };
  notifierRef.current.notificationAlert(options);
}