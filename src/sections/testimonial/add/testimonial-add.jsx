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

import Spinner from 'src/components/spinner';
import { LoadingButton } from 'src/components/button';
import {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
} from 'src/_services/testimonial.service';
import { setSelectedTestimonial, testimonialInitDetails } from 'src/store/slices/testimonialSlice';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  name: Yup.string().max(100, 'Name must be 100 characters or less').required('Name is required'),

  designation: Yup.string().max(100, 'Designation must be 100 characters or less'),

  message: Yup.string()
    .max(500, 'Message must be 500 characters or less')
    .required('Message is required'),

  image: Yup.string().url('Image must be a valid URL'),
});

// ----------------------------------------------------------------------

export default function AddTestimonialPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const testimonialId = searchParams.get('testimonialId');

  const { testimonialLoading, crudTestimonialLoading, selectedTestimonial } = useSelector(
    ({ testimonial }) => testimonial
  );

  useEffect(() => {
    if (testimonialId) dispatch(getTestimonials(testimonialId));
  }, [testimonialId]);

  useEffect(() => {
    return () => dispatch(setSelectedTestimonial(testimonialInitDetails));
  }, []);

  const onSubmit = useCallback(
    async (fields, { resetForm }) => {
      const payload = {
        ...fields,
      };

      let res;
      if (payload?._id) {
        res = await dispatch(updateTestimonial(payload));
      } else {
        res = await dispatch(createTestimonial(payload));
      }

      if (res) {
        resetForm();
        dispatch(setSelectedTestimonial(testimonialInitDetails));
        navigate('/testimonial');
      }
    },
    [dispatch, navigate]
  );

  const { values, touched, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    onSubmit,
    enableReinitialize: true,
    initialValues: selectedTestimonial,
    validationSchema: validationSchema,
  });

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Testimonials</Typography>
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
          {testimonialLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <>
              <div>
                <Grid container spacing={3}>
                  {/* Testimonial Details */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Typography variant="h6">Details</Typography>
                    <Typography variant="body2">Name, Designation, Message...</Typography>
                  </Grid>
                  <Grid item xs={12} sm={8} md={8}>
                    <Card
                      component={Stack}
                      spacing={2}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        overflow: 'initial !important',
                      }}
                    >
                      {/* Name and Designation */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                          <TextField
                            sx={{ width: '100%' }}
                            name="name"
                            label="Name"
                            onChange={handleChange}
                            value={values.name || ''}
                            error={!!(touched.name && errors.name)}
                            helperText={touched.name && errors.name ? errors.name : ''}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                          <TextField
                            sx={{ width: '100%' }}
                            name="designation"
                            label="Designation (optional)"
                            onChange={handleChange}
                            value={values.designation || ''}
                            onBlur={handleBlur}
                          />
                        </Grid>
                      </Grid>

                      {/* Message */}
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            sx={{ width: '100%' }}
                            name="message"
                            label="Message"
                            multiline
                            rows={4}
                            onChange={handleChange}
                            value={values.message || ''}
                            error={!!(touched.message && errors.message)}
                            helperText={touched.message && errors.message ? errors.message : ''}
                            onBlur={handleBlur}
                          />
                        </Grid>
                      </Grid>

                      {/* Image URL */}
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            sx={{ width: '100%' }}
                            name="image"
                            label="Image URL (optional)"
                            onChange={handleChange}
                            value={values.image || ''}
                            onBlur={handleBlur}
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
                        loading={crudTestimonialLoading}
                      >
                        {testimonialId ? 'Update' : 'Save'} Changes
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
