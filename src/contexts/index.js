// NOTE: This file (like the index.js files throughout the app)
// is a way to "bundle" our imports into a more consistent format
// and to access them from a more consistent location. For instance,
// the export "bundle" statement below allows us to write this single-
// line import statement format:
//   import { TokenProvider, TokenContext } from './path/to/this/directory'
// instead of this multi-line format:
//   import { TokenProvider } from './path/to/this/directory/token.context;
//   import { ListProvider } from './path/to/this/directory/list.context;
//
// In smaller apps like this it's likely an overengineering of imports,
// but it helps keep things tidy, which helps anyone who's brain is easily
// confused by clutter.
//
// Additionally, if you move these imported files around (ie. add nested
// directories, add additional contexts that you need access to), updating
// this file to point to where the file "lives" after the update is the only
// place in the codebase where you should have to update the file path in
// order to find the required imports.

import { TokenContext, TokenProvider } from './token.context';
import { ListContext, ListProvider } from './list.context';

export { TokenContext, ListContext, TokenProvider, ListProvider };
