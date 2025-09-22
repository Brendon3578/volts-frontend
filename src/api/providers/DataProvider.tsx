/**
 * Data Provider
 * Provides data access functionality throughout the application using React Context
 * This abstraction allows easy switching between LocalStorage and API adapters
 */

import { createContext, useContext, type ReactNode } from "react";
import type { IDataAdapter } from "../adapters/IDataAdapter";
import LocalStorageAdapter from "../adapters/LocalStorageAdapter";

// import ApiAdapter from '../adapters/ApiAdapter';

interface DataProviderProps {
  children: ReactNode;
  adapter?: IDataAdapter;
}

const DataContext = createContext<IDataAdapter | null>(null);

export function DataProvider({ children, adapter }: DataProviderProps) {
  // Default to LocalStorageAdapter for demo
  // To switch to API: adapter = new ApiAdapter('http://your-api-url/api', authToken)
  const dataAdapter = adapter || new LocalStorageAdapter();

  return (
    <DataContext.Provider value={dataAdapter}>{children}</DataContext.Provider>
  );
}

export function useDataAdapter(): IDataAdapter {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useDataAdapter must be used within a DataProvider");
  }
  return context;
}

/**
 * MIGRATION GUIDE: Switching from LocalStorage to API
 *
 * 1. Replace LocalStorageAdapter with ApiAdapter in this file:
 *
 * import ApiAdapter from '../adapters/ApiAdapter';
 *
 * const dataAdapter = adapter || new ApiAdapter('http://your-api-url/api', authToken);
 *
 * 2. Or pass the adapter as a prop:
 *
 * <DataProvider adapter={new ApiAdapter('http://localhost:3001/api')}>
 *   <App />
 * </DataProvider>
 *
 * 3. All hooks and components will automatically use the new adapter
 * without any code changes thanks to the adapter pattern!
 */
