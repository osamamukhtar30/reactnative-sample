import styled from 'styled-components/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const DeleteIconContainer = styled.View`
  width: ${wp(30)}px;
  background-color: ${({theme}) => theme.colors.red};
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
