/* eslint-disable no-param-reassign */
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

import getLogger from '../lib/logger.js';

const log = getLogger('slice taskStatuses');
log.enabled = true;

export const fetchTaskStatuses = createAsyncThunk(
  'taskStatuses/fetchTaskStatuses',
  async () => {
    const response = await axios.get(routes.apiTaskStatuses());
    return response.data;
  },
);

export const fetchTaskStatus = createAsyncThunk(
  'labels/fetchTaskStatus',
  async (id, auth) => {
    const response = await axios.get(`${routes.apiTaskStatuses()}/${id}`, { headers: auth.getAuthHeader() });
    return response.data;
  },
);

const initialState = {
  taskStatuses: [],
  taskStatus: {},
  status: 'idle',
  error: null,
};

export const taskStatusesSlice = createSlice({
  name: 'taskStatuses',
  initialState,
  extraReducers: (builder) => {
    builder
      // get taskStatuses
      .addCase(fetchTaskStatuses.pending, (state) => {
        log('pending taskStatuses');
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTaskStatuses.rejected, (state, action) => {
        log('get taskStatuses failed', action.error);
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(fetchTaskStatuses.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.taskStatuses = action.payload;
      })

      // get taskStatus
      .addCase(fetchTaskStatus.pending, (state) => {
        log('pending taskStatus');
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTaskStatus.rejected, (state, action) => {
        log('get taskStatuses failed', action.error);
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(fetchTaskStatus.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.taskStatus = action.payload;
      });
  },
});

export default taskStatusesSlice.reducer;
