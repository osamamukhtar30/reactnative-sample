import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {updateAvatar} from '@duelme/apisdk/dist/slices/account/thunks';
import AvatarService from '@duelme/apisdk/dist/services/AvatarService';
import {useNavigation} from '@react-navigation/native';
import {openModal} from '@duelme/apisdk/dist/slices/modal/native';
import {heightPercentageToDP, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {selectFeatureFlags} from '@duelme/apisdk/dist/slices/featureFlags/selectors';
import ReactNative from 'react-native';

import BackgroundImage from '../../components/background/BackgroundImage';
import LoadingGate from '../../components/LoadingGate/LoadingGate';
import {Container, SafeScrollView} from '../../components/Container';
import {DubbzLogoHeader} from '../../components/DubbzLogoHeader';
import {EngineContextConsumer} from '../../components/BabylonEngineContext/BabylonEngineContext';
import VersusModels from '../../components/VersusModels/VersusModels';
import Button from '../../components/button/Button';
import theme from '../../global-styles/theme';
import useSyncEndpointCall from '../../utils/syncEndpointCall';

const Text = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  color: ${({theme, red}) => (red ? theme.colors.red : theme.colors.white)};
  font-family: 'Quantico';
  text-transform: uppercase;
`;

const AvatarsContainer = styled.View`
  display: flex;
  position: absolute;
  width: 100%;
  height: ${heightPercentageToDP(42)}px;
  flex-direction: row;
  justify-content: space-evenly;
`;

const AvatarContainer = styled.TouchableOpacity`
  width: 49%;
  display: flex;
  ${({clickeable}) =>
    !clickeable &&
    `
    background-color: rgba(0, 0, 0, 0.5);
  `}
  border-radius: 5px;
  border-color: ${({theme, selected}) => (selected ? theme.colors.red : theme.colors.grey)};
  border-width: 2px;
`;

const AvatarOutContainer = styled.View`
  margin-top: 20px;
`;

const ButtonContainer = styled.View`
  width: 90%;
  margin: 0px auto;
  margin-top: 20px;
`;

const ModelsFullBody = styled.View`
  width: 100%;
  height: ${heightPercentageToDP(42)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const ModelFullBody = styled.Image`
  width: 49%;
  height: 100%;
`;

const AvatarCreation = () => {
  const [avatars, setAvatars] = useState([]);

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [t] = useTranslation('global');
  const syncEndpointCall = useSyncEndpointCall();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const featureFlags = useSelector(selectFeatureFlags);
  const modelsEnabled = featureFlags?.iosAvatarRenderEnabled;

  useEffect(() => {
    (async () => {
      let avatarsList = await AvatarService.fetchDefaultAvatars();
      setAvatars(avatarsList);
      setSelectedAvatar(avatarsList[0].url);
    })();
  }, []);

  const handleSaveAvatar = async () => {
    await syncEndpointCall({
      loadingText: t('updating_avatar'),
      reduxAction: updateAvatar({avatarURL: selectedAvatar}),
      successCallback: async () => {
        navigation.navigate('DrawerNavigator');
      },
    });
  };

  return (
    <Container>
      <BackgroundImage />
      <SafeScrollView disableBottomInset={true} disableTopInset={true}>
        <DubbzLogoHeader />
        <Text testID="avatar-creation">
          <Text red>{t('choose')}</Text>
          <Text> {t('avatar')}</Text>
        </Text>
        <LoadingGate style={{marginTop: hp(5)}} loading={avatars.length === 0}>
          <AvatarOutContainer>
            <AvatarsContainer>
              <AvatarContainer />
              <AvatarContainer />
            </AvatarsContainer>
            {ReactNative.Platform.OS === 'ios' && modelsEnabled ? (
              <EngineContextConsumer>
                {values => {
                  return (
                    <VersusModels
                      engine={values.engine}
                      xFactor={1.2}
                      modelOneUrl={avatars[0]?.url}
                      modelTwoUrl={avatars[1]?.url}
                      modelOneAnimationUrl="https://qa-dubbz.com/idleBreathing.glb"
                      modelTwoAnimationUrl="https://qa-dubbz.com/idleBreathing.glb"
                    />
                  );
                }}
              </EngineContextConsumer>
            ) : (
              <ModelsFullBody>
                <ModelFullBody testID="model-one" source={{uri: avatars[0]?.fullBodyPosture}} />
                <ModelFullBody testID="model-two" source={{uri: avatars[1]?.fullBodyPosture}} />
              </ModelsFullBody>
            )}
            <AvatarsContainer>
              <AvatarContainer
                testID={`model-one-controller-${selectedAvatar === avatars[0]?.url ? 'selected' : 'unselected'}`}
                clickeable
                selected={selectedAvatar === avatars[0]?.url}
                onPress={() => setSelectedAvatar(avatars[0]?.url)}
              />
              <AvatarContainer
                testID={`model-two-controller-${selectedAvatar === avatars[1]?.url ? 'selected' : 'unselected'}`}
                clickeable
                selected={selectedAvatar === avatars[1]?.url}
                onPress={() => setSelectedAvatar(avatars[1]?.url)}
              />
            </AvatarsContainer>
          </AvatarOutContainer>
          <ButtonContainer>
            <Button
              text={t('save')}
              fullWidth
              solidColor="transparent"
              borderColor={theme.colors.white}
              onPress={handleSaveAvatar}
            />
            <Button
              text={t('customize')}
              fullWidth
              onPress={() =>
                dispatch(
                  openModal('customizeAvatar', {
                    successCallback: () => {
                      navigation.navigate('DrawerNavigator');
                    },
                  }),
                )
              }
            />
          </ButtonContainer>
        </LoadingGate>
      </SafeScrollView>
    </Container>
  );
};

export default AvatarCreation;
