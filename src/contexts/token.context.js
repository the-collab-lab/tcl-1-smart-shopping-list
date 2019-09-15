import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import getToken from '../lib/token';

const TokenContext = createContext({
  token: '',
  setTokenValue: () => {},
});

const TokenProvider = ({ children }) => {
  const setTokenValue = newToken => {
    setToken(prev => {
      const prevToken = { ...prev };
      const merged = { ...prevToken, ...{ token: newToken } };

      localStorage.setItem('token', newToken);
      return merged;
    });
  };

  const confirmToken = () => {
    const storedToken = localStorage.getItem('token');

    if (!!storedToken) return storedToken;
    else return getToken();
  };

  // NOTE: this is where we're passing the init/reset values to our fancy
  // new TokenProvider "wrapper" component
  const tokenValueReset = {
    // NOTE ON TOKEN VALUE: since we store tokens in localStorage so that
    // they persist between reloads and different sessions (on the same
    // device/browser), we'd like to reuse a stored token if it exists,
    // otherwise set an init value
    token: localStorage.getItem('token') || '',
    setTokenValue,
    confirmToken,
  };

  // NOTE: under the hood it's really just a useState hook  with some
  // extra features managing the state of our application.
  const [token, setToken] = useState(tokenValueReset);

  // NOTE: Here you can see that behind our concisely named provider component
  // (<TokenContext /> in this case) is the stock TokenContext Provider syntax
  // the usefulness here is that we're able to pull all the context logic out
  // into it's own component(s) in order to keep app.js more tidy and concise.
  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
};

// NOTE: whichever (single) portion of this file you "export default" will be
// accessible from other files with the following import statement format:
//   import MagicComponent from './path/to/this/directory/this.file.js'
// whereas whatever (allows for more than one!) portion of this file you "export"
// is accessible from other files with the following import statement format:
//   import { MagicComponent, SpecialComponent } from './path/to/this/directory/this.file.js
//
// Additionally, do note that not every part of your file needs to or should be
// exported. There will likely be many instances where you keep single-use helpers
// in the file with where they'll be used, but since they aren't applicable to
// other areas of our application, it's fine to leave them tucked away without an export.
export { TokenContext, TokenProvider };

TokenProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
TokenProvider.defaultProps = {};
