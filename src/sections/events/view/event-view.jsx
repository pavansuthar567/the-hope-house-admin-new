import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Modal } from '@mui/material';

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

import { fhelper } from 'src/_helpers';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import { Button } from 'src/components/button';
import Scrollbar from 'src/components/scrollbar';
import { getEvents } from 'src/_services/events.service';
import { deleteEvent } from 'src/_services/events.service';
import ProgressiveImg from 'src/components/progressive-img';
import { setSelectedEvent } from 'src/store/slices/eventSlice';
import ConfirmationDialog from 'src/components/confirmation-dialog';

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
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  const { eventLoading, eventList, crudEventLoading } = useSelector(({ event }) => event);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = eventList?.filter((item) => {
    return (
      item?.eventName?.toLowerCase()?.includes(searchKey) ||
      item?.description?.toLowerCase()?.includes(searchKey) ||
      // item?.organizer?.name?.toLowerCase()?.includes(searchKey) ||
      item?.phoneNumber?.toLowerCase()?.includes(searchKey) ||
      item?.content?.toLowerCase()?.includes(searchKey) ||
      item?.location?.venue?.toLowerCase()?.includes(searchKey) ||
      item?.location?.state?.toLowerCase()?.includes(searchKey) ||
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

  const handleImageClick = (images, index) => {
    setCurrentImages(images);
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setCurrentImages([]);
    setSelectedImageIndex(0);
  };

  const handleNextImage = () => {
    if (selectedImageIndex < currentImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

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

  // CSV Headers
  const csvHeaders = [
    { label: 'Id', key: 'srNo' },
    { label: 'Event Name', key: 'eventName' },
    { label: 'Event Type', key: 'eventType' },
    { label: 'Description', key: 'description' },
    { label: 'Start Date', key: 'startDate' },
    { label: 'End Date', key: 'endDate' },
    { label: 'Participants Registered', key: 'participantsRegistered' },
    // { label: 'Collaborator', key: 'organizer.name' },
    { label: 'Registration Link', key: 'registrationLink' },
    { label: 'WhatsApp Link', key: 'whatsappLink' },
    { label: 'Status', key: 'status' },
    { label: 'Location', key: 'location' },
    { label: 'Created At', key: 'createdAt' },
    { label: 'Updated At', key: 'updatedAt' },
    { label: 'Created By', key: 'createdBy.name' },
    { label: 'Updated By', key: 'updatedBy.name' },
  ];

  // Memoized CSV Data
  const csvData = useMemo(() => {
    return filteredItems?.map((item) => ({
      srNo: item.srNo,
      eventName: item.eventName,
      eventType: item.eventType,
      description: item.description,
      startDate: fhelper.formatAndDisplayDate(new Date(item.startDate)),
      endDate: fhelper.formatAndDisplayDate(new Date(item.endDate)),
      participantsRegistered: item.participantsRegistered,
      // organizer: item.organizer?.name,
      registrationLink: item.registrationLink,
      whatsappLink: item.whatsappLink,
      status: item.status,
      location: `${item.location?.venue}, ${item.location?.state}`,
      createdAt: fhelper.formatAndDisplayDate(new Date(item.createdAt)),
      updatedAt: fhelper.formatAndDisplayDate(new Date(item.updatedAt)),
      createdBy: item.createdBy?.name || 'N/A',
      updatedBy: item.updatedBy?.name || 'N/A',
    }));
  }, [filteredItems]);

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
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="events.csv"
                className="btn btn-primary"
              >
                <Button variant="contained">
                  <Iconify icon="basil:file-download-solid" sx={{ width: 24, height: 24 }} />
                </Button>
              </CSVLink>
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
                      {/* <TableCell>Collaborator</TableCell> */}
                      <TableCell className="text-nowrap">Reg. Link</TableCell>
                      <TableCell className="text-nowrap">WhatsApp Link</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell className="text-nowrap">Created At</TableCell>
                      <TableCell className="text-nowrap">Updated At</TableCell>
                      <TableCell className="text-nowrap">Created By</TableCell>
                      <TableCell className="text-nowrap">Updated By</TableCell>
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
                                src={x?.featuredImage?.[0]}
                                customClassName={
                                  'max-h-10 h-10 w-10 object-contain rounded cursor-pointer'
                                }
                                onClick={() => handleImageClick(x?.featuredImage, 0)}
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
                            {/* <TableCell>{x?.organizer?.name}</TableCell> */}
                            <TableCell>{x?.registrationLink}</TableCell>
                            <TableCell>{x?.whatsappLink}</TableCell>
                            <TableCell>{x?.status}</TableCell>
                            <TableCell sx={{ minWidth: '300px' }}>
                              {x?.location?.venue}, {x?.location?.state}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fhelper.formatAndDisplayDate(new Date(x?.createdAt))}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fhelper.formatAndDisplayDate(new Date(x?.updatedAt))}
                            </TableCell>
                            <TableCell>{x?.createdBy?.name || 'N/A'}</TableCell>
                            <TableCell>{x?.updatedBy?.name || 'N/A'}</TableCell>
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
      <Modal
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            position: 'relative',
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          <img
            src={currentImages[selectedImageIndex]}
            alt="Full view"
            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
          />
          <Iconify
            icon="eva:close-fill"
            width={24}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '-50px', // Positioning relative to the main modal
              right: '-53px', // Positioning relative to the main modal
              cursor: 'pointer',
              zIndex: 1,
            }}
            onClick={handleCloseImageModal}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              display: 'flex',
              justifyContent: 'space-between',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              padding: '0 20px', // Added padding for better spacing
            }}
          >
            <Iconify
              width={35}
              icon="eva:arrow-back-fill"
              onClick={handlePrevImage}
              sx={{
                cursor: 'pointer',
                color: selectedImageIndex === 0 ? 'transparent' : 'white',
                position: 'absolute',
                left: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: selectedImageIndex === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                padding: '5px',
              }}
            />
            <Iconify
              width={35}
              icon="eva:arrow-forward-fill"
              onClick={handleNextImage}
              sx={{
                cursor: 'pointer',
                color: selectedImageIndex === currentImages.length - 1 ? 'transparent' : 'white',
                position: 'absolute',
                right: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor:
                  selectedImageIndex === currentImages.length - 1
                    ? 'transparent'
                    : 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                padding: '5px',
              }}
            />
          </Box>
        </Box>
      </Modal>

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
