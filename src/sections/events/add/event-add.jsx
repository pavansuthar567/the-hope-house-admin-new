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

import { eventInitDetails, setSelectedEvent } from 'src/store/slices/eventSlice';

import Spinner from 'src/components/spinner';
import { LoadingButton } from 'src/components/button';
import { createEvent, getEvent, updateEvent } from 'src/_services/events.service';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { eventStatuses, eventTypes, MenuProps } from 'src/_helpers/constants';
import Label from 'src/components/label';
import { FileDrop } from 'src/components/file-drop';
import { getUsers } from 'src/_services/user.service';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  eventName: Yup.string()
    .max(255, 'Event name must be 255 characters or less')
    .required('Event name is required'),
  description: Yup.string()
    .max(1000, 'Description must be 1000 characters or less')
    .required('Description is required'),
  organizer: Yup.string()
    .max(255, 'Organizer name must be 255 characters or less')
    .required('Organizer is required'),
  location: Yup.object().shape({
    venue: Yup.string()
      .max(255, 'Venue name must be 255 characters or less')
      .required('Venue is required'),
    city: Yup.string().max(100, 'City must be 100 characters or less').required('City is required'),
    state: Yup.string().required('State is required'),
    address: Yup.string()
      .max(255, 'Address must be 255 characters or less')
      .required('Address is required'),
  }),
  startDate: Yup.date()
    .required('Start date is required')
    .min(new Date(), 'Start date must be in the future'), // Ensure start date is in the future
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be the same as or after start date'), // Ensure end date is after start date
  capacity: Yup.number().min(1, 'Capacity must be at least 1').required('Capacity is required'),
  participantsRegistered: Yup.number()
    .min(0, 'Participants registered cannot be negative')
    .required('Participants registered is required'),
  eventType: Yup.string().required('Event type is required'),
  registrationLink: Yup.string()
    .url('Registration link must be a valid URL')
    .required('Registration link is required'),
  featuredImage: Yup.array().min(1).required('Featured image is required'),
  // previewfeaturedImage: Yup.array().of(
  //   Yup.string().url('Preview featured image must be a valid URL')
  // ),
  // deleteUploadedfeaturedImage: Yup.array().of(
  //   Yup.string().url('Delete uploaded image must be a valid URL')
  // ),
  status: Yup.string().required('Status is required'),
});

// ----------------------------------------------------------------------

