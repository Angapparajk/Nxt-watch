import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ThemeContext from '../../Context/ThemeContext';
import {
  LoginContainer,
  LoginCardContainer,
  WebsiteLogo,
  Label,
  LoginInput,
  Form,
  ShowPasswordLabel,
  LoginButton,
  ErrorMsg,
} from './styledComponents';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [errorMsg, setErrorMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const { isDarkTheme } = useContext(ThemeContext);
  const theme = isDarkTheme ? 'dark' : 'light';

  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />;
  }

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    setIsError(false);
    navigate('/', { replace: true });
  };

  const onSubmitFailure = errorMsg => {
    setErrorMsg(errorMsg);
    setIsError(true);
  };

  const onSubmit = async event => {
    event.preventDefault();
    const userDetails = { username, password };
    const apiUrl = 'https://apis.ccbp.in/login';
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token);
    } else {
      onSubmitFailure(data.error_msg);
    }
  };

  const onCheckBox = event => {
    setPasswordType(event.target.checked ? 'text' : 'password');
  };

  const updateUsername = event => {
    setUsername(event.target.value);
  };

  const updatePassword = event => {
    setPassword(event.target.value);
  };

  const websiteLogo = isDarkTheme
    ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
    : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png';

  return (
    <LoginContainer theme={theme}>
      <LoginCardContainer theme={theme}>
        <WebsiteLogo src={websiteLogo} alt="website logo" />
        <Form onSubmit={onSubmit}>
          <Label htmlFor="username" theme={theme}>
            USERNAME
          </Label>
          <LoginInput
            type="text"
            id="username"
            placeholder="Username"
            theme={theme}
            value={username}
            onChange={updateUsername}
          />
          <Label htmlFor="password" theme={theme}>
            PASSWORD
          </Label>
          <LoginInput
            type={passwordType}
            id="password"
            placeholder="Password"
            theme={theme}
            value={password}
            onChange={updatePassword}
          />
          <input
            type="checkbox"
            id="showPassword"
            onClick={onCheckBox}
          />
          <ShowPasswordLabel theme={theme} htmlFor="showPassword">
            Show Password
          </ShowPasswordLabel>
          <div>
            <LoginButton type="submit">Login</LoginButton>
          </div>
          <ErrorMsg>{isError && `* ${errorMsg}`}</ErrorMsg>
        </Form>
      </LoginCardContainer>
    </LoginContainer>
  );
};

export default Login;
