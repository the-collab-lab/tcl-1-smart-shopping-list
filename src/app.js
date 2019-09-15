import React from 'react';
import Router from './router';
import { TokenProvider, ListProvider } from './contexts';

function App() {
  return (
    // NOTE: this loader would then be available to all views accessed
    // by the router within. This would make more sense if our loader
    // was something like a modal with an tinted overlay slightly obscuring
    // the view behind it so that it's location relative to other DOM
    // elements doesn't matter.

    // <LoadingProvider>
    // <Loader />
    <TokenProvider>
      <ListProvider>
        <Router />
      </ListProvider>
    </TokenProvider>
    // </LoadingProvider>
  );
}

export default App;
