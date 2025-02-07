import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Card, Box, TextField, FormHelperText } from '@mui/material';

import Spinner from 'src/components/spinner';
import { Editor } from 'src/components/editor';
import { FileDrop } from 'src/components/file-drop';
import { LoadingButton } from 'src/components/button';
import { homeInitDetails, setSelectedHome } from 'src/store/slices/homeSlice';
import { createHome, getHome, updateHome } from 'src/_services/home.service';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  quote: Yup.string()
    .required('Quote is required')
    .max(200, 'Quote must be 200 characters or less')
    .min(5, 'Quote must be 5 characters or more'),
  whoWeAre: Yup.string()
    .required('Who We Are section is required')
    .max(1000, 'Who We Are section must be 1000 characters or less')
    .min(10, 'Who We Are section must be 10 characters or more'),
  whatWeDo: Yup.string()
    .required('What We Do section is required')
    .max(1000, 'What We Do section must be 1000 characters or less')
    .min(10, 'Who We Are section must be 10 characters or more'),
  heroSectionVideo: Yup.string('').nullable(),
  // heroSectionVideo: Yup.string().url('Hero Section Video must be a valid URL').nullable(),
  logo: Yup.array().of(Yup.mixed().required('Logo is required')).max(1, 'Only one logo is allowed'),
  isActive: Yup.boolean().required('Active status is required'),
  termsOfUse: Yup.string()
    .required('Terms of Use is required')
    .min(10, 'Terms of Use must be at least 10 characters long'),
  privacyPolicy: Yup.string()
    .required('Privacy Policy is required')
    .min(10, 'Privacy Policy must be at least 10 characters long'),
  statistics: Yup.object().shape({
    beneficiaryServed: Yup.number()
      .min(0, 'Beneficiary Served must be at least 0')
      .required('Beneficiary Served is required'),
    totalVolunteers: Yup.number()
      .min(0, 'Total Volunteers must be at least 0')
      .required('Total Volunteers is required'),
    cityPresence: Yup.number()
      .min(0, 'City Presence must be at least 0')
      .required('City Presence is required'),
    donationReceived: Yup.number()
      .min(0, 'Donation Received must be at least 0')
      .required('Donation Received is required'),
  }),
});
// ----------------------------------------------------------------------

