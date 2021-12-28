// @ts-check

import React, { useEffect } from 'react';
// import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';

import { fetchUsers } from '../../slices/usersSlice.js';

import { useAuth, useNotify } from '../../hooks/index.js';
import routes from '../../routes.js';
import handleError from '../../utils.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('user');
log.enabled = true;

const UsersComponent = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const notify = useNotify();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { users } = useSelector((state) => {
    log(state);
    return state.users;
  });

  useEffect(() => dispatch(fetchUsers(handleError))
    .catch((error) => handleError(error, notify, navigate)), [dispatch]);

  const removeUserHandler = async (event, id) => {
    log(event, id);
    event.preventDefault();
    try {
      await axios.delete(`${routes.apiUsers()}/${id}`, { headers: auth.getAuthHeader() });
      auth.logOut();
      log('success');
      notify.addMessage(t('userDeleted'));
    } catch (e) {
      handleError(e, notify, navigate);
    }
  };
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>{t('id')}</th>
          <th>{t('fullName')}</th>
          <th>{t('email')}</th>
          <th>{t('createDate')}</th>
          <th>{null}</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{`${user.firstName} ${user.lastName}`}</td>
            <td>{user.email}</td>
            <td>{new Date(user.createdAt).toLocaleString('ru')}</td>
            <td>
              <Link to={`${routes.usersPagePath()}/${user.id}/edit`}>{t('edit')}</Link>
              <Form onSubmit={(event) => removeUserHandler(event, user.id)}>
                <Button type="submit" variant="link">Удалить</Button>
              </Form>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UsersComponent;
