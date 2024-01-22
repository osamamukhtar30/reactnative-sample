import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {
  selectScreenToNavigate,
  selectParamsToNavigate,
  cleanNavigation,
} from './../../app/reducers/asyncNavigatorReducer';

const AsyncNavigator = () => {
  const screenToNavigate = useSelector(selectScreenToNavigate);
  const screenParams = useSelector(selectParamsToNavigate);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (screenToNavigate) {
      navigation.navigate(screenToNavigate, screenParams);
      dispatch(cleanNavigation());
    }
  }, [screenToNavigate]);

  return <></>;
};

export default AsyncNavigator;
