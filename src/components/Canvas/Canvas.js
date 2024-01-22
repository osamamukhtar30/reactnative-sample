import React, {useRef, useEffect} from 'react';
import styled from 'styled-components/native';
import Canvas, {Image} from 'react-native-canvas';
import {useTranslation} from 'react-i18next';

import theme from './../../global-styles/theme';

const CanvasContainer = styled.View`
  display: none;
`;

const CanvasComponent = ({
  gameName = 'LEAGUE OF LEGENDS',
  avatarOneURL = 'http://localhost:8000/avatar.png',
  avatarTwoURL = 'http://localhost:8000/avatar2.webp',
  teamSize = '1VS1',
  matchType = 'Challenge',
  usernameOne = 'Lautaro',
  usernameTwo = 'Simon',
  userOneWinner = true,
  setImage = () => {},
}) => {
  const canvas = useRef();
  const [t] = useTranslation('global');
  let winnerText = t('winner');
  let loserText = t('loser');

  useEffect(() => {
    const avatarWidth = 512;
    const avatarHeight = 680;
    const widthCorrection = 200;
    const heightCorrection = 50;
    const backgroundWidth = 1000;
    const backgroundHeight = 500;

    if (canvas.current) {
      const ctx = canvas.current.getContext('2d');
      canvas.current.height = backgroundHeight;
      canvas.current.width = backgroundWidth;
      const backgroundImage = new Image(canvas.current, backgroundWidth, backgroundHeight);
      backgroundImage.crossOrigin = 'anonymous';
      backgroundImage.src = 'https://ik.imagekit.io/9hlfeszbk/static/common/share-background.webp';
      backgroundImage.addEventListener('load', () => {
        ctx.drawImage(backgroundImage, 0, 0, backgroundWidth, backgroundHeight);
        const avatarImage = new Image(canvas.current, avatarWidth, avatarHeight);
        avatarImage.crossOrigin = 'anonymous';
        avatarImage.src = avatarOneURL;
        avatarImage.addEventListener('load', () => {
          ctx.drawImage(avatarImage, -widthCorrection, heightCorrection, avatarWidth * 1.5, avatarHeight * 1.5);
          const avatarTwoImage = new Image(canvas.current, avatarWidth, avatarHeight);
          avatarTwoImage.crossOrigin = 'anonymous';
          avatarTwoImage.src = avatarTwoURL;
          avatarTwoImage.addEventListener('load', async () => {
            ctx.drawImage(
              avatarTwoImage,
              backgroundWidth - avatarWidth,
              heightCorrection,
              avatarWidth * 1.5,
              avatarHeight * 1.5,
            );
            ctx.font = '30px Quantico-Bold';
            ctx.fillText('', 10, 50);
            await new Promise(resolve => setTimeout(() => resolve(), 500));
            ctx.fillStyle = 'white';
            ctx.fillText(gameName, 30, 50);
            ctx.font = '20px Quantico-Regular';
            ctx.fillText('', 10, 50);
            await new Promise(resolve => setTimeout(() => resolve(), 500));
            ctx.fillText(teamSize, 30, 50 + 30);
            ctx.fillStyle = theme.colors.grey;
            ctx.fillText(` | ${matchType}`, teamSize.length * 20, 50 + 30);
            ctx.fillStyle = theme.colors.white;
            ctx.font = '30px Quantico-Regular';
            ctx.fillText(usernameOne, 30, backgroundHeight * 0.9);
            ctx.fillText(usernameTwo, backgroundWidth - 30 - usernameTwo.length * 15, backgroundHeight * 0.9);

            ctx.fillStyle = theme.colors.green;
            ctx.font = '15px Quantico-Regular';
            if (userOneWinner) {
              ctx.fillText(winnerText, 30, backgroundHeight * 0.9 + 15);
              ctx.fillStyle = theme.colors.red;
              ctx.fillText(loserText, backgroundWidth - 30 - usernameTwo.length * 15, backgroundHeight * 0.9 + 15);
            } else {
              ctx.fillText(winnerText, backgroundWidth - 30 - usernameTwo.length * 15, backgroundHeight * 0.9 + 15);
              ctx.fillStyle = theme.colors.red;
              ctx.fillText(loserText, 30, backgroundHeight * 0.9 + 15);
            }

            canvas.current.toDataURL().then(result => {
              setImage(result.replaceAll('"', ''));
            });
          });
        });
      });
    }
  }, [canvas]);

  return (
    <CanvasContainer>
      <Canvas height={1000} width={500} ref={canvas} />
    </CanvasContainer>
  );
};

export default CanvasComponent;
