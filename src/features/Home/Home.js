import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {RefreshControl} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {fetchCurrentUser} from '@duelme/apisdk/dist/slices/account/thunks';
import {fetchUserStatus} from '@duelme/apisdk/dist/slices/userStatus/thunks';
import {fetchQuickInvites} from '@duelme/apisdk/dist/slices/quickActions/thunks';
import {fetchFriendRequests} from '@duelme/apisdk/dist/slices/friendships/thunks';
import {fetchPendingNotifications} from '@duelme/apisdk/dist/slices/p3Notification/thunks';
import {useFocusEffect} from '@react-navigation/native';
import {selectAllLiveStreams} from '@duelme/apisdk/dist/slices/liveStreams/selectors';
import {fetchAllLiveStreams} from '@duelme/apisdk/dist/slices/liveStreams/thunks';
import {fetchOpenChallenges} from '@duelme/apisdk/dist/slices/matchmaking/thunks';

import {Container, ContainerWithTabBar, SafeScrollView} from '../../components/Container';
import TournamentsList from '../../components/TournamentsList/TournamentsList';
import RecentTournamentsList from '../../components/TournamentsList/RecentTournamentsList';
import GameCard from '../../components/GameCard/GameCard';
import MatchHistoryCard from '../../components/MatchHistory/MatchHistoryCard';
import Wallet from '../../components/Wallet/Wallet';
import BackgroundImage from '../../components/background/BackgroundImage';
import StreamsCarousel from '../StreamsCarousel/StreamsCarousel';
import AsyncNavigator from '../../components/AsyncNavigator/AsyncNavigator';
import theme from '../../global-styles/theme';
import OpenChallenges from '../../components/OpenChallenges/OpenChallenges';
import UpcomingMatches from '../../components/UpcomingMatches/UpcomingMatches';

const WidthContainer = styled.View`
  width: 90%;
  margin: ${hp(2)}px auto;
`;

const selectAllComponentsLoaded = state => {
  return !state.tournaments.isLoading;
};

const Home = () => {
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [refreshing, setRefreshin] = useState(false);
  const componentsLoaded = useSelector(selectAllComponentsLoaded);
  const streams = useSelector(selectAllLiveStreams);
  const scrollRef = useRef();
  const dispatch = useDispatch();

  const onRefresh = () => {
    setRefreshin(true);
    setShouldRefresh(true);
    Promise.all([
      dispatch(fetchCurrentUser()),
      dispatch(fetchUserStatus()),
      dispatch(fetchQuickInvites()),
      dispatch(fetchFriendRequests()),
      dispatch(fetchPendingNotifications()),
      dispatch(fetchAllLiveStreams()),
      dispatch(fetchOpenChallenges()),
    ]).then(() => setRefreshin(false));

    // In case something fails and the promise are not resolved
    setTimeout(() => setRefreshin(false), 15000);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchOpenChallenges());
      dispatch(fetchAllLiveStreams());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({x: 0, y: hp(-15), animated: true});
      }
    }, [scrollRef]),
  );

  useEffect(() => {
    if (componentsLoaded) {
      setShouldRefresh(false);
    }
  }, [componentsLoaded]);

  return (
    <Container testID="home">
      <AsyncNavigator />
      <BackgroundImage url={require('../../assets/Backgrounds/background2.webp')} />
      <ContainerWithTabBar>
        <SafeScrollView
          testID="home-scroll-view"
          useRef={scrollRef}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.white}
              progressViewOffset={hp(15)}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <GameCard />
          <TournamentsList isDashboard={true} mode="user_tournaments" shouldRefresh={shouldRefresh} />
          <TournamentsList isDashboard={true} mode="suggested" shouldRefresh={shouldRefresh} />
          <UpcomingMatches />
          <OpenChallenges />
          <WidthContainer>
            <Wallet />
          </WidthContainer>

          <MatchHistoryCard />
          <RecentTournamentsList />
          <StreamsCarousel streams={streams} />
        </SafeScrollView>
      </ContainerWithTabBar>
    </Container>
  );
};

export default Home;
