import React from 'react';

export default function Loading() {
  return (
    <div className="-loading -active" style={{ zIndex: 3 }}>
      <div className="">
        <div>
          <div
            className="spinner-border ml-2"
            role="status"
            style={{
              height: '80px',
              width: '80px',
              color: '#0069d9',
            }}
          />
        </div>
      </div>
    </div>
  );
}
