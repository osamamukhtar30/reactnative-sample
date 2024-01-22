import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {selectTotalWalletsBalance} from '@duelme/apisdk/dist/slices/wallets/selectors';

const Container = styled.View`
  margin-left: ${wp(3)}px;
  display: flex;
`;

const Scroll = styled.ScrollView`
  max-width: ${wp(30)}px;
`;

const Name = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-family: Decimal-Medium;
  font-size: ${wp(2.2) < 14 ? 14 : wp(2.2)}px;
`;

const ItemContainer = styled.View``;

const BalanceText = styled(Name)`
  font-size: 14px;
  margin-top: 5px;
  font-family: Decimal-Light;
  font-size: ${wp(2.2) < 14 ? 14 : wp(2.2)}px;
`;

const UserInfo = ({username}) => {
  const totalBalance = useSelector(selectTotalWalletsBalance);

  return (
    <Container>
      <ItemContainer>
        <Scroll horizontal={true}>
          <Name>{username}</Name>
        </Scroll>
      </ItemContainer>
      <ItemContainer>
        <Scroll horizontal={true}>
          <BalanceText>${totalBalance.toFixed(2)}</BalanceText>
        </Scroll>
      </ItemContainer>
    </Container>
  );
};

export default UserInfo;
