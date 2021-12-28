// @ts-check

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import routes from '../../routes.js';
import { useAuth, useNotify } from '../../hooks/index.js';
import handleError from '../../utils.js';
import { fetchTaskStatus } from '../../slices/taskStatusesSlice.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('client');

const getValidationSchema = () => yup.object().shape({});

const EditStatus = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const auth = useAuth();
  const notify = useNotify();
  const dispatch = useDispatch();

  const { taskStatus } = useSelector((state) => state.taskStatuses);

  useEffect(() => dispatch(fetchTaskStatus(params.taskStatusId, auth))
    .catch((error) => handleError(error, notify, navigate)), [dispatch]);

  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: taskStatus.name,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async ({ name }, { setSubmitting, setErrors }) => {
      const newStatus = { name };
      try {
        // TODO: api
        await axios.put(`${routes.apiStatuses()}/${params.statusId}`, newStatus, { headers: auth.getAuthHeader() });
        log('status.edit', newStatus);
        const from = { pathname: routes.statusesPagePath() };
        navigate(from);
        notify.addMessage(t('statusEdited'));
        // dispatch(actions.addStatus(label));
      } catch (e) {
        log('label.edit.error', e);
        setSubmitting(false);
        handleError(e, notify, navigate);
        if (e.response?.status === 422 && Array.isArray(e.response?.data)) {
          const errors = e.response?.data
            .reduce((acc, err) => ({ ...acc, [err.field]: err.defaultMessage }), {});
          setErrors(errors);
        }
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <h1 className="my-4">{t('statusEdit')}</h1>
      <Form onSubmit={f.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t('naming')}</Form.Label>
          <Form.Control
            className="mb-2"
            disabled={f.isSubmitting}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            value={f.values.name}
            isInvalid={f.errors.name && f.touched.name}
            name="name"
            id="name"
            type="text"
          />
          <Form.Control.Feedback type="invalid">
            {t(f.errors.name)}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={f.isSubmitting}>
          {t('edit')}
        </Button>
      </Form>
    </>
  );
};

export default EditStatus;
