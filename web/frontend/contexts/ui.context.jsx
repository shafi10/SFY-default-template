import React from "react";

const initialState = {
  customers: [],
  shop: {},
};

export const UIContext = React.createContext(initialState);

UIContext.displayName = "UIContext";

function uiReducer(state, action) {
  switch (action.type) {
    case "SET_CUSTOMERS": {
      return {
        ...state,
        customers: action.payload,
      };
    }
    case "SET_SHOP": {
      return {
        ...state,
        shop: action.payload,
      };
    }
  }
}

export const UIProvider = (props) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);

  const setCustomers = (payload) =>
    dispatch({ type: "SET_CUSTOMERS", payload });

  const setShop = (payload) => dispatch({ type: "SET_SHOP", payload });

  const value = React.useMemo(
    () => ({
      ...state,
      setCustomers,
      setShop,
    }),
    [state]
  );
  return <UIContext.Provider value={value} {...props} />;
};

export const useUI = () => {
  const context = React.useContext(UIContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`);
  }
  return context;
};

export const ManagedUIContext = ({ children }) => (
  <UIProvider>{children}</UIProvider>
);
