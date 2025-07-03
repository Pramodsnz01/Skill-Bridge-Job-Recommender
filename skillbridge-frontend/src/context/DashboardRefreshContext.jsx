import React, { createContext, useContext, useCallback, useState } from 'react';

const DashboardRefreshContext = createContext();

export const useDashboardRefresh = () => useContext(DashboardRefreshContext);

export const DashboardRefreshProvider = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Call this to trigger a refresh event
  const triggerRefresh = useCallback(() => {
    setRefreshFlag(flag => !flag);
  }, []);

  return (
    <DashboardRefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </DashboardRefreshContext.Provider>
  );
}; 