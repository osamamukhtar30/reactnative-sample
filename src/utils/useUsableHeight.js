import ReactNative from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {tabContainerHeight, paddingTop, paddingBottom} from './../components/tabBar/TabBar';

export const useUsableHeight = () => {
  const headerHeight = useHeaderHeight();
  return (
    hp(100) -
    ((ReactNative.Platform.OS === 'ios' ? headerHeight / 2 : headerHeight) +
      paddingBottom +
      tabContainerHeight +
      paddingTop)
  );
};

export default useUsableHeight;
