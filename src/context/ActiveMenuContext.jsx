import { createContext, useState } from 'react';

const ActiveMenuContext = createContext({
  activeMenu: 'INITIAL',
  changeActiveMenu: () => {},
});

export const ActiveMenuContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('INITIAL');
  const changeActiveMenu = menu => setActiveMenu(menu);
  return (
    <ActiveMenuContext.Provider value={{ activeMenu, changeActiveMenu }}>
      {children}
    </ActiveMenuContext.Provider>
  );
};

export default ActiveMenuContext;
