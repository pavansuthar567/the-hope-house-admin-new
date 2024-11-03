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

import { quoteInitDetails, setSelectedQuote } from 'src/store/slices/quoteSlice';

import Spinner from 'src/components/spinner';
import { LoadingButton } from 'src/components/button';
import { createQuote, getQuote, updateQuote } from 'src/_services/quote.service';

// ----------------------------------------------------------------------

export const validationSchema = Yup.object().shape({
  text: Yup.string().required('Text is required').max(1000, 'Text must be 1000 characters or less'),
  author: Yup.string().max(100, 'Author name must be 100 characters or less').required(),
  source: Yup.string().max(200, 'Source must be 200 characters or less').nullable(),
  category: Yup.string().notRequired(),
  // .oneOf(['Inspiration', 'Motivation', 'Life', 'Wisdom'], 'Invalid category')
});

// ----------------------------------------------------------------------

export default function AddQuote() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get('quoteId');

  const { quoteLoading, crudQuoteLoading, selectedQuote } = useSelector(({ quote }) => quote);

  useEffect(() => {
    if (quoteId) dispatch(getQuote(quoteId));
  }, [quoteId]);

  useEffect(() => {
    return () => dispatch(setSelectedQuote(quoteInitDetails));
  }, []);

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    let res;
    const payload = {
      category: fields?.category,
      text: fields?.text,
      author: fields?.author,
      source: fields?.source,
    };
    if (fields?._id) {
      payload._id = fields?._id;
      res = await dispatch(updateQuote(payload));
    } else {
      res = await dispatch(createQuote(payload));
    }
    if (res) {
      resetForm();
      dispatch(setSelectedQuote(quoteInitDetails));
      navigate('/quote');
    }
  }, []);

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      onSubmit,
      enableReinitialize: true,
      initialValues: selectedQuote,
      validationSchema,
    });

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Quote</Typography>
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
          {quoteLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <>
              <div>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Details</Typography>

                    <Typography variant="body2">Text, Author, Category, Source</Typography>
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
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            name="text"
                            onBlur={handleBlur}
                            label="Text"
                            onChange={handleChange}
                            value={values.text || ''}
                            error={!!(touched.text && errors.text)}
                            helperText={touched.text && errors.text ? errors.text : ''}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            name="author"
                            onBlur={handleBlur}
                            label="Author"
                            onChange={handleChange}
                            value={values.author || ''}
                            error={!!(touched.author && errors.author)}
                            helperText={touched.author && errors.author ? errors.author : ''}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: '0' }}>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            name="category"
                            onBlur={handleBlur}
                            label="Category"
                            onChange={handleChange}
                            value={values.category || ''}
                            error={!!(touched.category && errors.category)}
                            helperText={touched.category && errors.category ? errors.category : ''}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            name="source"
                            onBlur={handleBlur}
                            label="Source"
                            onChange={handleChange}
                            value={values.source || ''}
                            error={!!(touched.source && errors.source)}
                            helperText={touched.source && errors.source ? errors.source : ''}
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
                        loading={crudQuoteLoading}
                      >
                        {quoteId ? 'Update' : 'Save'} Changes
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
