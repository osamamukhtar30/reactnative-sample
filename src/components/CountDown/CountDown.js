import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-fontawesome-pro';
import moment from 'moment';

const Container = styled.Text`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Text = styled.Text`
  margin-left: 3px;
  color: ${({theme}) => theme.colors.white};
`;

const CountDown = ({
  targetTime,
  startText,
  endText,
  name,
  onFinished,
  increase = false,
  displayIcon = true,
  onlySeconds = false,
  parenthesis = false,
  customFormat,
  textStyle = {},
  runTests = false,
}) => {
  const [countdown, setCountdown] = useState('');
  const [shouldDisplayText, setShouldDisplayText] = useState(false);

  useEffect(() => {
    const updateCountDown = () => {
      if (process.env.JEST_WORKER_ID !== undefined && !runTests) {
        // Avoid permanently changing the state for tests since this causes errors
        return;
      }

      const now = moment();
      const targetTimeMoment = moment(targetTime);
      if ((increase && targetTimeMoment < now) || targetTimeMoment > now) {
        let diff;

        if (increase) {
          diff = moment.duration(now.diff(targetTimeMoment));
        } else {
          diff = moment.duration(targetTimeMoment.diff(now));
        }

        let timeLeft;
        setShouldDisplayText(false);
        if (customFormat) {
          timeLeft = moment.utc(diff.asMilliseconds()).format(customFormat);
          setCountdown(timeLeft);
          return;
        }

        if (onlySeconds) {
          timeLeft = moment.utc(diff.asMilliseconds()).format('ss');
          setCountdown(timeLeft + 's');
          return;
        }

        timeLeft = moment.utc(diff.asMilliseconds()).format('mm:ss');
        if (parenthesis) {
          setCountdown(`(${timeLeft})`);
        } else {
          setCountdown(timeLeft);
        }
      } else {
        setShouldDisplayText(true);
        clearInterval(counterInterval);
        if (onFinished) {
          onFinished(name);
        }
      }
    };
    updateCountDown();

    const counterInterval = setInterval(updateCountDown, 1000);
    return () => {
      clearInterval(counterInterval);
    };
  }, [targetTime, endText, startText, name, onFinished, onlySeconds]);

  let icon = '';

  if (displayIcon) {
    icon = <Icon name={'clock'} color="white" type="light" size={18} />;
  }

  return (
    <Container testID="countdown" targetTime={targetTime}>
      {shouldDisplayText ? (
        <Text testID="end-text"> {endText} </Text>
      ) : (
        <>
          <Text>{icon}</Text>
          <Text testID="countdown-text" style={textStyle}>
            {startText} {countdown}
          </Text>
        </>
      )}
    </Container>
  );
};

export default CountDown;
