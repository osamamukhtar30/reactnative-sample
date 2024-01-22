import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  screen: null,
  params: {},
};

export const asyncNavigatorReducer = createSlice({
  name: 'asyncNavigator',
  initialState,
  reducers: {
    navigateTo: (state, action) => {
      state.screen = action.payload.screen;
      state.params = action.payload.params;
    },
    cleanNavigation: state => {
      state.screen = null;
      state.params = {};
    },
  },
});

export const {navigateTo, cleanNavigation} = asyncNavigatorReducer.actions;

export default asyncNavigatorReducer.reducer;

export const selectScreenToNavigate = state => state.asyncNavigator.screen;
export const selectParamsToNavigate = state => state.asyncNavigator.params;
