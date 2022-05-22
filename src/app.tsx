import React from 'react';
import { FirebaseContainer } from './containers/firebase';
import Router from './router'

interface AppProps { }

function App({ }: AppProps) {
  return (
    <FirebaseContainer.Provider>
      <AppGate>
        <Router />
      </AppGate>
    </FirebaseContainer.Provider>
  );
}

const AppGate = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => {
  const { app } = FirebaseContainer.useContainer();
  if (!app) return <p>loading app...</p>;
  return children;
};

export default App;
