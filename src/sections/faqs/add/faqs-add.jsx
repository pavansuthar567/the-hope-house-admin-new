import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Card,
  Box,
  TextField,
  FormControl,
  Select,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormHelperText,
} from '@mui/material';

import { faqsInitDetails, setSelectedFaqs } from 'src/store/slices/faqsSlice';

import Spinner from 'src/components/spinner';
import { LoadingButton } from 'src/components/button';
import { createFaqs, getFaqs, updateFaqs } from 'src/_services/faqs.service';
import { faqsCategories, MenuProps } from 'src/_helpers/constants';
import Label from 'src/components/label';
import { Editor } from 'src/components/editor';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  question: Yup.string()
    .required('Question is required')
    .max(500, 'Question must be 500 characters or less'),
  answer: Yup.string().required('Answer is required'),
  // .max(3000, 'Answer must be 3000 characters or less'),
  category: Yup.string()
    .oneOf(['General', 'Volunteering', 'Donations'], 'Invalid category')
    .default('General'),
});
// ----------------------------------------------------------------------

export default function AddFaqs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const faqsId = searchParams.get('faqsId');

  const { faqsLoading, crudFaqsLoading, selectedFaqs } = useSelector(({ faqs }) => faqs);

  useEffect(() => {
    if (faqsId) dispatch(getFaqs(faqsId));
  }, [faqsId]);

  useEffect(() => {
    return () => dispatch(setSelectedFaqs(faqsInitDetails));
  }, []);

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    let res;
    const payload = {
      category: fields?.category,
      question: fields?.question,
      answer: fields?.answer,
    };
    if (fields?._id) {
      payload._id = fields?._id;
      res = await dispatch(updateFaqs(payload));
    } else {
      res = await dispatch(createFaqs(payload));
    }
    if (res) {
      resetForm();
      dispatch(setSelectedFaqs(faqsInitDetails));
      navigate('/faqs');
    }
  }, []);

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      onSubmit,
      enableReinitialize: true,
      initialValues: selectedFaqs,
      validationSchema,
    });

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Faqs</Typography>
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
          {faqsLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <>
              <div>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Details</Typography>

                    <Typography variant="body2">Category, Question, Answer</Typography>
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
                        <Grid xs={12} m={0}>
                          <FormControl sx={{ width: '100%' }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                              label="Category"
                              name="category"
                              value={values?.category || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              input={
                                <OutlinedInput
                                  label="Category"
                                  error={!!(touched?.category && errors?.category)}
                                  helperText={
                                    touched?.category && errors?.category ? errors?.category : ''
                                  }
                                />
                              }
                              MenuProps={MenuProps}
                            >
                              {faqsCategories?.map((x, i) => (
                                <MenuItem value={x?.value} key={`status-${i}`}>
                                  <Label key={x?.label} color={'default'}>
                                    {x?.label}
                                  </Label>
                                </MenuItem>
                              ))}
                            </Select>
                            {touched.category && errors.category && (
                              <Typography variant="caption" color="error">
                                {errors.category}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: '0' }}>
                        <Grid xs={12}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            name="question"
                            onBlur={handleBlur}
                            label="Question"
                            onChange={handleChange}
                            value={values.question || ''}
                            error={!!(touched.question && errors.question)}
                            helperText={touched.question && errors.question ? errors.question : ''}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: '0' }}>
                        <Grid xs={12}>
                          <Editor
                            name={'answer'}
                            onChange={(e, editor) => {
                              const data = editor.getData();
                              setFieldValue('answer', data);
                            }}
                            data={values?.answer}
                            className={touched?.answer && errors?.answer ? 'error' : ''}
                          />
                          {touched?.answer && errors?.answer ? (
                            <FormHelperText sx={{ color: 'error.main', px: 2 }}>
                              {errors?.answer}
                            </FormHelperText>
                          ) : null}
                        </Grid>
                      </Grid>
                    </Card>
                    <Stack gap={2} sx={{ mt: 2 }} direction={'row'} justifyContent={'end'}>
                      <LoadingButton
                        size="large"
                        variant="contained"
                        type={'submit'}
                        onClick={handleSubmit}
                        loading={crudFaqsLoading}
                      >
                        {faqsId ? 'Update' : 'Save'} Changes
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
