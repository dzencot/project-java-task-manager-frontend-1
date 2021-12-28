// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { useAuth, useNotify } from '../hooks/index.js';
// import { useNotify } from './hooks/index.js';

import routes from './routes.js';
// import { Link } from 'react-router-dom';

const handleError = (error, notify, navigate) => {
  if (error.response?.status === 401) {
    const from = { pathname: routes.loginPagePath() };
    navigate(from);
    notify.addErrors([{ defaultMessage: 'Доступ запрещён! Пожалуйста, авторизируйтесь.' }]);
  // } else if (error.response?.status === 422 && Array.isArray(error.response?.data)) {
  //   notify.addErrors(error.response?.data);
  } else {
    notify.addErrors([{ defaultMessage: error.message }]);
  }
};

export default handleError;
