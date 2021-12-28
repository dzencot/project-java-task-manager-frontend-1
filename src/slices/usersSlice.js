/* eslint-disable no-param-reassign */
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

import getLogger from '../lib/logger.js';

const log = getLogger('slice users');
log.enabled = true;

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await axios.get(routes.apiUsers());
    return response.data;
  },
);

const initialState = {
  users: [],
  status: 'idle',
  error: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  extraReducers: (builder) => {
    builder
      // get users
      .addCase(fetchUsers.pending, (state) => {
        log('pending users');
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        log('get users failed', action.error);
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.users = action.payload;
      });
  },
});

export default usersSlice.reducer;
