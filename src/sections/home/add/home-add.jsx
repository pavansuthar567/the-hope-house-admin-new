import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Card, Box, TextField } from '@mui/material';

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
    .max(200, 'Quote must be 200 characters or less'),
  whoWeAre: Yup.string()
    .required('Who We Are section is required')
    .max(1000, 'Who We Are section must be 1000 characters or less'),
  whatWeDo: Yup.string()
    .required('What We Do section is required')
    .max(1000, 'What We Do section must be 1000 characters or less'),
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
