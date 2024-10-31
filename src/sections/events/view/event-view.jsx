import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Card,
  Table,
  Popover,
  MenuItem,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { deleteEvent } from 'src/_services/events.service';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { setSelectedEvent } from 'src/store/slices/eventSlice';
import Label from 'src/components/label';
import { fhelper } from 'src/_helpers';
import { useNavigate } from 'react-router-dom';
import ProgressiveImg from 'src/components/progressive-img';
import { getEvents } from 'src/_services/events.service';

// ----------------------------------------------------------------------

const Event = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState();

  const { eventLoading, eventList, crudEventLoading } = useSelector(({ event }) => event);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = eventList?.filter((item) => {
    return (
      item?.eventName?.toLowerCase()?.includes(searchKey) ||
      item?.description?.toLowerCase()?.includes(searchKey) ||
      item?.organizer?.toLowerCase()?.includes(searchKey) ||
      item?.phoneNumber?.toLowerCase()?.includes(searchKey) ||
      item?.location?.venue?.toLowerCase()?.includes(searchKey) || // Check specific fields in location
      item?.location?.city?.toLowerCase()?.includes(searchKey) ||
      item?.location?.state?.toLowerCase()?.includes(searchKey) ||
      item?.location?.address?.toLowerCase()?.includes(searchKey) ||
      item?.startDate?.toLowerCase()?.includes(searchKey) ||
      item?.endDate?.toLowerCase()?.includes(searchKey) ||
      item?.capacity?.toLowerCase()?.includes(searchKey) ||
      item?.participantsRegistered?.toLowerCase()?.includes(searchKey) ||
      item?.registrationLink?.toLowerCase()?.includes(searchKey) ||
      item?.status?.toLowerCase()?.includes(searchKey) ||
      item?.eventType?.toLowerCase()?.includes(searchKey)
    );
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getEvents());
      setPage(cPage);
    },
    [page]
  );

  useEffect(() => {
    loadData();
  }, []);

  const searchValueHandler = useCallback((event) => {
    const value = event.target.value;
    setSearchedValue(value);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudEventLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedEventId();
    },
    [crudEventLoading]
  );

  const handleEdit = useCallback(async () => {
    const event = eventList?.find((x) => x?._id === selectedEventId);
    if (event) {
      dispatch(setSelectedEvent(event));
      navigate(`/events/add?eventId=${event?._id}`);
    }
  }, [selectedEventId, eventList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteEvent(selectedEventId));
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedEventId]);

  const renderPopup = useMemo(() => {
    return !!open ? (
      <Popover
        open={!!open}
        anchorEl={open}
        PaperProps={{
          sx: { width: 140 },
        }}
        disableEscapeKeyDown
        onClose={handlePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit} disabled={crudEventLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudEventLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudEventLoading ? (
            <Box
              sx={{
                gap: '15px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Spinner width={20} /> Delete
            </Box>
          ) : (
            <>
              <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
              Delete
            </>
          )}
        </MenuItem>
      </Popover>
    ) : null;
  }, [open, crudEventLoading]);

  return (
    <Container>
      {eventLoading ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        <>
          <Box
            sx={{
              mb: 5,
              gap: 2,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h4">Events</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                type="search"
                sx={{ padding: 0 }}
                placeholder="Search"
                value={searchedValue}
                onChange={searchValueHandler}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/events/add')}
              >
                New Event
              </Button>
            </Box>
          </Box>
          <Card>
            <Box p={'3px'} />
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell className="text-nowrap">Event Name</TableCell>
                      <TableCell className="text-nowrap">Event Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell className="text-nowrap">Start Date</TableCell>
                      <TableCell className="text-nowrap">End Date</TableCell>
                      <TableCell>Participants Reg.</TableCell>
                      <TableCell>Organizer</TableCell>
                      <TableCell className="text-nowrap">Reg. Link</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredItems?.length
                      ? filteredItems?.map((x, i) => (
                          <TableRow key={`event-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell className="overflow-hidden">
                              <ProgressiveImg
                                src={x?.featuredImage}
                                customClassName={'max-h-10 h-10 w-10 object-contain rounded'}
                              />
                            </TableCell>
                            <TableCell>{x?.eventName}</TableCell>
                            <TableCell>{x?.eventType}</TableCell>
                            <TableCell sx={{ minWidth: '250px' }}>{x?.description}</TableCell>
                            <TableCell className="text-nowrap">
                              {fhelper.formatAndDisplayDate(new Date(x?.startDate))}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fhelper.formatAndDisplayDate(new Date(x?.endDate))}
                            </TableCell>
                            <TableCell>{x?.participantsRegistered}</TableCell>
                            <TableCell>{x?.organizer}</TableCell>
                            <TableCell>{x?.registrationLink}</TableCell>
                            <TableCell>{x?.status}</TableCell>
                            <TableCell sx={{ minWidth: '300px' }}>
                              {x?.location?.venue}, {x?.location?.city}, {x?.location?.state},{' '}
                              {x?.location?.address}
                            </TableCell>
                            <TableCell sx={{ width: '50px' }}>
                              <Iconify
                                className={'cursor-pointer'}
                                icon="iconamoon:menu-kebab-vertical-bold"
                                onClick={(e) => {
                                  setOpen(e.currentTarget);
                                  setSelectedEventId(x?._id);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
              {!filteredItems?.length ? (
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', p: 2, mt: 1 }}
                >
                  No Data
                </Typography>
              ) : null}
            </Scrollbar>
            {eventList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={eventList?.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            ) : null}
          </Card>
        </>
      )}

      {renderPopup}

      {deleteDialog ? (
        <ConfirmationDialog
          open={deleteDialog}
          setOpen={setDeleteDialog}
          handleConfirm={handleDelete}
          loading={crudEventLoading}
        >
          Do you want to delete this event?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default Event;
