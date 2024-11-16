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

import { volunteerInitDetails, setSelectedVolunteer } from 'src/store/slices/volunteerSlice';

import Spinner from 'src/components/spinner';
import { LoadingButton } from 'src/components/button';
import { createVolunteer, getVolunteer, updateVolunteer } from 'src/_services/volunteer.service';
import { MenuProps, skills } from 'src/_helpers/constants';
import Label from 'src/components/label';

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
  address: Yup.object().shape({
    city: Yup.string().max(100, 'City must be 100 characters or less').required('City is required'),
    state: Yup.string().required('State is required'),
  }),
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'Invalid gender')
    .required('Gender is required'),
  skills: Yup.array()
    .of(Yup.string().max(50, 'Skill must be 50 characters or less'))
    .min(1, 'At least one skill is required')
    .required('Skills are required'),
  availability: Yup.string()
    .oneOf(['Full-time', 'Part-time', 'Contract'], 'Invalid availability type')
    .required('Availability is required'),
  experience: Yup.string()
    .max(50, 'Experience description must be 50 characters or less')
    .required('Experience is required'),
});

// ----------------------------------------------------------------------

export default function AddVolunteerPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const volunteerId = searchParams.get('volunteerId');

  const { volunteerLoading, crudVolunteerLoading, selectedVolunteer } = useSelector(
    ({ volunteer }) => volunteer
  );

  useEffect(() => {
    if (volunteerId) dispatch(getVolunteer(volunteerId));
  }, [volunteerId]);

  useEffect(() => {
    return () => dispatch(setSelectedVolunteer(volunteerInitDetails));
  }, []);

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const payload = {
      ...fields,
      address: {
        city: fields?.address?.city,
        state: fields?.address?.state,
      },
      skills: fields?.skills.includes('other') ? [fields?.otherSkill] : fields?.skills,
    };
    let res;
    delete payload.otherSkill;
    if (payload?._id) {
      res = await dispatch(updateVolunteer(payload));
    } else {
      res = await dispatch(createVolunteer(payload));
    }
    if (res) {
      resetForm();
      dispatch(setSelectedVolunteer(volunteerInitDetails));
      navigate('/volunteer');
    }
  }, []);

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      onSubmit,
      enableReinitialize: true,
      initialValues: selectedVolunteer,
      validationSchema,
    });

  const handleOtherSkillChange = (e) => {
    dispatch(setSelectedVolunteer({ ...values, otherSkill: e.target.value }));
  };

  const handleChangeSkills = (event) => {
    const { value } = event.target;
    setFieldValue('skills', value === 'other' ? ['other'] : [value]);
  };

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Volunteer</Typography>
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
          {volunteerLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <>
              <div>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Details</Typography>

                    <Typography variant="body2">First Name, Last Name...</Typography>
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
                        <Grid xs={12} sm={6} md={6}>
                          <FormControl fullWidth>
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                              labelId="gender-label"
                              id="gender"
                              name="gender"
                              value={values.gender || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!(touched.gender && errors.gender)}
                              label="Gender"
                            >
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </Select>
                            {touched.gender && errors.gender && (
                              <Typography variant="caption" color="error">
                                {errors.gender}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Address</Typography>
                    <Typography variant="body2">City, State...</Typography>
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
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Specifications</Typography>
                    <Typography variant="body2">
                      Availability, Experience, Skills...
                    </Typography>
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
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={6} md={6}>
                          <FormControl sx={{ width: '100%' }}>
                            <InputLabel>Availability</InputLabel>
                            <Select
                              label="Availability"
                              name="availability"
                              value={values.availability || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!(touched.availability && errors.availability)}
                              MenuProps={MenuProps}
                            >
                              <MenuItem value="Full-time">Full-time</MenuItem>
                              <MenuItem value="Part-time">Part-time</MenuItem>
                              <MenuItem value="Contract">Contract</MenuItem>
                            </Select>
                            {touched.availability && errors.availability && (
                              <Typography variant="caption" color="error">
                                {errors.availability}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            label="Experience"
                            name="experience"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.experience || ''}
                            error={!!(touched.experience && errors.experience)}
                            helperText={
                              touched.experience && errors.experience ? errors.experience : ''
                            }
                            sx={{ width: '100%' }}
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
                              value={values.skills || []}
                              onChange={handleChangeSkills}
                              onBlur={handleBlur}
                              input={<OutlinedInput label="Skills" />}
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
                    </Card>
                    <Stack gap={2} sx={{ mt: 2 }} direction={'row'} justifyContent={'end'}>
                      <LoadingButton
                        size="large"
                        variant="contained"
                        type={'submit'}
                        onClick={handleSubmit}
                        loading={crudVolunteerLoading}
                      >
                        {volunteerId ? 'Update' : 'Save'} Changes
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
