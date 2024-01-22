import {MATCH_TYPE_TO_GAME_SETTINGS} from '@duelme/js-constants/dist/games';

import translations from './en';

describe('en translations', () => {
  it('has translations for all game settings', () => {
    Object.entries(MATCH_TYPE_TO_GAME_SETTINGS).map(gameKey => {
      const settings = MATCH_TYPE_TO_GAME_SETTINGS[gameKey[0]];

      Object.entries(settings.preMatchSettings).map(settingKey => {
        expect(translations[settingKey[1]]).not.toEqual(undefined);
      });
      Object.entries(settings.checkinSettings).map(settingKey => {
        expect(translations[settingKey[1]]).not.toEqual(undefined);
      });
      Object.entries(settings.matchSettings).map(settingKey => {
        expect(translations[settingKey[1]]).not.toEqual(undefined);
      });
      Object.entries(settings.rules).map(settingKey => {
        expect(translations[settingKey[1]]).not.toEqual(undefined);
      });
      Object.entries(settings.tournamentRules).map(settingKey => {
        expect(translations[settingKey[1]]).not.toEqual(undefined);
      });
      Object.entries(settings.winConditions).map(settingKey => {
        expect(translations[settingKey[1]]).not.toEqual(undefined);
      });
      Object.entries(settings.reporting).map(settingKey => {
        expect(translations[settingKey[1]]).not.toEqual(undefined);
      });
      if (settings.streaming) {
        Object.entries(settings.streaming).map(settingKey => {
          expect(translations[settingKey[1]]).not.toEqual(undefined);
        });
      }
    });
  });
  it('has translations for all game settings keys', () => {
    Object.entries(MATCH_TYPE_TO_GAME_SETTINGS).map(gameKey => {
      const settings = MATCH_TYPE_TO_GAME_SETTINGS[gameKey[0]];
      Object.entries(settings.preMatchSettings).map(settingKey => {
        expect(translations[settingKey[0]]).not.toEqual(undefined);
      });
      Object.entries(settings.checkinSettings).map(settingKey => {
        expect(translations[settingKey[0]]).not.toEqual(undefined);
      });
      Object.entries(settings.matchSettings).map(settingKey => {
        expect(translations[settingKey[0]]).not.toEqual(undefined);
      });
    });
  });
});
