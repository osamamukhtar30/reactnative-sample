import asyncNavigatorReducer, {navigateTo, cleanNavigation} from './asyncNavigatorReducer';

describe('asyncNavigatorReducer', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('changes state when calling navigateTo', async () => {
    const initialState = {
      screen: null,
      params: {},
    };
    const expectedState = {
      screen: 'TestScreen',
      params: {
        testParam: 'test-value',
      },
    };
    const nextState = asyncNavigatorReducer(
      initialState,
      navigateTo({
        screen: 'TestScreen',
        params: {
          testParam: 'test-value',
        },
      }),
    );
    expect(nextState).toEqual(expectedState);
  });

  it('cleans state when calling cleanNavigation', async () => {
    const expectedState = {
      screen: null,
      params: {},
    };
    const initialState = {
      screen: 'TestScreen',
      params: {
        testParam: 'test-value',
      },
    };
    const nextState = asyncNavigatorReducer(initialState, cleanNavigation());
    expect(nextState).toEqual(expectedState);
  });
});
