import { createContext, useState } from 'react';

const ThemeContext = createContext({
  isDarkTheme: false,
  changeTheme: () => {},
});

export const ThemeContextProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const changeTheme = () => setIsDarkTheme(prev => !prev);
  return (
    <ThemeContext.Provider value={{ isDarkTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
