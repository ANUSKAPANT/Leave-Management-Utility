import React from 'react';
import ReactDOM from 'react-dom';
import LeaveManagementApp from '../leave_management';

document.body.classList.add('white-content');

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('user_data');
  const data = JSON.parse(node.getAttribute('data')) || {};

  ReactDOM.render(
    <LeaveManagementApp data={data} />,
    document.body.appendChild(document.createElement('div')),
  );
});
