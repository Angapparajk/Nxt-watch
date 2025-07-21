import { useState, useEffect, useContext } from 'react';
import { IoMdClose } from 'react-icons/io';
import { BsSearch } from 'react-icons/bs';
import Cookies from 'js-cookie';
import { ThreeDots } from 'react-loader-spinner';
import Header from '../Header';
import Sidebar from '../Sidebar';
import HomeBody from '../HomeBody';
import ThemeContext from '../../Context/ThemeContext';
import {
  MainBody,
  SidebarContainer,
  HomeContainer,
  GetPremium,
  BannerLogo,
  GetItButton,
  BannerText,
  CloseButton,
  SearchInput,
  SearchContainer,
  SearchButton,
  VideosList,
  LoaderContainer,
  FailureImg,
  FailureContainer,
  FailureText,
  RetryButton,
  NoVideosImg,
  NoVideosContainer,
  HomeMainContainer,
} from './styledComponents';

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

const Home = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [isPopup, setIsPopup] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [videosList, setVideosList] = useState([]);
  const themeContext = useContext(ThemeContext);
  const { isDarkTheme } = themeContext;
  const theme = isDarkTheme ? 'dark' : 'light';
  const color = isDarkTheme ? '#f9f9f9' : '#181818';

  useEffect(() => {
    getVideos();
    // eslint-disable-next-line
  }, []);

  const getVideos = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get('jwt_token');
    const url = `https://apis.ccbp.in/videos/all?search=${searchInput}`;
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

  const onClickCloseBanner = () => {
    setIsPopup(false);
  };

  const adPopup = () => (
    <GetPremium data-testid="banner">
      <CloseButton type="button" data-testid="close" onClick={onClickCloseBanner}>
        <IoMdClose size={16} />
      </CloseButton>
      <BannerLogo
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
        alt="nxt watch logo"
      />
      <BannerText>Buy Nxt Watch Premium prepaid plans with UPI</BannerText>
      <GetItButton>GET IT NOW </GetItButton>
    </GetPremium>
  );

  const updateSearchInput = event => {
    setSearchInput(event.target.value);
  };

  const noVideosView = () => (
    <NoVideosContainer>
      <NoVideosImg
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
        alt="no videos"
      />
      <FailureText theme={theme}>No search results found</FailureText>
      <FailureText theme={theme} as="p">
        Try different key words or remove search filter
      </FailureText>
      <RetryButton type="button" onClick={getVideos}>
        Retry
      </RetryButton>
    </NoVideosContainer>
  );

  const successView = () => {
    if (videosList.length === 0) {
      return noVideosView();
    }
    return (
      <VideosList>
        {videosList.map(each => (
          <HomeBody key={each.id} videoDetails={each} />
        ))}
      </VideosList>
    );
  };

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

  const loader = () => (
    <LoaderContainer className="loader-container" data-testid="loader">
      <ThreeDots
        color={isDarkTheme ? '#ffffff' : '#000000'}
        height={50}
        width={50}
      />
    </LoaderContainer>
  );

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
    <HomeMainContainer data-testid="home" theme={theme}>
      <Header />
      <MainBody>
        <SidebarContainer>
          <Sidebar />
        </SidebarContainer>
        <HomeContainer>
          {isPopup && adPopup()}
          <SearchContainer>
            <SearchInput
              theme={theme}
              type="search"
              placeholder="Search"
              onChange={updateSearchInput}
              value={searchInput}
            />
            <SearchButton
              type="button"
              theme={theme}
              onClick={getVideos}
              data-testid="searchButton"
            >
              <BsSearch color={color} />
            </SearchButton>
          </SearchContainer>
          {checkApiStatus()}
        </HomeContainer>
      </MainBody>
    </HomeMainContainer>
  );
};

export default Home;
