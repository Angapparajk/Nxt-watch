import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { BiLike, BiDislike } from 'react-icons/bi';
import { RiMenuAddLine } from 'react-icons/ri';
import Cookies from 'js-cookie';
import ReactPlayer from 'react-player';
import { ThreeDots } from 'react-loader-spinner';
import Header from '../Header';
import Sidebar from '../Sidebar';
import ThemeContext from '../../context/ThemeContext';
import SavedVideosContext from '../../context/SavedVideosContext';
import {
  MainBody,
  SidebarContainer,
  FailureImg,
  FailureContainer,
  FailureText,
  RetryButton,
  LoaderContainer,
  VideoItemDetailsContainer,
  PlayerContainer,
  VideoDetailContainer,
  VideoTextContainer,
  VideoTitle,
  ViewsAndPostedContainer,
  LikesAndViewsContainer,
  ViewsText,
  Button,
  ChannelLogo,
  ChannelDetails,
  ChannelDetailsText,
  ChannelDetailsText2,
  VideoDescriptionText,
} from './styledComponents';

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

const VideoItemDetails = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [videoDetails, setVideoDetails] = useState({});
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const { id } = useParams();
  const { isDarkTheme } = useContext(ThemeContext);
  const theme = isDarkTheme ? 'dark' : 'light';

  useEffect(() => {
    getVideoDetails();
    // eslint-disable-next-line
  }, [id]);

  const getVideoDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get('jwt_token');
    const url = `https://apis.ccbp.in/videos/${id}`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      const videoDetails = data.video_details;
      const updated = {
        id: videoDetails.id,
        description: videoDetails.description,
        publishedAt: videoDetails.published_at,
        thumbnailUrl: videoDetails.thumbnail_url,
        title: videoDetails.title,
        videoUrl: videoDetails.video_url,
        viewCount: videoDetails.view_count,
        channel: {
          name: videoDetails.channel.name,
          profileImageUrl: videoDetails.channel.profile_image_url,
          subscriberCount: videoDetails.channel.subscriber_count,
        },
      };
      setVideoDetails(updated);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const updateLikeState = () => {
    setLike(prev => !prev);
    setDislike(false);
  };

  const updateDislikeState = () => {
    setDislike(prev => !prev);
    setLike(false);
  };

  const successView = () => {
    if (!videoDetails.id) return null;
    const { publishedAt, title, videoUrl, viewCount, channel, description, id } = videoDetails;
    const { name, profileImageUrl, subscriberCount } = channel;
    let postedAt = formatDistanceToNow(new Date(publishedAt));
    const postedAtList = postedAt.split(' ');
    if (postedAtList.length === 3) {
      postedAtList.shift();
      postedAt = postedAtList.join(' ');
    }
    const likeIsActive = like ? 'active' : 'not-active';
    const dislikeIsActive = dislike ? 'active' : 'not-active';
    return (
      <SavedVideosContext.Consumer>
        {val => {
          const { updateSave, savedVideosList } = val;
          const present = savedVideosList.find(each => each.id === id);
          const saveIsActive = present !== undefined ? 'active' : 'not-active';
          const saveText = present !== undefined ? 'Saved' : 'Save';
          // Debug: log the video URL
          console.log('ReactPlayer videoUrl:', videoUrl);
          return (
            <VideoDetailContainer>
              <PlayerContainer>
                <ReactPlayer
                  url={videoUrl}
                  controls
                  width="100%"
                  height="100%"
                />
              </PlayerContainer>
              <VideoTextContainer>
                <VideoTitle theme={theme}>{title}</VideoTitle>
                <LikesAndViewsContainer>
                  <ViewsAndPostedContainer>
                    <ViewsText>{viewCount} views</ViewsText>
                    <ViewsText>{postedAt} ago</ViewsText>
                  </ViewsAndPostedContainer>
                  <div>
                    <Button
                      type="button"
                      theme={likeIsActive}
                      onClick={updateLikeState}
                    >
                      <BiLike size={20} style={{ paddingTop: '6px' }} />
                      Like
                    </Button>
                    <Button
                      type="button"
                      theme={dislikeIsActive}
                      onClick={updateDislikeState}
                    >
                      <BiDislike size={20} style={{ paddingTop: '6px' }} />
                      Dislike
                    </Button>
                    <Button
                      type="button"
                      theme={saveIsActive}
                      onClick={() => updateSave(videoDetails)}
                    >
                      <RiMenuAddLine size={20} style={{ paddingTop: '6px' }} />
                      {saveText}
                    </Button>
                  </div>
                </LikesAndViewsContainer>
                <hr />
                <ChannelDetails>
                  <ChannelLogo src={profileImageUrl} alt="channel logo" />
                  <div>
                    <ChannelDetailsText theme={theme}>{name}</ChannelDetailsText>
                    <ChannelDetailsText2>{subscriberCount}</ChannelDetailsText2>
                  </div>
                </ChannelDetails>
                <VideoDescriptionText theme={theme}>{description}</VideoDescriptionText>
              </VideoTextContainer>
            </VideoDetailContainer>
          );
        }}
      </SavedVideosContext.Consumer>
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
        <FailureText as="p" theme={theme}>
          We are having some trouble to complete your request. Please try again.
        </FailureText>
        <RetryButton type="button" onClick={getVideoDetails}>
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
    <div>
      <Header />
      <MainBody>
        <SidebarContainer>
          <Sidebar />
        </SidebarContainer>
        <VideoItemDetailsContainer data-testid="videoItemDetails" theme={theme}>
          {checkApiStatus()}
        </VideoItemDetailsContainer>
      </MainBody>
    </div>
  );
};

export default VideoItemDetails;
