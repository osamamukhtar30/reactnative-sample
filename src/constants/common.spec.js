import {MATCH_TYPE_TO_GAME_SETTINGS} from '@duelme/js-constants/dist/games';

import {SETTING_TO_ICON} from './common';

describe('settings icons', () => {
  it('haves a correct mapping from all settings to icons', () => {
    Object.entries(MATCH_TYPE_TO_GAME_SETTINGS).map(gameKey => {
      const settings = MATCH_TYPE_TO_GAME_SETTINGS[gameKey[0]];

      Object.entries(settings.preMatchSettings).map(settingKey => {
        expect(SETTING_TO_ICON[settingKey[0]]).not.toEqual(undefined);
      });
      Object.entries(settings.checkinSettings).map(settingKey => {
        expect(SETTING_TO_ICON[settingKey[0]]).not.toEqual(undefined);
      });
      Object.entries(settings.matchSettings).map(settingKey => {
        expect(SETTING_TO_ICON[settingKey[0]]).not.toEqual(undefined);
      });
    });
  });
});
