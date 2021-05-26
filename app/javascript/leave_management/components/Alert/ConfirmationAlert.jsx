import React from 'react';
import PropTypes from 'prop-types';
import ReactBSAlert from 'react-bootstrap-sweetalert';

export default function ConfirmationAlert({
  handleConfirm, hideAlert, success = false, confirmBtnText, successMessage, title,
}) {
  return (
    <>
      {!success && (
        <ReactBSAlert
          warning
          style={{ display: 'block', marginTop: '100px' }}
          title="Are you sure?"
          onConfirm={() => handleConfirm()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          confirmBtnText={confirmBtnText}
          cancelBtnText="Cancel"
          showCancel
          btnSize=""
        />

      )}
      {success && (
        <ReactBSAlert
          success
          style={{ display: 'block', marginTop: '100px' }}
          title={title}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="success"
          btnSize=""
        >
          { successMessage }
        </ReactBSAlert>
      )}
    </>

  );
}

ConfirmationAlert.propTypes = {
  handleConfirm: PropTypes.func,
  success: PropTypes.bool.isRequired,
  hideAlert: PropTypes.func.isRequired,
  confirmBtnText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  successMessage: PropTypes.string,
};

ConfirmationAlert.defaultProps = {
  successMessage: "Success!",
  handleConfirm: () => 1,
};
