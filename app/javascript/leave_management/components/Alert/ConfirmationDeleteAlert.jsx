import React from 'react';
import PropTypes from 'prop-types';
import ConfirmationAlert from './ConfirmationAlert';

export default function ConfirmationDeleteAlert({ deleteMethod, hideAlert, deleted }) {
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

ConfirmationDeleteAlert.propTypes = {
  deleteMethod: PropTypes.func,
  deleted: PropTypes.bool,
  hideAlert: PropTypes.func.isRequired,
};

ConfirmationDeleteAlert.defaultProps = {
  deleteMethod: () => 1,
  deleted: false,
};
