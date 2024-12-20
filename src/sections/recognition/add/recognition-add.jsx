import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Card, Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
  createRecognition,
  getRecognition,
  updateRecognition,
} from 'src/_services/recognition.service';
import Spinner from 'src/components/spinner';
import { FileDrop } from 'src/components/file-drop';
import { LoadingButton } from 'src/components/button';
import { recognitionInitDetails, setSelectedRecognition } from 'src/store/slices/recognitionSlice';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(100, 'Title must be 100 characters or less')
    .required('Title is required'),

  type: Yup.string().required('Type is required'),
  description: Yup.string()
    .min(50, 'Title must be 100 characters or less')
    .max(100, 'Title must be 100 characters or less')
    .required('Description is required'),
  date: Yup.date()
    .required('Date is required')
    .max(new Date(), 'Date must be in the past or today'),
  imageUrl: Yup.array().min(1).required('Image URL is required'),
});

// ----------------------------------------------------------------------

export default function AddRecognition() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const recognitionId = searchParams.get('recognitionId');

  const { recognitionLoading, crudRecognitionLoading, selectedRecognition } = useSelector(
    ({ recognition }) => recognition
  );

  useEffect(() => {
    if (recognitionId) dispatch(getRecognition(recognitionId));
  }, [recognitionId]);

  useEffect(() => {
    return () => dispatch(setSelectedRecognition(recognitionInitDetails));
  }, []);

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const payload = {
      ...fields,
    };
    let res;
    delete payload.previewImageUrl;
    delete payload.createdAt;
    if (payload?._id) {
      res = await dispatch(updateRecognition(payload));
    } else {
      res = await dispatch(createRecognition(payload));
    }
    if (res) {
      resetForm();
      dispatch(setSelectedRecognition(recognitionInitDetails));
      navigate('/recognition');
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
    initialValues: selectedRecognition,
    validationSchema,
  });

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Recognition</Typography>
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
          {recognitionLoading ? (
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
                      Title, Type, Description, Date, Image...
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
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="title"
                            label="Title"
                            onChange={handleChange}
                            value={values?.title || ''}
                            error={!!(touched?.title && errors?.title)}
                            helperText={touched?.title && errors?.title ? errors?.title : ''}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="type"
                            label="Type"
                            onChange={handleChange}
                            value={values?.type || ''}
                            error={!!(touched?.type && errors?.type)}
                            helperText={touched?.type && errors?.type ? errors?.type : ''}
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
                            name="description"
                            label="Description"
                            onChange={handleChange}
                            value={values?.description || ''}
                            error={!!(touched?.description && errors?.description)}
                            helperText={
                              touched?.description && errors?.description ? errors?.description : ''
                            }
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DemoContainer components={['DatePicker']} sx={{ pt: 1 }}>
                              <DatePicker
                                sx={{ width: '100%' }}
                                label="Date"
                                value={new Date(values.date) || null}
                                onChange={(newValue) => setFieldValue('date', newValue)}
                                slotProps={{
                                  textField: {
                                    error: !!(touched.date && errors.date),
                                    helperText: touched.date && errors.date ? errors.date : '',
                                  },
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12}>
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
                            deleteKey={'deleteUploadedImageUrl'}
                            mediaLimit={1}
                            fileKey={'imageUrl'}
                            previewKey={'previewImageUrl'}
                            loading={crudRecognitionLoading || recognitionLoading}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                    <Stack gap={2} sx={{ mt: 2 }} direction={'row'} justifyContent={'end'}>
                      <LoadingButton
                        size="large"
                        type={'submit'}
                        variant="contained"
                        onClick={handleSubmit}
                        loading={crudRecognitionLoading}
                      >
                        {recognitionId ? 'Update' : 'Save'} Changes
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
