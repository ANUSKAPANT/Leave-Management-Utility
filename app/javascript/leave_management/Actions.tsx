export const setUserData = (dispatch: Function, payload: object) => dispatch({
  type: 'SET_USER_DATA',
  payload,
});

export const setNotificationRef = (dispatch: Function, payload: object) => dispatch({
  type: 'SET_NOTIFICATION_REF',
  payload,
});
