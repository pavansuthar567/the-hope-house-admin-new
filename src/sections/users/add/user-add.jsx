import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Card, Box, TextField } from '@mui/material';

import { userInitDetails, setSelectedUser } from 'src/store/slices/userSlice';

import Spinner from 'src/components/spinner';
import { LoadingButton } from 'src/components/button';
import { createUser, getUser, updateUser } from 'src/_services/user.service';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  name: Yup.string().max(100, 'Name must be 100 characters or less').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
    .nullable(),
});

// ----------------------------------------------------------------------

export default function AddUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const { userLoading, crudUserLoading, selectedUser } = useSelector(({ user }) => user);

  useEffect(() => {
    if (userId) dispatch(getUser(userId));
  }, [userId]);

  useEffect(() => {
    return () => dispatch(setSelectedUser(userInitDetails));
  }, []);

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    let res;
    if (fields?._id) {
      res = await dispatch(updateUser(fields));
    } else {
      res = await dispatch(createUser(fields));
    }
    if (res) {
      resetForm();
      dispatch(setSelectedUser(userInitDetails));
      navigate('/users');
    }
  }, []);

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      onSubmit,
      enableReinitialize: true,
      initialValues: selectedUser,
      validationSchema,
    });

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">User</Typography>
        </Box>
        <Stack
          sx={{
            height: '99%',
            display: 'flex',
            justifyContent: 'space-between',
            mt: 3,
            overflow: 'initial',
          }}
        >
          {userLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <>
              <div>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Details</Typography>

                    <Typography variant="body2">Name, Email</Typography>
                  </Grid>
                  <Grid xs={12} sm={8} md={8}>
                    <Card
                      component={Stack}
                      spacing={2}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        overflow: 'initial !important',
                      }}
                    >
                      <Grid container spacing={2} m={0}>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            name="name"
                            onBlur={handleBlur}
                            label="Name"
                            onChange={handleChange}
                            value={values.name || ''}
                            error={!!(touched.name && errors.name)}
                            helperText={touched.name && errors.name ? errors.name : ''}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            name="email"
                            onBlur={handleBlur}
                            label="Email"
                            onChange={handleChange}
                            value={values.email || ''}
                            error={!!(touched.email && errors.email)}
                            helperText={touched.email && errors.email ? errors.email : ''}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            name="password"
                            onBlur={handleBlur}
                            label="Password"
                            onChange={handleChange}
                            value={values.password || ''}
                            error={!!(touched.password && errors.password)}
                            helperText={touched.password && errors.password ? errors.password : ''}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                    <Stack gap={2} sx={{ mt: 2 }} direction={'row'} justifyContent={'end'}>
                      <LoadingButton
                        size="large"
                        variant="contained"
                        type={'submit'}
                        onClick={handleSubmit}
                        loading={crudUserLoading}
                      >
                        {userId ? 'Update' : 'Save'} Changes
                      </LoadingButton>
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            </>
          )}
        </Stack>
      </Container>
    </>
  );
}
