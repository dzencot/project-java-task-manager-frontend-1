// @ts-check

import React from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useNotify } from '../hooks/index.js';

import getLogger from '../lib/logger.js';

const log = getLogger('erro boundary');
log.enabled = true;

const ErrorBoundary = () => {
  const errors = useSelector((state) => Object.values(state)
    .filter((currentState) => currentState.error).map(({ error }) => error));
  log('errors', errors);

  const { messages } = useNotify();
  const { t } = useTranslation();

  return (
    <>
      {messages.map((message) => (
        <Alert key={message.id} show variant={message.type}>
          {message.field ? `Поле "${t(message.field)}" - ${message.defaultMessage}` : message.defaultMessage}
        </Alert>
      ))}
    </>
  );
};

export default ErrorBoundary;