export default function AddEvent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');

  const { eventLoading, crudEventLoading, selectedEvent } = useSelector(({ event }) => event);
  const { userLoading, userList } = useSelector(({ user }) => user);

  useEffect(() => {
    if (eventId) dispatch(getEvent(eventId));
  }, [eventId]);

  useEffect(() => {
    dispatch(getUsers());
    return () => dispatch(setSelectedEvent(eventInitDetails));
  }, []);

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const payload = {
      ...fields,
      location: {
        venue: fields?.location?.venue,
        city: fields?.location?.city,
        state: fields?.location?.state,
        address: fields?.location?.address,
      },
    };
    let res;
    delete payload.previewfeaturedImage;
    if (payload?._id) {
      res = await dispatch(updateEvent(payload));
    } else {
      res = await dispatch(createEvent(payload));
    }
    if (res) {
      resetForm();
      dispatch(setSelectedEvent(eventInitDetails));
      navigate('/events');
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
    initialValues: selectedEvent,
    validationSchema,
  });

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Event</Typography>
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
          {eventLoading || userLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <>
              <div>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={4} md={4}>
                    <Typography variant="h6">Details</Typography>

                    <Typography variant="body2">Event Name, Desc, Organizer...</Typography>
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
                            name="eventName"
                            onBlur={handleBlur}
                            label="Event Name"
                            onChange={handleChange}
                            value={values.eventName || ''}
                            error={!!(touched.eventName && errors.eventName)}
                            helperText={
                              touched.eventName && errors.eventName ? errors.eventName : ''
                            }
                          />
                        </Grid>
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
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: 0 }}>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <FormControl sx={{ width: '100%' }}>
                            <InputLabel>Organizer</InputLabel>
                            <Select
                              label="Organizer"
                              name="organizer"
                              value={values.organizer || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              input={
                                <OutlinedInput
                                  label="Organizer"
                                  error={!!(touched?.organizer && errors?.organizer)}
                                  helperText={
                                    touched?.organizer && errors?.organizer ? errors?.organizer : ''
                                  }
                                />
                              }
                              MenuProps={MenuProps}
                            >
                              {userList?.map((x, i) => (
                                <MenuItem key={x?.name} value={x?._id}>
                                  {x?.name}
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
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            type="number"
                            onBlur={handleBlur}
                            name="capacity"
                            label="Capacity"
                            onChange={handleChange}
                            value={values?.capacity || 0}
                            error={!!(touched?.capacity && errors?.capacity)}
                            helperText={
                              touched?.capacity && errors?.capacity ? errors?.capacity : ''
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
                            type="number"
                            name="participantsRegistered"
                            label="Participants Registered"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.participantsRegistered || 0}
                            error={
                              !!(touched.participantsRegistered && errors.participantsRegistered)
                            }
                            helperText={
                              touched.participantsRegistered && errors.participantsRegistered
                                ? errors.participantsRegistered
                                : ''
                            }
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <TextField
                            sx={{
                              width: '100%',
                            }}
                            onBlur={handleBlur}
                            name="registrationLink"
                            label="Registration Link"
                            onChange={handleChange}
                            value={values?.registrationLink || ''}
                            error={!!(touched?.registrationLink && errors?.registrationLink)}
                            helperText={
                              touched?.registrationLink && errors?.registrationLink
                                ? errors?.registrationLink
                                : ''
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
                                label="Start Date"
                                value={new Date(values.startDate) || null}
                                onChange={(newValue) => setFieldValue('startDate', newValue)}
                                slotProps={{
                                  textField: {
                                    error: !!(touched.startDate && errors.startDate),
                                    helperText:
                                      touched.startDate && errors.startDate ? errors.startDate : '',
                                  },
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Grid>
                        <Grid xs={12} sm={6} md={6} m={0}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DemoContainer components={['DatePicker']} sx={{ pt: 1 }}>
                              <DatePicker
                                sx={{ width: '100%' }}
                                label="End Date"
                                value={new Date(values.endDate) || null}
                                onChange={(newValue) => setFieldValue('endDate', newValue)}
                                slotProps={{
                                  textField: {
                                    error: !!(touched.endDate && errors.endDate),
                                    helperText:
                                      touched.endDate && errors.endDate ? errors.endDate : '',
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
                    <Typography variant="h6">Location</Typography>
                    <Typography variant="body2">Venue, City, State, Address...</Typography>
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
                            name="location.venue"
                            label="Venue"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values?.location?.venue || ''}
                            error={!!(touched?.location?.venue && errors?.location?.venue)}
                            helperText={
                              touched?.location?.venue && errors?.location?.venue
                                ? errors?.location?.venue
                                : ''
                            }
                            sx={{
                              width: '100%',
                            }}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            name="location.city"
                            label="City"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values?.location?.city || ''}
                            error={!!(touched?.location?.city && errors?.location?.city)}
                            helperText={
                              touched?.location?.city && errors?.location?.city
                                ? errors?.location?.city
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
                            name="location.state"
                            label="State"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values?.location?.state || ''}
                            error={!!(touched?.location?.state && errors?.location?.state)}
                            helperText={
                              touched?.location?.state && errors?.location?.state
                                ? errors?.location?.state
                                : ''
                            }
                            sx={{
                              width: '100%',
                            }}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <TextField
                            name="location.address"
                            label="Address"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values?.location?.address || ''}
                            error={!!(touched?.location?.address && errors?.location?.address)}
                            helperText={
                              touched?.location?.address && errors?.location?.address
                                ? errors?.location?.address
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
                    <Typography variant="body2">Event Type, Status, Image...</Typography>
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
                            <InputLabel>Status</InputLabel>
                            <Select
                              label="Status"
                              name="status"
                              value={values.status || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              input={
                                <OutlinedInput
                                  label="Status"
                                  error={!!(touched?.status && errors?.status)}
                                  helperText={
                                    touched?.status && errors?.status ? errors?.status : ''
                                  }
                                />
                              }
                              MenuProps={MenuProps}
                            >
                              {eventStatuses?.map((x, i) => (
                                <MenuItem value={x?.value} key={`status-${i}`}>
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
                          <FormControl sx={{ width: '100%' }}>
                            <InputLabel>Event Type</InputLabel>
                            <Select
                              label="Event Type"
                              name="eventType"
                              value={values.eventType || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              input={
                                <OutlinedInput
                                  label="Event Type"
                                  error={!!(touched?.eventType && errors?.eventType)}
                                  helperText={
                                    touched?.eventType && errors?.eventType ? errors?.eventType : ''
                                  }
                                />
                              }
                              MenuProps={MenuProps}
                            >
                              {eventTypes?.map((x, i) => (
                                <MenuItem value={x?.value} key={`eventType-${i}`}>
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
                            deleteKey={'deleteUploadedfeaturedImage'}
                            mediaLimit={1}
                            fileKey={'featuredImage'}
                            previewKey={'previewfeaturedImage'}
                            loading={crudEventLoading || eventLoading}
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
                        loading={crudEventLoading}
                      >
                        {eventId ? 'Update' : 'Save'} Changes
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
