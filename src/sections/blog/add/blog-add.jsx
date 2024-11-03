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
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  FormHelperText,
} from '@mui/material';

import Label from 'src/components/label';
import Spinner from 'src/components/spinner';
import { LoadingButton } from 'src/components/button';
import { Editor } from 'src/components/editor';
import { createBlog, getBlog, updateBlog } from 'src/_services/blog.service';
import { blogInitDetails, setSelectedBlog } from 'src/store/slices/blogSlice';
import { blogCategories } from 'src/_helpers/constants';
import { FileDrop } from 'src/components/file-drop';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// ----------------------------------------------------------------------

const blogValidationSchema = Yup.object().shape({
  title: Yup.string()
    .max(200, 'Title must be 200 characters or less')
    .required('Title is required'),

  author: Yup.string()
    .max(100, 'Author name must be 100 characters or less')
    .required('Author is required'),

  category: Yup.string().required('Category is required'),

  tags: Yup.string().max(200, 'Tags must be 200 characters or less').required('Tags are required'),

  status: Yup.string()
    .oneOf(['Draft', 'Published'], 'Status must be either "Draft" or "Published"')
    .required('Status is required'),

  content: Yup.string()
    .min(10, 'Content must be at least 10 characters long')
    .required('Content is required'),
});

// ----------------------------------------------------------------------

export default function AddTestimonialPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const blogId = searchParams.get('blogId');

  const { blogLoading, crudBlogLoading, selectedBlog } = useSelector(({ blog }) => blog);

  useEffect(() => {
    if (blogId) dispatch(getBlog(blogId));
  }, [blogId]);

  useEffect(() => {
    return () => dispatch(setSelectedBlog(blogInitDetails));
  }, []);

  const onSubmit = useCallback(
    async (fields, { resetForm }) => {

      const payload = {
        ...fields,
        tags: fields?.tags?.split(',').map((tag) => tag.trim()),
      };

      let res;
      delete payload.previewFeaturedImage;
      if (payload?._id) {
        res = await dispatch(updateBlog(payload));
      } else {
        res = await dispatch(createBlog(payload));
      }

      if (res) {
        resetForm();
        dispatch(setSelectedBlog(blogInitDetails));
        navigate('/blog');
      }
    },
    [dispatch, navigate]
  );

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
    initialValues: selectedBlog,
    validationSchema: blogValidationSchema,
  });

  return (
    <Container sx={{ height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Blog</Typography>
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
        {blogLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          <>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} sm={4} md={4}>
                  <Typography variant="h6">Basic Information</Typography>
                  <Typography variant="body2">Title, Author, Category, Tags...</Typography>
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
                        <TextField
                          sx={{ width: '100%' }}
                          name="title"
                          label="Title"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.title || ''}
                          error={!!(touched?.title && errors?.title)}
                          helperText={touched?.title && errors?.title ? errors?.title : ''}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={2}>
                      <Grid xs={12}>
                        <TextField
                          sx={{ width: '100%' }}
                          name="author"
                          label="Author"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.author || ''}
                          error={!!(touched?.author && errors?.author)}
                          helperText={touched?.author && errors?.author ? errors?.author : ''}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid xs={12}>
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
                              />
                            }
                          >
                            {blogCategories?.map((category, i) => (
                              <MenuItem value={category?.value} key={`category-${i}`}>
                                <Label color={'default'}>{category?.label}</Label>
                              </MenuItem>
                            ))}
                          </Select>
                          {touched?.category && errors?.category && (
                            <Typography variant="caption" color="error">
                              {errors?.category}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={2}>
                      <Grid xs={12}>
                        <TextField
                          sx={{ width: '100%' }}
                          name="tags"
                          label="Tags (comma separated)"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.tags || ''}
                          error={!!(touched?.tags && errors?.tags)}
                          helperText={touched?.tags && errors?.tags ? errors?.tags : ''}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid xs={12} sm={4} md={4}>
                  <Typography variant="h6">Content Details</Typography>
                  <Typography variant="body2">Content, Featured Image...</Typography>
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
                    <Grid container spacing={2} mt={2}>
                      <Grid xs={12}>
                        <Editor
                          name={'content'}
                          onChange={(e, editor) => {
                            const data = editor.getData();
                            setFieldValue('content', data);
                          }}
                          data={values?.content}
                          className={touched?.content && errors?.content ? 'error' : ''}
                        />
                        {touched?.content && errors?.content && (
                          <FormHelperText sx={{ color: 'error.main', px: 2 }}>
                            {errors?.content}
                          </FormHelperText>
                        )}
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
                          deleteKey={'deleteUploadedFeaturedImage'}
                          mediaLimit={1}
                          fileKey={'featuredImage'}
                          previewKey={'previewFeaturedImage'}
                          loading={crudBlogLoading || blogLoading}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid xs={12} sm={4} md={4}>
                  <Typography variant="h6">Publication Details</Typography>
                  <Typography variant="body2">Status</Typography>
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
                      <Grid xs={12} sm={6} md={6} mt={1}>
                        <FormControl sx={{ width: '100%' }}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            label="Status"
                            name="status"
                            value={values?.status || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            input={
                              <OutlinedInput
                                label="Status"
                                error={!!(touched?.status && errors?.status)}
                              />
                            }
                          >
                            <MenuItem value="Draft">
                              <Label color="warning">Draft</Label>
                            </MenuItem>
                            <MenuItem value="Published">
                              <Label color="success">Published</Label>
                            </MenuItem>
                          </Select>
                          {touched?.status && errors?.status && (
                            <Typography variant="caption" color="error">
                              {errors?.status}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Card>

                  <Stack gap={2} sx={{ mt: 2 }} direction={'row'} justifyContent={'end'}>
                    <LoadingButton
                      size="large"
                      variant="contained"
                      type="submit"
                      onClick={handleSubmit}
                      loading={crudBlogLoading}
                    >
                      {blogId ? 'Update' : 'Save'} Changes
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </div>
          </>
        )}
      </Stack>
    </Container>
  );
}
