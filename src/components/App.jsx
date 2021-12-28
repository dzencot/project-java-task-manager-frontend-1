// @ts-check

import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import Navbar from './Navbar.jsx';
import Welcome from './Welcome.jsx';
import Login from './Login.jsx';
import Registration from './Registration.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import UsersComponent from './Users/Users.jsx';
import EditUser from './Users/EditUser.jsx';

import Statuses from './Statuses/Statuses.jsx';
import EditStatus from './Statuses/EditStatus.jsx';
import NewStatus from './Statuses/NewStatus.jsx';

import Labels from './Labels/Labels.jsx';
import EditLabel from './Labels/EditLabel.jsx';
import NewLabel from './Labels/NewLabel.jsx';

import Task from './Tasks/Task.jsx';
import Tasks from './Tasks/Tasks.jsx';
import NewTask from './Tasks/NewTask.jsx';
import EditTask from './Tasks/EditTask.jsx';

import routes from '../routes.js';
import Notification from './Notification.jsx';

import { fetchUsers } from '../slices/usersSlice.js';
import { fetchLabels } from '../slices/labelsSlice.js';
import { fetchTaskStatuses } from '../slices/taskStatusesSlice.js';
import { fetchTasks } from '../slices/tasksSlice.js';

import { useNotify, useAuth } from '../hooks/index.js';
import handleError from '../utils.js';

import getLogger from '../lib/logger.js';

const log = getLogger('App');
log.enabled = true;

const App = () => {
  const notify = useNotify();
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    // TODO: перенести нотификацию в слайсы
    notify.clean();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const dataRoutes = [
      {
        name: 'users',
        getData: () => fetchUsers(),
        isSecurity: false,
      },
      {
        name: 'labels',
        getData: () => fetchLabels(auth),
        isSecurity: true,
      },
      {
        name: 'taskStatuses',
        getData: () => fetchTaskStatuses(auth),
        isSecurity: true,
      },
      {
        name: 'tasks',
        getData: () => fetchTasks(auth),
        isSecurity: true,
      },
    ];
    const promises = dataRoutes.filter(({ isSecurity }) => isSecurity && auth.user)
      .map(({ getData }) => dispatch(getData()));
    Promise.all(promises)
      .catch((error) => handleError(error, notify, navigate));
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="container wrapper flex-grow-1">
        <Notification />
        <h1 className="my-4">{null}</h1>
        <Routes>
          <Route path={routes.homePagePath()} element={<Welcome />} />
          <Route path={routes.loginPagePath()} element={<Login />} />
          <Route path={routes.signupPagePath()} element={<Registration />} />

          <Route path={routes.usersPagePath()}>
            <Route path="" element={<UsersComponent />} />
            <Route path=":userId/edit" element={<EditUser />} />
          </Route>

          <Route path={routes.statusesPagePath()}>
            <Route path="" element={<Statuses />} />
            <Route path=":statusId/edit" element={<EditStatus />} />
            <Route path="new" element={<NewStatus />} />
          </Route>

          <Route path={routes.labelsPagePath()}>
            <Route path="" element={<Labels />} />
            <Route path=":labelId/edit" element={<EditLabel />} />
            <Route path="new" element={<NewLabel />} />
          </Route>

          <Route path={routes.tasksPagePath()}>
            <Route path="" element={<Tasks />} />
            <Route path=":taskId" element={<Task />} />
            <Route path=":taskId/edit" element={<EditTask />} />
            <Route path="new" element={<NewTask />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <footer>
        <div className="container my-5 pt-4 border-top">
          <a rel="noreferrer" href="https://ru.hexlet.io">Hexlet</a>
        </div>
      </footer>
      <ToastContainer />
    </>
  );
};

export default App;
