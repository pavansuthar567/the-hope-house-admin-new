import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
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
} from '@mui/material';

import { recognitionInitDetails, setSelectedRecognition } from 'src/store/slices/recognitionSlice';

import Spinner from 'src/components/spinner';
import { LoadingButton } from 'src/components/button';
import {
  createRecognition,
  getRecognition,
  updateRecognition,
} from 'src/_services/recognition.service';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MenuProps, roles, skills } from 'src/_helpers/constants';
import Label from 'src/components/label';
import { FileDrop } from 'src/components/file-drop';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(100, 'First name must be 100 characters or less')
    .required('First name is required'),
  lastName: Yup.string()
    .max(100, 'Last name must be 100 characters or less')
    .required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  role: Yup.string().required('Role is required'),
  bio: Yup.string().required('Bio is required'),
  address: Yup.object().shape({
    street: Yup.string()
      .max(255, 'Street must be 255 characters or less')
      .required('Street is required'),
    city: Yup.string().max(100, 'City must be 100 characters or less').required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string()
      .matches(/^[0-9]{6}$/, 'ZIP code must be exactly 6 digits')
      .required('ZIP code is required'),
  }),
  skills: Yup.array()
    .of(Yup.string().max(50, 'Skill must be 50 characters or less'))
    .min(1, 'At least one skill is required')
    .required('Skills are required'),
  dateOfJoining: Yup.date()
    .required('Date of joining is required')
    .max(new Date(), 'Date of joining must be in the past or today'),
  profilePictureUrl: Yup.array().min(1).required('Profile picture URL is required'),
  socialMediaLinks: Yup.object().shape({
    linkedIn: Yup.string()
      .url('LinkedIn URL must be a valid URL')
      .max(100, 'LinkedIn URL must be 100 characters or less')
      .required('LinkedIn URL is required'),
    twitter: Yup.string()
      .url('Twitter URL must be a valid URL')
      .max(100, 'Twitter URL must be 100 characters or less')
      .required('Twitter URL is required'),
    facebook: Yup.string()
      .url('Facebook URL must be a valid URL')
      .max(100, 'Facebook URL must be 100 characters or less')
      .required('Facebook URL is required'),
    instagram: Yup.string()
      .url('Instagram URL must be a valid URL')
      .max(100, 'Instagram URL must be 100 characters or less')
      .required('Instagram URL is required'),
  }),
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
    if (payload?._id) {
      res = await dispatch(updateRecognition(payload));
    } else {
      res = await dispatch(createRecognition(payload));
    }
    if (res) {
      resetForm();
      dispatch(setSelectedRecognition(recognitionInitDetails));
      navigate('/team-members');
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

  const handleOtherSkillChange = (e) => {
    dispatch(setSelectedRecognition({ ...values, otherSkill: e.target.value }));
  };

  const handleChangeSkills = (event) => {
    const { value } = event.target;
    setFieldValue('skills', value === 'other' ? ['other'] : [value]);
  };
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
                      First Name, Last Name, Date of joining...
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
                      <Grid container spacing={2} m={0}>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            name="firstName"
                            onBlur={handleBlur}
                            label="First Name"
                            onChange={handleChange}
                            value={values.firstName || ''}
                            error={!!(touched.firstName && errors.firstName)}
                            helperText={
                              touched.firstName && errors.firstName ? errors.firstName : ''
                            }
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="lastName"
                            label="Last Name"
                            onChange={handleChange}
                            value={values?.lastName || ''}
                            error={!!(touched?.lastName && errors?.lastName)}
                            helperText={
                              touched?.lastName && errors?.lastName ? errors?.lastName : ''
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
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
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="phoneNumber"
                            label="Phone Number"
                            onChange={handleChange}
                            value={values?.phoneNumber || ''}
                            error={!!(touched?.phoneNumber && errors?.phoneNumber)}
                            helperText={
                              touched?.phoneNumber && errors?.phoneNumber ? errors?.phoneNumber : ''
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DemoContainer components={['DatePicker']} sx={{ pt: 1 }}>
                              <DatePicker
                                sx={{ width: '100%' }}
                                label="Date Of Joining"
                                value={new Date(values.dateOfJoining) || null}
                                onChange={(newValue) => setFieldValue('dateOfJoining', newValue)}
                                slotProps={{
                                  textField: {
                                    error: !!(touched.dateOfJoining && errors.dateOfJoining),
                                    helperText:
                                      touched.dateOfJoining && errors.dateOfJoining
                                        ? errors.dateOfJoining
                                        : '',
                                  },
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Address</Typography>
                    <Typography variant="body2">Street, City, State...</Typography>
                  </Grid>
                  <Grid xs={12} sm={8} md={8}>
                    <Card
                      component={Stack}
                      spacing={2}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            name="address.street"
                            label="Street"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values?.address?.street || ''}
                            error={!!(touched?.address?.street && errors?.address?.street)}
                            helperText={
                              touched?.address?.street && errors?.address?.street
                                ? errors?.address?.street
                                : ''
                            }
                            sx={{
                              width: '100%',
                            }}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            name="address.city"
                            label="City"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values?.address?.city || ''}
                            error={!!(touched?.address?.city && errors?.address?.city)}
                            helperText={
                              touched?.address?.city && errors?.address?.city
                                ? errors?.address?.city
                                : ''
                            }
                            sx={{
                              width: '100%',
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            name="address.state"
                            label="State"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values?.address?.state || ''}
                            error={!!(touched?.address?.state && errors?.address?.state)}
                            helperText={
                              touched?.address?.state && errors?.address?.state
                                ? errors?.address?.state
                                : ''
                            }
                            sx={{
                              width: '100%',
                            }}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            name="address.zipCode"
                            label="ZIP Code"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values?.address?.zipCode || ''}
                            error={!!(touched?.address?.zipCode && errors?.address?.zipCode)}
                            helperText={
                              touched?.address?.zipCode && errors?.address?.zipCode
                                ? errors?.address?.zipCode
                                : ''
                            }
                            sx={{
                              width: '100%',
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Specifications</Typography>
                    <Typography variant="body2">Role, skills, bio, social media link...</Typography>
                  </Grid>
                  <Grid xs={12} sm={8} md={8}>
                    <Card
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                      }}
                      spacing={2}
                      component={Stack}
                    >
                      <Grid container spacing={2} m={0}>
                        <Grid xs={12} sm={6} md={6}>
                          <FormControl sx={{ width: '100%' }}>
                            <InputLabel>Role</InputLabel>
                            <Select
                              label="Role"
                              name="role"
                              value={values.role || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              input={
                                <OutlinedInput
                                  label="Role"
                                  error={!!(touched?.role && errors?.role)}
                                  helperText={touched?.role && errors?.role ? errors?.role : ''}
                                />
                              }
                              MenuProps={MenuProps}
                            >
                              {roles?.map((x, i) => (
                                <MenuItem value={x?.value} key={`role-${i}`}>
                                  <Label key={x?.label} color={'default'}>
                                    {x?.label}
                                  </Label>
                                </MenuItem>
                              ))}
                            </Select>
                            {touched.role && errors.role && (
                              <Typography variant="caption" color="error">
                                {errors.role}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="bio"
                            label="Bio"
                            onChange={handleChange}
                            value={values?.bio || ''}
                            error={!!(touched?.bio && errors?.bio)}
                            helperText={touched?.bio && errors?.bio ? errors?.bio : ''}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={12} md={12}>
                          <FormControl sx={{ width: '100%' }}>
                            <InputLabel>Skills</InputLabel>
                            <Select
                              label="Skills"
                              name="skills"
                              // multiple
                              value={values.skills || []}
                              onChange={handleChangeSkills}
                              onBlur={handleBlur}
                              input={
                                <OutlinedInput
                                  label="Skills"
                                  error={!!(touched?.skills && errors?.skills)}
                                  helperText={
                                    touched?.skills && errors?.skills ? errors?.skills : ''
                                  }
                                />
                              }
                              MenuProps={MenuProps}
                            >
                              {skills?.map((x, i) => (
                                <MenuItem value={x?.value} key={`skills-${i}`}>
                                  <Label key={x?.label} color={'default'}>
                                    {x?.label}
                                  </Label>
                                </MenuItem>
                              ))}
                              <MenuItem value={'other'} key={`skills-${9999}`}>
                                <Label color={'default'}>Other</Label>
                              </MenuItem>
                            </Select>
                            {touched.skills && errors.skills && (
                              <Typography variant="caption" color="error">
                                {errors.skills}
                              </Typography>
                            )}
                            {values?.skills?.includes('other') && (
                              <TextField
                                label="Enter your skill"
                                value={values?.otherSkill || ''}
                                onChange={handleOtherSkillChange}
                                variant="outlined"
                                style={{ marginTop: '8px', width: '100%' }}
                              />
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="socialMediaLinks.facebook"
                            label="Facebook Link"
                            onChange={handleChange}
                            value={values?.socialMediaLinks?.facebook || ''}
                            error={
                              !!(
                                touched?.socialMediaLinks?.facebook &&
                                errors?.socialMediaLinks?.facebook
                              )
                            }
                            helperText={
                              touched?.socialMediaLinks?.facebook &&
                              errors?.socialMediaLinks?.facebook
                                ? errors?.socialMediaLinks?.facebook
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
                            name="socialMediaLinks.instagram"
                            label="Instagram Link"
                            onChange={handleChange}
                            value={values?.socialMediaLinks?.instagram || ''}
                            error={
                              !!(
                                touched?.socialMediaLinks?.instagram &&
                                errors?.socialMediaLinks?.instagram
                              )
                            }
                            helperText={
                              touched?.socialMediaLinks?.instagram &&
                              errors?.socialMediaLinks?.instagram
                                ? errors?.socialMediaLinks?.instagram
                                : ''
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
                            name="socialMediaLinks.twitter"
                            label="Twitter Link"
                            onChange={handleChange}
                            value={values?.socialMediaLinks?.twitter || ''}
                            error={
                              !!(
                                touched?.socialMediaLinks?.twitter &&
                                errors?.socialMediaLinks?.twitter
                              )
                            }
                            helperText={
                              touched?.socialMediaLinks?.twitter &&
                              errors?.socialMediaLinks?.twitter
                                ? errors?.socialMediaLinks?.twitter
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
                            name="socialMediaLinks.linkedIn"
                            label="LinkedIn Link"
                            onChange={handleChange}
                            value={values?.socialMediaLinks?.linkedIn || ''}
                            error={
                              !!(
                                touched?.socialMediaLinks?.linkedIn &&
                                errors?.socialMediaLinks?.linkedIn
                              )
                            }
                            helperText={
                              touched?.socialMediaLinks?.linkedIn &&
                              errors?.socialMediaLinks?.linkedIn
                                ? errors?.socialMediaLinks?.linkedIn
                                : ''
                            }
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
                            deleteKey={'deleteUploadedProfilePic'}
                            mediaLimit={1}
                            fileKey={'profilePictureUrl'}
                            previewKey={'previewProfilePic'}
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
