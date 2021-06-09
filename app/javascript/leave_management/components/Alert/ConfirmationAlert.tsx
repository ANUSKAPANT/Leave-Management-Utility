import * as React from 'react';
import ReactBSAlert from 'react-bootstrap-sweetalert';

interface Props {
  handleConfirm?: Function;
  hideAlert: Function;
  success: boolean;
  confirmBtnText: string;
  successMessage?: string;
  title: string;
}

const ConfirmationAlert: React.FC<Props> = ({
  handleConfirm, hideAlert, success = false, confirmBtnText, successMessage = "Success!", title,
}) => {
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

export default ConfirmationAlert;
