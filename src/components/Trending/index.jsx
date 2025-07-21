import { useState, useEffect, useContext } from 'react';
import { AiFillFire } from 'react-icons/ai';
import { ThreeDots } from 'react-loader-spinner';
import Cookies from 'js-cookie';
import Header from '../Header';
import Sidebar from '../Sidebar';
import TrendingVideoCard from '../TrendingVideoCard';
import ThemeContext from '../../Context/ThemeContext';
import {
  MainBody,
  SidebarContainer,
  TrendingContainer,
  TrendingMenuContainer,
  IconContainer,
  MenuHeading,
  LoaderContainer,
  FailureContainer,
  FailureImg,
  FailureText,
  RetryButton,
  VideosList,
  TrendingMainContainer,
} from './styledComponents';

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

const Trending = () => {
  const [videosList, setVideosList] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const { isDarkTheme } = useContext(ThemeContext);
  const theme = isDarkTheme ? 'dark' : 'light';

  useEffect(() => {
    getVideos();
    // eslint-disable-next-line
  }, []);

  const getVideos = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get('jwt_token');
    const url = 'https://apis.ccbp.in/videos/trending';
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      const updatedData = data.videos.map(eachItem => ({
        id: eachItem.id,
        channel: {
          name: eachItem.channel.name,
          profileImageUrl: eachItem.channel.profile_image_url,
        },
        publishedAt: eachItem.published_at,
        thumbnailUrl: eachItem.thumbnail_url,
        title: eachItem.title,
        viewCount: eachItem.view_count,
      }));
      setVideosList(updatedData);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const successView = () => (
    <VideosList>
      {videosList.map(each => (
        <TrendingVideoCard videoDetails={each} key={each.id} />
      ))}
    </VideosList>
  );

  const loader = () => (
    <LoaderContainer className="loader-container" data-testid="loader">
      <ThreeDots
        color={isDarkTheme ? '#ffffff' : '#000000'}
        height={50}
        width={50}
      />
    </LoaderContainer>
  );

  const failureView = () => {
    const imgUrl = isDarkTheme
      ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
      : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png';
    return (
      <FailureContainer>
        <FailureImg src={imgUrl} alt="failure view" />
        <FailureText theme={theme}>Oops! Something Went Wrong</FailureText>
        <FailureText theme={theme} as="p">
          We are having some trouble to complete your request. Please try again
        </FailureText>
        <RetryButton type="button" onClick={getVideos}>
          Retry
        </RetryButton>
      </FailureContainer>
    );
  };

  const checkApiStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return successView();
      case apiStatusConstants.failure:
        return failureView();
      case apiStatusConstants.inProgress:
        return loader();
      default:
        return null;
    }
  };

  return (
    <TrendingMainContainer data-testid="trending" theme={theme}>
      <Header />
      <MainBody>
        <SidebarContainer>
          <Sidebar />
        </SidebarContainer>
        <TrendingContainer>
          <TrendingMenuContainer theme={theme}>
            <IconContainer theme={theme}>
              <AiFillFire size={40} color="#ff0b37" />
            </IconContainer>
            <MenuHeading theme={theme}>Trending</MenuHeading>
          </TrendingMenuContainer>
          {checkApiStatus()}
        </TrendingContainer>
      </MainBody>
    </TrendingMainContainer>
  );
};

export default Trending;
