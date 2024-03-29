import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: 0,
  userToken: '',
  login: () => {},
  logout: () => {}
});
