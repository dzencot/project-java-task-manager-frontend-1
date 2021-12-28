// @ts-check

import React from 'react';

import getLogger from '../lib/logger.js';

const log = getLogger('error boundary');
log.enabled = true;


const ErrorBoundary = () => {
  //       if (e.response?.status === 401) {
  //         const from = { pathname: routes.loginPagePath() };
  //         navigate(from);
  //         notify
  //         .addErrors([{ defaultMessage: t('Доступ запрещён! Пожалуйста, авторизируйтесь.') }]);
  //       } else if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
  //         notify.addErrors(e.response?.data);
  //       } else {
  //         notify.addErrors([{ defaultMessage: e.message }]);
  //       }

};

export default ErrorBoundary;
//
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI.
//     return { hasError: true };
//   }

//   componentDidCatch(error, info) {
//     // You can also log the error to an error reporting service
//     logErrorToMyService(error, info);
//   }

//   render() {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       return <h1>Something went wrong.</h1>;
//     }

//     return this.props.children;
//   }
// }
