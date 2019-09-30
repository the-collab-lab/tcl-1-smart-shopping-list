import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const ListContext = createContext({
  value: [],
  updateListValue: () => {},
});

const ListProvider = ({ children }) => {
  // NOTE: setListValue is just a wrapper around our setList hook action with some helper
  // logic included so that it formats or otherwise handles the data before the list
  // state's value is updated.
  //
  // In this particular helper we are
  // 1) taking the argument to the setList, which is a record of the previous value for
  //    `list` that will be overwritten as soon as our setList hook action is called, we
  //    are going to merge the two object with the javascript spread syntax. In short,
  //    we can merge these two objects:
  //      const objectA = { greeting: 'hello', action: 'wave' };
  //      const objectB = { greeting: 'goodbye' };
  //    into one object like this:
  //      const objectC = { ...objectA, ...objectB };
  //    which results in the following object:
  //      console.log(objectC) ==> { greeting: 'goodbye', action: 'wave' }
  //
  // 2) once we have that newly-merged object, we return the new object, which
  //    in this case passes it to setList, which updates our fancy ContextProvider
  //    with a fresh value without overwriting all the other functions it contains.
  //
  // NOTE: in case the return statement looks weird, these two variable declarations
  // result in the same object, just different (ES6 / ECMAScript 2015?) syntax:
  //   const objectD = { value }
  //   const objectE = { value: value }
  const setListValue = newList => {
    setList(prev => {
      const prevList = { ...prev };
      return { ...prevList, ...{ list: newList } };
    });
  };

  // NOTE: this is where we're passing the init/reset values to our fancy
  // new ListProvider "wrapper" component
  const listValueReset = { list: [], setListValue };

  // NOTE: under the hood it's really just a useState hook  with some
  // extra features managing the state of our application.
  const [list, setList] = useState(listValueReset);

  // NOTE: Here you can see that behind our concisely named provider component
  // (<ListContext /> in this case) is the stock ListContext Provider syntax
  // the usefulness here is that we're able to pull all the context logic out
  // into it's own component(s) in order to keep app.js more tidy and concise.
  return <ListContext.Provider value={list}>{children}</ListContext.Provider>;
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
export { ListContext, ListProvider };

ListProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
ListProvider.defaultProps = {};
