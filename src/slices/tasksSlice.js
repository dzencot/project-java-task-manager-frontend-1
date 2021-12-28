/* eslint-disable no-param-reassign */
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

import getLogger from '../lib/logger.js';

const log = getLogger('slice tasks');
log.enabled = true;

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await axios.get(routes.apiTasks());
    return response.data;
  },
);

const initialState = {
  tasks: [],
  status: 'idle',
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  extraReducers: (builder) => {
    builder
      // get tasks
      .addCase(fetchTasks.pending, (state) => {
        log('pending tasks');
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        log('get tasks failed', action.error);
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.tasks = action.payload;
      });
  },
});

export default tasksSlice.reducer;
