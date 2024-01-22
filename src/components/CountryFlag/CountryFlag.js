import React from 'react';
import CountryFlag from 'react-native-country-flag';

const LocalCountryCode = ({country, size = 25}) => {
  if (!country) {
    return null;
  }
  return <CountryFlag isoCode={country} size={size} />;
};

export default LocalCountryCode;
