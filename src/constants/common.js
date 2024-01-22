import {
  sendEmailVerificationCodeCircleCrypto,
  sendEmailVerificationCodePaypal,
  sendEmailVerificationCodeCircleWire,
} from '@duelme/apisdk/dist/slices/payments/thunks';

export const SETTING_TO_ICON = {
  map: 'map',
  mapCode: 'map',
  gameMode: 'users',
  gameType: 'hand-point-up',
  deckFormat: 'layer-group',
  matchSettings: 'user-gear',
  format: 'swords',
  gameSpeed: 'gauge-low',
  weather: 'sun',
  region: 'globe',
  allowSpectators: 'eye',
  roomName: 'house-user',
  roomPassword: 'unlock',
  combatPacing: 'starfighter',
  halfLength: 'stopwatch',
  teams: 'futbol',
  controls: 'gamepad-modern',
  squadType: 'plug',
  customFormations: 'user-gear',
  matchType: 'swords',
  fiveDefenderFormations: 'shield',
  matchLength: 'ranking-star',
  teamType: 'people-group',
  difficulty: 'mountain',
  quarterLength: 'clock',
  injuries: 'user-injured',
  fatigue: 'battery-low',
  evenTeams: 'people-group',
  acceleratedClock: 'gauge-max',
  joinableBy: 'key',
  arena: 'map',
  teamSize: 'user-plus',
  botDifficulty: 'robot',
  mutators: 'alien-8bit',
  loanedPlayers: 'user',
  noOfRounds: 'hashtag',
  timer: 'clock',
  victorySetting: 'trophy-star',
  numberOfPlayers: 'people-group',
  characterSelect: 'square-user',
  hardwareSettings: 'computer-classic',
  connectionRestrictions: 'wifi-exclamation',
};

export const PLATFORM_NAME_ICONS = {
  PC: 'laptop',
  PS4: 'playstation',
  PS5: 'playstation',
  XBOXONE: 'xbox',
  XBOXSERIES: 'xbox',
  CROSS_PLATFORM: 'shuffle',
  CONSOLE: 'gamepad',
  NEXT_GENERATION: 'shuffle',
  PAST_GENERATION: 'shuffle',
};

export const MATCH_MODE_RULES = {
  matchmaking: [
    'I have read the <1>1v1</1> match type rules.',
    'I understand that I will receive a temporary ban of 5 minutes if I do not confirm the match within 30 seconds of finding an opponent.',
    'I accept the <2>member agreement</2>.',
  ],
  lobbies: [
    'I have read the <1>2v2</1> and <2>5v5</2> match type rules.',
    'I understand that if I am selected captain of my team, it is my responsibility to report the score of the match.',
    'I accept the <3>member agreement</3>.',
  ],
  privatematch: [],
  schedulematches: [
    'I have read the <1>1v1</1> match type rules.',
    'I understand that I will lose the match if I do not show up at the scheduled start date.',
    'I understand that if I cancel a scheduled match within 24 hours of the start date, half of my buy in will be awarded to my opponent.',
    'I accept the <2>member agreement</2>.',
  ],
};

export const PAYPAL = 'PAYPAL';
export const CRYPTO = 'CRYPTO';
export const WIRE = 'WIRE';

export const TRANSLATION_MAPPING = {
  [PAYPAL]: 'withdraw_funds_to_your_paypal_account',
  [CRYPTO]: 'withdraw_funds_to_your_crypto_wallet',
  [WIRE]: 'withdraw_funds_to_your_bank_account',
};

export const VERIFICATION_MAPPING = {
  [PAYPAL]: sendEmailVerificationCodePaypal,
  [CRYPTO]: sendEmailVerificationCodeCircleCrypto,
  [WIRE]: sendEmailVerificationCodeCircleWire,
};
