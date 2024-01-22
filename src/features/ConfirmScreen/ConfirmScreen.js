import React, {useState} from 'react';
import styled from 'styled-components/native';

import theme from '../../global-styles/theme';
import BlurViewContainer from '../../components/BlurViewContainer/BlurViewContainer';
import Button from '../../components/button/Button';

const Title = styled.Text`
  color: white;
  text-align: center;
  font-size: 25px;
`;

const Container = styled.View`
  height: 100%;
  width: 100%;
`;
const ButtonContainer = styled.View`
  position: absolute;
  bottom: 10px;
  width: 100%;
`;

const ButtonContainerInside = styled.View`
  width: 90%;
  margin: auto;
  margin-bottom: 20px;
`;

const TitleContainer = styled.View`
  width: 90%;
  margin: auto;
`;

const ConfirmScreen = props => {
  const {handleContinue, handleBack, continueText, backText, text} = props.route.params;
  const [loading, setLoading] = useState(false);

  return (
    <BlurViewContainer>
      <Container testID="confirm-screen">
        <TitleContainer>
          <Title>{text}</Title>
        </TitleContainer>
        <ButtonContainer>
          <ButtonContainerInside>
            {handleBack && (
              <Button
                solidColor={true}
                fullWidth
                borderColor={theme.colors.white}
                onPress={handleBack}
                disabled={loading}
                text={backText}
              ></Button>
            )}
            <Button
              fullWidth
              loading={loading}
              solidColor={theme.colors.confirmGreen}
              onPress={() => {
                setLoading(true);
                handleContinue();
              }}
              text={continueText}
            ></Button>
          </ButtonContainerInside>
        </ButtonContainer>
      </Container>
    </BlurViewContainer>
  );
};

export default ConfirmScreen;
