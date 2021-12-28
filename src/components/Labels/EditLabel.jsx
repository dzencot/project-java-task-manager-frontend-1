// @ts-check

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { fetchLabel } from '../../slices/labelsSlice.js';
import handleError from '../../utils.js';
import routes from '../../routes.js';
import { useAuth, useNotify } from '../../hooks/index.js';

import getLogger from '../../lib/logger.js';

const log = getLogger('client');

const getValidationSchema = () => yup.object().shape({});

const EditLabel = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const notify = useNotify();
  const { label } = useSelector((state) => state.labels);
  const dispatch = useDispatch();

  useEffect(() => dispatch(fetchLabel(params.labelId, auth))
    .catch((error) => handleError(error, notify, navigate)), [dispatch]);

  const f = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: label.name,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async ({ name }, { setSubmitting, setErrors }) => {
      const newLabel = { name };
      try {
        log('label.edit', label);
        await axios.put(`${routes.apiLabels()}/${params.labelId}`, newLabel, { headers: auth.getAuthHeader() });
        const from = { pathname: routes.labelsPagePath() };
        navigate(from);
        notify.addMessage(t('labelEdited'));
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
      <h1 className="my-4">{t('labelEdit')}</h1>
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

export default EditLabel;
