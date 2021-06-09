import React from 'react';

export const useStoreContext = () => React.useContext(Store);

const initialState = {
  userData: {},
  notificationRef: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };
    case 'SET_NOTIFICATION_REF':
      return { ...state, notificationRef: action.payload };
    default:
      return state;
  }
}

interface Props {
  children: React.ReactNode;
}

export const StoreProvider:React.FC<Props> = ({ children }) => {
  const [globalState, dispatch] = React.useReducer(reducer, initialState);
  const value = { globalState, dispatch };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}

const Store = React.createContext(null);
export default Store;
