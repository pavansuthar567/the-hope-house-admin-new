import * as Yup from 'yup';
import { useFormik } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Card, Box, TextField } from '@mui/material';

import { getGallery, createGallery, updateGallery } from 'src/_services/gallery.service';
import Spinner from 'src/components/spinner';
import { FileDrop } from 'src/components/file-drop';
import { LoadingButton } from 'src/components/button';
import { galleryInitDetails, setSelectedGallery } from 'src/store/slices/gallerySlice';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  mission: Yup.string()
    .max(100, 'Mission must be 100 characters or less')
    .required('Mission is required'),
  caption: Yup.string().required('Type is required'),
  imageUrl: Yup.array().min(1).required('Image URL is required'),
});

// ----------------------------------------------------------------------

export default function AddGallery() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const galleryId = searchParams.get('galleryId');

  const { galleryLoading, crudGalleryLoading, selectedGallery } = useSelector(
    ({ gallery }) => gallery
  );

  useEffect(() => {
    if (galleryId) dispatch(getGallery(galleryId));
  }, [galleryId]);

  useEffect(() => {
    return () => dispatch(setSelectedGallery(galleryInitDetails));
  }, []);

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const payload = {
      ...fields,
    };
    let res;
    delete payload.previewImageUrl;
    delete payload.createdAt;
    if (payload?._id) {
      res = await dispatch(updateGallery(payload));
    } else {
      res = await dispatch(createGallery(payload));
    }
    if (res) {
      resetForm();
      dispatch(setSelectedGallery(galleryInitDetails));
      navigate('/gallery');
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
    initialValues: selectedGallery,
    validationSchema,
  });

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Gallery</Typography>
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
          {galleryLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <>
              <div>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Details</Typography>

                    <Typography variant="body2">Caption, Mission, Image...</Typography>
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
                            name="caption"
                            label="Caption"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values?.caption || ''}
                            error={!!(touched?.caption && errors?.caption)}
                            helperText={touched?.caption && errors?.caption ? errors?.caption : ''}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            name="mission"
                            label="Mission"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values?.mission || ''}
                            error={!!(touched?.mission && errors?.mission)}
                            helperText={touched?.mission && errors?.mission ? errors?.mission : ''}
                          />
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
                            mediaLimit={1}
                            fileKey={'imageUrl'}
                            previewKey={'previewImageUrl'}
                            deleteKey={'deleteUploadedImageUrl'}
                            loading={crudGalleryLoading || galleryLoading}
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
                        loading={crudGalleryLoading}
                      >
                        {galleryId ? 'Update' : 'Save'} Changes
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
