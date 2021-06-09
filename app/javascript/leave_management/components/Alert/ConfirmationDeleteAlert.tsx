import React from 'react';
import ConfirmationAlert from './ConfirmationAlert';

interface Props {
  deleteMethod?: Function;
  hideAlert?: Function;
  deleted?: boolean;
}

const ConfirmationDeleteAlert:React.FC<Props> = ({ deleteMethod, hideAlert, deleted = false }) => {
  return (
    <ConfirmationAlert {
      ...{
        hideAlert,
        success: deleted,
        handleConfirm: deleteMethod,
        confirmBtnText: 'Yes, delete it!',
        title: 'Deleted!',
      }
  } />
  );
}

export default ConfirmationDeleteAlert;