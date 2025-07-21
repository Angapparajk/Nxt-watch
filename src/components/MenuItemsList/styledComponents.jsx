import styled from 'styled-components'

export const MenuList = styled.ul`
  list-style: none;
  padding-left: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0px;
`

export const MenuLink = styled.li`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? (theme === 'dark' ? '#383838' : '#e2e8f0') : 'transparent'};
  color: ${({ $isActive, theme }) =>
    $isActive ? '#ff0b37' : theme === 'dark' ? '#f9f9f9' : '#181818'};
  border-radius: 8px;
  margin-bottom: 8px;
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
`;

export const MenuHeading = styled.p`
  font-weight: 500;
  padding-left: 15px;
  text-decoration: none;
  color: ${props => (props.theme === 'dark' ? '#f9f9f9' : '#0f0f0f')};
  font-family: Roboto;
  font-size: 16px;
`
