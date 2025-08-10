import { createContext, useState, useContext } from 'react';

// 1. Create context with default value
const CountContext = createContext(0);

// 2. Create a provider component
function CountProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  return (
    <CountContext.Provider value={count}>
      {children}
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
    </CountContext.Provider>
  );
}

// 3. Create a child component to consume the context
function ShowCount() {
  const count = useContext(CountContext);
  return <p>Count is: {count}</p>;
}

// 4. App component that uses the provider and consumer
export default function Test() {
  return (
    <CountProvider>
      <ShowCount />
    </CountProvider>
  );
}
