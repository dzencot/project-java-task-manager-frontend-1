/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import getLogger from '../lib/logger.js';

const log = getLogger('slice users');
log.enabled = true;

const initialState = {
  messages: [],
};

export const usersSlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    addMessage(state, { payload }) {
      const { message } = payload;
      state.messages.push(message);
    },
    clear(state) {
      state.messages = [];
    },
  },
});

export default usersSlice.reducer;
// END