export default function AddHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const homeId = searchParams.get('homeId');

  const { homeLoading, crudHomeLoading, selectedHome } = useSelector(({ home }) => home);

  useEffect(() => {
    if (homeId) dispatch(getHome(homeId));
  }, [homeId]);

  useEffect(() => {
    return () => dispatch(setSelectedHome(homeInitDetails));
  }, []);

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const payload = {
      ...fields,
    };
    let res;
    delete payload.previewLogo;
    delete payload.previewHeroSectionVideo;
    delete payload.createdAt;
    if (payload?._id) {
      res = await dispatch(updateHome(payload));
    } else {
      res = await dispatch(createHome(payload));
    }
    if (res) {
      resetForm();
      dispatch(setSelectedHome(homeInitDetails));
      navigate('/home');
    }
  }, []);

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    ...restFormik
  } = useFormik({
    onSubmit,
    enableReinitialize: true,
    initialValues: selectedHome,
    validationSchema,
  });

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Home</Typography>
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
          {homeLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <>
              <div>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Details</Typography>

                    <Typography variant="body2">
                      Logo, Quote, Hero Section Video, Who We Are, What We Do...
                    </Typography>
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
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12}>
                          <Typography variant="subtitle2">Logo</Typography>
                          <FileDrop
                            formik={{
                              values,
                              touched,
                              errors,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              setFieldValue,
                              ...restFormik,
                            }}
                            mediaLimit={1}
                            fileKey={'logo'}
                            previewKey={'previewLogo'}
                            deleteKey={'deleteUploadedLogo'}
                            loading={crudHomeLoading || homeLoading}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="whoWeAre"
                            label="Who we are"
                            onChange={handleChange}
                            value={values?.whoWeAre || ''}
                            error={!!(touched?.whoWeAre && errors?.whoWeAre)}
                            helperText={
                              touched?.whoWeAre && errors?.whoWeAre ? errors?.whoWeAre : ''
                            }
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="whatWeDo"
                            label="What we do"
                            onChange={handleChange}
                            value={values?.whatWeDo || ''}
                            error={!!(touched?.whatWeDo && errors?.whatWeDo)}
                            helperText={
                              touched?.whatWeDo && errors?.whatWeDo ? errors?.whatWeDo : ''
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="heroSectionVideo"
                            label="Hero Section Video"
                            onChange={handleChange}
                            value={values?.heroSectionVideo || ''}
                            error={!!(touched?.heroSectionVideo && errors?.heroSectionVideo)}
                            helperText={
                              touched?.heroSectionVideo && errors?.heroSectionVideo
                                ? errors?.heroSectionVideo
                                : ''
                            }
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="quote"
                            label="Quote"
                            onChange={handleChange}
                            value={values?.quote || ''}
                            error={!!(touched?.quote && errors?.quote)}
                            helperText={touched?.quote && errors?.quote ? errors?.quote : ''}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Analytics</Typography>

                    <Typography variant="body2">Impact Metrics...</Typography>
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
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{ width: '100%' }}
                            type="number"
                            onBlur={handleBlur}
                            name="statistics.beneficiaryServed"
                            label="Beneficiary Served"
                            onChange={handleChange}
                            value={values?.statistics?.beneficiaryServed || ''}
                            error={
                              !!(
                                touched?.statistics?.beneficiaryServed &&
                                errors?.statistics?.beneficiaryServed
                              )
                            }
                            helperText={
                              touched?.statistics?.beneficiaryServed &&
                              errors?.statistics?.beneficiaryServed
                                ? errors?.statistics?.beneficiaryServed
                                : ''
                            }
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <TextField
                            sx={{ width: '100%' }}
                            type="number"
                            onBlur={handleBlur}
                            name="statistics.totalVolunteers"
                            label="Total Volunteers"
                            onChange={handleChange}
                            value={values?.statistics?.totalVolunteers || ''}
                            error={
                              !!(
                                touched?.statistics?.totalVolunteers &&
                                errors?.statistics?.totalVolunteers
                              )
                            }
                            helperText={
                              touched?.statistics?.totalVolunteers &&
                              errors?.statistics?.totalVolunteers
                                ? errors?.statistics?.totalVolunteers
                                : ''
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{ width: '100%' }}
                            type="number"
                            onBlur={handleBlur}
                            name="statistics.cityPresence"
                            label="City Presence"
                            onChange={handleChange}
                            value={values?.statistics?.cityPresence || ''}
                            error={
                              !!(
                                touched?.statistics?.cityPresence &&
                                errors?.statistics?.cityPresence
                              )
                            }
                            helperText={
                              touched?.statistics?.cityPresence && errors?.statistics?.cityPresence
                                ? errors?.statistics?.cityPresence
                                : ''
                            }
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{ width: '100%' }}
                            type="number"
                            onBlur={handleBlur}
                            name="statistics.donationReceived"
                            label="Rs. Donation Received"
                            onChange={handleChange}
                            value={values?.statistics?.donationReceived || ''}
                            error={
                              !!(
                                touched?.statistics?.donationReceived &&
                                errors?.statistics?.donationReceived
                              )
                            }
                            helperText={
                              touched?.statistics?.donationReceived &&
                              errors?.statistics?.donationReceived
                                ? errors?.statistics?.donationReceived
                                : ''
                            }
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Details</Typography>

                    <Typography variant="body2">
                      Logo, Quote, Hero Section Video, Who We Are, What We Do...
                    </Typography>
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
                      <Grid container spacing={2} style={{ marginTop: '0' }}>
                        <Grid xs={12}>
                          <Typography variant="subtitle2">Terms Of Use</Typography>
                          <Editor
                            name={'termsOfUse'}
                            onChange={(e, editor) => {
                              const data = editor.getData();
                              setFieldValue('termsOfUse', data);
                            }}
                            data={values?.termsOfUse}
                            className={touched?.termsOfUse && errors?.termsOfUse ? 'error' : ''}
                          />
                          {touched?.termsOfUse && errors?.termsOfUse ? (
                            <FormHelperText sx={{ color: 'error.main', px: 2 }}>
                              {errors?.termsOfUse}
                            </FormHelperText>
                          ) : null}
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: '0' }}>
                        <Grid xs={12}>
                          <Typography variant="subtitle2">Privacy Policy</Typography>
                          <Editor
                            name={'privacyPolicy'}
                            onChange={(e, editor) => {
                              const data = editor.getData();
                              setFieldValue('privacyPolicy', data);
                            }}
                            data={values?.privacyPolicy}
                            className={
                              touched?.privacyPolicy && errors?.privacyPolicy ? 'error' : ''
                            }
                          />
                          {touched?.privacyPolicy && errors?.privacyPolicy ? (
                            <FormHelperText sx={{ color: 'error.main', px: 2 }}>
                              {errors?.privacyPolicy}
                            </FormHelperText>
                          ) : null}
                        </Grid>
                      </Grid>
                    </Card>
                    <Stack gap={2} sx={{ mt: 2 }} direction={'row'} justifyContent={'end'}>
                      <LoadingButton
                        size="large"
                        type={'submit'}
                        variant="contained"
                        onClick={handleSubmit}
                        loading={crudHomeLoading}
                      >
                        {homeId ? 'Update' : 'Save'} Changes
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
