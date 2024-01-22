import {
  PLATFORM_NAME_XBOX_ONE,
  PLATFORM_NAME_XBOX_SERIES_X,
  PLATFORM_TYPE_CROSS_PLATFORM,
  PLATFORM_TYPE_CROSS_PLATFORM_NEXT_GENERATION,
  PLATFORM_TYPE_CROSS_PLATFORM_PAST_GENERATION,
  PLATFORM_TYPE_PC,
} from '@duelme/js-constants/dist/games';

const platformMapping = {
  [PLATFORM_NAME_XBOX_ONE]: 'XBOX ONE',
  [PLATFORM_NAME_XBOX_SERIES_X]: 'SERIES X|S',
  [PLATFORM_TYPE_CROSS_PLATFORM]: 'PC & Console',
  [PLATFORM_TYPE_CROSS_PLATFORM_NEXT_GENERATION]: 'PC, PS5, Xbox Series',
  [PLATFORM_TYPE_CROSS_PLATFORM_PAST_GENERATION]: 'PS4 & Xbox One',
  [PLATFORM_TYPE_PC]: 'PC',
};

export const getPlatformName = platform => {
  // No need for PS4 and PS5 since name is same value as constant
  return platformMapping[platform] ? platformMapping[platform] : platform;
};
