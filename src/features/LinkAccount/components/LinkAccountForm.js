import React, {useState} from 'react';
import {createGameAccount, editGameAccount} from '@duelme/apisdk/dist/slices/gameAccounts/thunks';
import {Formik, validateYupSchema, yupToFormErrors} from 'formik';
import {useSelector, useDispatch} from 'react-redux';
import {Trans, useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {selectSelectedGame, selectGameById} from '@duelme/apisdk/dist/slices/games/selectors';
import * as yup from 'yup';
import {View} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-fontawesome-pro';
import {selectCurrentUser} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import {openModal, closeModal} from '@duelme/apisdk/dist/slices/modal/native';
import {
  GAME_REGIONS,
  STEAM_GAMES,
  PLATFORM_NAME_PC,
  PLATFORM_NAME_PS4,
  PLATFORM_NAME_PS5,
  PLATFORM_NAME_XBOX_ONE,
  PLATFORM_NAME_XBOX_SERIES_X,
  GAME_ID_FORTNITE,
  GAME_ID_FIFA_23,
  GAME_ID_MADDEN_23,
  GAME_ID_NBA_23,
  GAME_ID_COD_MW2,
  GAME_ID_COD_VANGUARD,
  GAME_ID_COD_WARZONE,
  GAME_ID_COD_WARZONE_2,
} from '@duelme/js-constants/dist/games';

import useSyncEndpointCall from '../../../utils/syncEndpointCall';
import Button from '../../../components/button/Button';
import CustomTextInput from '../../../components/Inputs/TextInput';
import {platformIconName} from '../../../utils/icons';
import SteamButton from '../../../components/button/Steam';
import Spacer from '../../../components/Spacer/Spacer';
import NoDepsCarousel, {InnerView} from '../../../components/NoDepsCarousel/NoDepsCarousel';
import {SafeScrollView} from '../../../components/Container';

const InputContainer = styled.View`
  margin: 0px auto;
  margin-top: 20px;
  width: 90%;
`;

const ButtonContainer = styled.View`
  align-items: center;
  margin: 0px auto;
  margin-top: auto;
  width: 90%;
`;

const Disclaimer = styled.Text`
  text-align: center;
  margin-bottom: 15px;
  color: ${({theme}) => theme.colors.grey};
`;

const Title = styled.Text`
  align-self: center;
  font-size: 14px;
  font-family: 'Quantico-Bold';
  color: white;
  margin: 0px 0px;
  text-align: center;
  padding-horizontal: 5px;
`;
const CarouselTitle = styled.Text`
  align-self: center;
  font-size: 14px;
  font-family: 'Quantico-Bold';
  color: white;
  margin: 0px 0px;
`;
const FieldTitle = styled.Text`
  align-self: center;
  font-size: 14px;
  font-family: 'Quantico-Bold';
  color: white;
  margin: 0px 0px;
  margin-top: 10px;
`;
const SkipText = styled.Text`
  align-self: center;
  font-size: 14px;
  font-family: 'Quantico-Bold';
  text-decoration-line: underline;
  color: white;
  margin: 20px 0px;
  height: 30px;
`;

const LinkAccountForm = ({gameId, gameAccount, disabledSkip, matchmakingMode, useScroll = true}) => {
  const [t] = useTranslation('global');
  const syncEndpointCall = useSyncEndpointCall();
  const game = gameId ? useSelector(state => selectGameById(state, gameId)) : useSelector(selectSelectedGame);
  const platformOptions = game.platforms.map(platform => ({label: platform, value: platform}));
  const regionOptions = game.regions.map(region => ({label: GAME_REGIONS[region.code], value: region.id}));
  const navigation = useNavigation();
  const requireSteam = STEAM_GAMES.includes(game.id);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const Container = styled(useScroll ? SafeScrollView : View)``;
  const [loading, setLoading] = useState(false);

  const linkGameAccount = async values => {
    setLoading(true);
    if (gameAccount) {
      await syncEndpointCall({
        avoidOpenLoading: true,
        avoidCloseLoading: true,
        loadingText: t('updating_account'),
        reduxAction: editGameAccount({
          gameAccountId: gameAccount.id,
          regionId: values.serverId,
          accountName: values.accountName,
          platformName: values.platform,
        }),
        errorText: t('account_update_failed'),
        successText: t('account_updated'),
        errorCallBack: () => setLoading(false),
        successCallback: () => {
          setLoading(false);
          navigation.goBack();
        },
      });
    } else {
      await syncEndpointCall({
        avoidOpenLoading: true,
        avoidCloseLoading: true,
        loadingText: t('linking_account'),
        reduxAction: createGameAccount({
          gameId: game.id,
          regionId: values.serverId,
          accountName: values.accountName,
          platformName: values.platform,
        }),
        errorText: t('account_linking_failed'),
        successText: t('account_linked'),
        errorCallBack: () => setLoading(false),
        successCallback: () => {
          setLoading(false);
          if (disabledSkip) {
            if (matchmakingMode) {
              navigation.dispatch(StackActions.popToTop());
            } else {
              navigation.goBack();
            }
          } else {
            if (user?.hasSavedAvatar) {
              navigation.navigate('DrawerNavigator');
            } else {
              navigation.navigate('AvatarCreation');
            }
          }
        },
      });
    }
  };

  const linkGameAccountWrapper = values => {
    dispatch(
      openModal('confirmScreen', {
        text: t('incorrect_name_will_result_in_losing_do_you_want_to_continue'),
        handleBack: async () => {
          dispatch(closeModal());
        },
        backText: t('cancel'),
        continueText: t('continue'),
        handleContinue: async () => {
          dispatch(closeModal());
          await linkGameAccount(values);
        },
      }),
    );
  };

  const validationSchema = yup.object().shape({
    accountName: yup
      .string()
      .min(1)
      .required('required')
      .when('$isActivision', {
        is: true,
        then: yup.string().matches(/\w+#\d+/, 'must match pattern Playername#12345'),
      }),
  });

  const isActivision = [GAME_ID_COD_MW2, GAME_ID_COD_VANGUARD, GAME_ID_COD_WARZONE, GAME_ID_COD_WARZONE_2].includes(
    game.id,
  );

  const gameAccountTranslationKey = {
    [PLATFORM_NAME_XBOX_ONE]: 'gameAccountDisplayXBOX',
    [PLATFORM_NAME_XBOX_SERIES_X]: 'gameAccountDisplayXBOX',
    [PLATFORM_NAME_PS5]: 'gameAccountDisplayPSN',
    [PLATFORM_NAME_PS4]: 'gameAccountDisplayPSN',
    [PLATFORM_NAME_PC]: 'gameAccountDisplayPC',
  };

  return (
    <Formik
      initialValues={{
        serverId: gameAccount ? gameAccount.regionId : game.regions[0].id,
        accountName: gameAccount ? gameAccount.accountName : '',
        platform: gameAccount ? gameAccount.platformName : game.platforms[0],
      }}
      validationSchema={validationSchema}
      onSubmit={linkGameAccountWrapper}
      validateOnMount
      validate={values => {
        try {
          validateYupSchema(values, validationSchema, true, {
            isActivision,
          });
        } catch (e) {
          return yupToFormErrors(e);
        }
        return {};
      }}
    >
      {({isValid, handleChange, setFieldValue, handleBlur, handleSubmit, values, touched, errors}) => {
        const showDisclaimer =
          [PLATFORM_NAME_XBOX_ONE, PLATFORM_NAME_XBOX_SERIES_X, PLATFORM_NAME_PS5, PLATFORM_NAME_PS4].includes(
            values.platform,
          ) && [GAME_ID_FORTNITE, GAME_ID_FIFA_23, GAME_ID_MADDEN_23, GAME_ID_NBA_23].includes(game.id);

        const gameAccountDisplay = t([
          `${game.name}.${gameAccountTranslationKey[values.platform]}`,
          `${game.name}.gameAccountDisplay`,
        ]);
        const accountNamePlaceholder = t([`${game.name}.gameAccountPlaceholder`, gameAccountDisplay]);

        const getSelectedRegionIndex = () => {
          for (let i = 0; i < regionOptions.length; i++) {
            if (regionOptions[i].value === values.serverId) {
              return i;
            }
          }
        };

        const getSelectedPlatformIndex = () => {
          for (let i = 0; i < platformOptions.length; i++) {
            if (platformOptions[i].value === values.platform) {
              return i;
            }
          }
        };

        const _renderPlatform = item => {
          return (
            <InnerView
              selected={values.platform === item?.value}
              key={item?.value}
              onPress={() => {
                setFieldValue('platform', item?.value);
              }}
            >
              <Icon
                iconStyle={{marginBottom: 10}}
                name={platformIconName[item?.value]?.name}
                color="white"
                type={platformIconName[item?.value]?.type}
                size={35}
              />
              <Title numberOfLines={1} adjustsFontSizeToFit>
                {item?.label}
              </Title>
            </InnerView>
          );
        };

        const _renderRegion = item => {
          return (
            <InnerView
              testID={`region-${item.value}`}
              selected={values.serverId === item.value}
              key={item.value}
              onPress={() => {
                setFieldValue('serverId', item.value);
              }}
            >
              <Title automaticallyAdjustFontSize>{item?.label}</Title>
            </InnerView>
          );
        };

        return (
          <Container disableTopInset={true}>
            <View
              testID="link-account-form"
              gameId={gameId}
              gameAccount={gameAccount}
              disabledSkip={!!disabledSkip}
              matchmakingMode={!!matchmakingMode}
              useScroll={!!useScroll}
            />
            <CarouselTitle automaticallyAdjustFontSize>{t(`linkAccount.region`)}</CarouselTitle>
            {regionOptions.length > 0 && (
              <NoDepsCarousel
                key="regions"
                keyExtractor={item => item.value}
                initialScrollIndex={getSelectedRegionIndex()}
                data={regionOptions}
                renderItem={_renderRegion}
              />
            )}
            <InputContainer>
              <FieldTitle automaticallyAdjustFontSize>{t(`linkAccount.accountname`)}</FieldTitle>
              <CustomTextInput
                testID="accountName"
                style={{marginBottom: 20}}
                value={values.accountName}
                label={accountNamePlaceholder}
                onChangeText={handleChange('accountName')}
                handleBlur={handleBlur('accountName')}
                isInvalid={!!errors.accountName}
                feedback={touched.accountName && errors.accountName}
              />
              {showDisclaimer && (
                <Disclaimer>
                  <Trans
                    t={t}
                    values={{
                      gameAccountDisplay,
                    }}
                    i18nKey="your_account_may_be_different_than_your_xbox_gamertag_or_psn_id"
                  />
                </Disclaimer>
              )}
            </InputContainer>
            {requireSteam && (
              <InputContainer>
                {user.steamId && (
                  <CustomTextInput value={user.steamId} label="steamId" outLabel={true} editable={false} />
                )}
                <SteamButton
                  text={user.steamId ? t('update_steam_account') : t('connect_to_steam')}
                  secondary={user.steamId}
                  onPress={() => dispatch(openModal('steamOauth', {}))}
                />
              </InputContainer>
            )}

            {platformOptions.length > 1 && (
              <>
                <CarouselTitle automaticallyAdjustFontSize>{t(`linkAccount.platform`)}</CarouselTitle>
                <NoDepsCarousel
                  key="platforms"
                  keyExtractor={item => item.value}
                  initialScrollIndex={getSelectedPlatformIndex()}
                  data={platformOptions}
                  renderItem={_renderPlatform}
                />
              </>
            )}
            <Spacer height={6} />
            <ButtonContainer>
              <Button
                loading={loading}
                testID={
                  !isValid || Object.keys(errors).length !== 0 || (requireSteam && !user.steamId)
                    ? 'button-disabled'
                    : 'button-enabled'
                }
                disabled={!isValid || Object.keys(errors).length !== 0 || (requireSteam && !user.steamId)}
                fullWidth
                text={t(gameAccount ? 'update_account' : 'linkAccount.submiteLabel')}
                onPress={handleSubmit}
              />
            </ButtonContainer>
            {disabledSkip && <Spacer height={8} />}
            {!disabledSkip && (
              <SkipText
                onPress={() => {
                  if (user?.hasSavedAvatar) {
                    navigation.navigate('DrawerNavigator');
                  } else {
                    navigation.navigate('AvatarCreation');
                  }
                }}
              >
                {t('skip')}
              </SkipText>
            )}
          </Container>
        );
      }}
    </Formik>
  );
};

export default LinkAccountForm;
