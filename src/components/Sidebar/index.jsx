import { useContext } from 'react';
import MenuItemsList from '../MenuItemsList';
import ThemeContext from '../../context/ThemeContext';
import {
  SidebarContainer,
  LogoIcons,
  ContactUsContainer,
  Text,
} from './styledComponents';

const Sidebar = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const theme = isDarkTheme ? 'dark' : 'light';
  return (
    <SidebarContainer theme={theme}>
      <MenuItemsList />
      <ContactUsContainer>
        <Text theme={theme}>CONTACT US</Text>
        <div>
          <LogoIcons
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-twitter-logo-img.png"
            alt="twitter logo"
          />
          <LogoIcons
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-facebook-logo-img.png"
            alt="facebook logo"
          />
          <LogoIcons
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-linked-in-logo-img.png"
            alt="linked in logo"
          />
        </div>
        <Text theme={theme}>
          Enjoy! Now to see your channels and recommendations!
        </Text>
      </ContactUsContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
