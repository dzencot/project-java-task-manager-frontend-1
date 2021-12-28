// @ts-check

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  useNavigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import _ from 'lodash';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { createBrowserHistory } from 'history';
import { NotificationContext, AuthContext } from './contexts/index.js';

import App from './components/App.jsx';
import resources from './locales/index.js';

import store from './slices/index.js';

import routes from './routes.js';

// TODO: перенести провайдеры
const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [user, setUser] = useState(currentUser || null);

  const logIn = (userData) => {
    const userAuth = {
      ...userData,
      username: userData.name,
    };
    localStorage.setItem('user', JSON.stringify(userAuth));
    setUser(userAuth);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    const from = { pathname: routes.homePagePath() };

    navigate(from);
  };

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  return (
    <AuthContext.Provider value={{
      logIn, logOut, getAuthHeader, user,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const NotificationProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addErrors = (currentErrors) => {
    const errors = currentErrors.map((err) => ({ id: _.uniqueId(), ...err, type: 'danger' }));
    // TODO: этот костыль с setTimeout уйдёт когда переделаю на редакс
    setTimeout(() => {
      setMessages(errors);
    });
  };

  const addMessage = (name) => setTimeout(() => setMessages([{ id: _.uniqueId(), defaultMessage: name, type: 'info' }]));

  const clean = () => setMessages([]);

  return (
    <NotificationContext.Provider value={{
      addMessage, addErrors, messages, clean,
    }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const app = async () => {
  // const isProduction = process.env.NODE_ENV === 'production';

  const i18n = i18next.createInstance();
  const history = createBrowserHistory();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  const vdom = (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <I18nextProvider i18n={i18n}>
              <App history={history} />
            </I18nextProvider>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </Provider>
  );

  return vdom;
};

export default app;
