import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv'; // Import CSVLink for CSV download

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

import { deleteVolunteer, getVolunteers } from 'src/_services/volunteer.service';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { setSelectedVolunteer } from 'src/store/slices/volunteerSlice';
import Label from 'src/components/label';
import { fhelper } from 'src/_helpers';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const Volunteer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState();

  const { volunteerLoading, volunteerList, crudVolunteerLoading } = useSelector(
    ({ volunteer }) => volunteer
  );

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = volunteerList?.filter((item) => {
    return (
      item?.firstName?.toLowerCase()?.includes(searchKey) ||
      item?.lastName?.toLowerCase()?.includes(searchKey) ||
      item?.email?.toLowerCase()?.includes(searchKey) ||
      item?.phoneNumber?.toLowerCase()?.includes(searchKey) ||
      item?.gender?.toLowerCase()?.includes(searchKey) ||
      item?.experience?.toLowerCase()?.includes(searchKey) ||
      item?.availability?.toLowerCase()?.includes(searchKey) ||
      item?.address?.city?.toLowerCase()?.includes(searchKey) ||
      item?.address?.state?.toLowerCase()?.includes(searchKey) ||
      item?.skills?.some((skill) => skill.toLowerCase().includes(searchKey))
    );
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getVolunteers());
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
      if (crudVolunteerLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedVolunteerId();
    },
    [crudVolunteerLoading]
  );

  const handleEdit = useCallback(async () => {
    const volunteer = volunteerList?.find((x) => x?._id === selectedVolunteerId);
    if (volunteer) {
      dispatch(setSelectedVolunteer(volunteer));
      navigate(`/volunteer/add?volunteerId=${volunteer?._id}`);
    }
  }, [selectedVolunteerId, volunteerList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteVolunteer(selectedVolunteerId));
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedVolunteerId]);

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
        <MenuItem onClick={handleEdit} disabled={crudVolunteerLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudVolunteerLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudVolunteerLoading ? (
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
  }, [open, crudVolunteerLoading]);

  // Prepare data for CSV download with static headers
  const csvData = useMemo(
    () =>
      filteredItems?.map((item) => ({
        Id: item?.srNo,
        FirstName: item?.firstName,
        LastName: item?.lastName,
        Email: item?.email,
        PhoneNumber: item?.phoneNumber,
        Gender: item?.gender,
        Skills: item?.skills?.join(', '),
        Experience: item?.experience,
        Availability: item?.availability,
        Address: `${item?.address?.city}, ${item?.address?.state}`,
        CreatedAt: fhelper.formatAndDisplayDate(new Date(item?.createdAt)),
        UpdatedAt: fhelper.formatAndDisplayDate(new Date(item?.updatedAt)),
        CreatedBy: item?.createdBy?.username || 'N/A',
        UpdatedBy: item?.updatedBy?.username || 'N/A',
      })),
    [filteredItems]
  );

  // Define CSV headers
  const csvHeaders = [
    { label: 'Id', key: 'Id' },
    { label: 'First Name', key: 'FirstName' },
    { label: 'Last Name', key: 'LastName' },
    { label: 'Email', key: 'Email' },
    { label: 'Phone Number', key: 'PhoneNumber' },
    { label: 'Gender', key: 'Gender' },
    { label: 'Skills', key: 'Skills' },
    { label: 'Experience', key: 'Experience' },
    { label: 'Availability', key: 'Availability' },
    { label: 'Address', key: 'Address' },
    { label: 'Created At', key: 'CreatedAt' },
    { label: 'Updated At', key: 'UpdatedAt' },
    { label: 'Created By', key: 'CreatedBy' },
    { label: 'Updated By', key: 'UpdatedBy' },
  ];

  return (
    <Container>
      {volunteerLoading ? (
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
            <Typography variant="h4">Volunteer</Typography>
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
                onClick={() => navigate('/volunteer/add')}
              >
                New Volunteer
              </Button>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={'volunteers_data.csv'}
                style={{ textDecoration: 'none' }}
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
                      <TableCell className="text-nowrap">First Name</TableCell>
                      <TableCell className="text-nowrap">Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell className="text-nowrap">Phone Number</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell className="text-nowrap">Skills</TableCell>
                      <TableCell>Experience</TableCell>
                      <TableCell>Availability</TableCell>
                      <TableCell>Address</TableCell>
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
                          <TableRow key={`volunteer-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell>{x?.firstName}</TableCell>
                            <TableCell>{x?.lastName}</TableCell>
                            <TableCell>{x?.email}</TableCell>
                            <TableCell>{x?.phoneNumber}</TableCell>
                            <TableCell>{x?.gender}</TableCell>
                            <TableCell className="!flex gap-2 flex-nowrap min-w-fit h-fit">
                              {x?.skills?.map((skill, i) => (
                                <Label sx={{ m: 0 }} key={`skill-${skill}-${i}`}>
                                  {skill}
                                </Label>
                              ))}
                            </TableCell>
                            <TableCell className="min-w-fit flex text-nowrap">
                              {x?.experience}
                            </TableCell>
                            <TableCell>{x?.availability}</TableCell>
                            <TableCell className="text-nowrap">
                              {x?.address?.city}, {x?.address?.state}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fhelper.formatAndDisplayDate(new Date(x?.createdAt))}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fhelper.formatAndDisplayDate(new Date(x?.updatedAt))}
                            </TableCell>
                            <TableCell>{x?.createdBy?.username || 'N/A'}</TableCell>
                            <TableCell>{x?.updatedBy?.username || 'N/A'}</TableCell>
                            <TableCell sx={{ width: '50px' }}>
                              <Iconify
                                className={'cursor-pointer'}
                                icon="iconamoon:menu-kebab-vertical-bold"
                                onClick={(e) => {
                                  setOpen(e.currentTarget);
                                  setSelectedVolunteerId(x?._id);
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
            {volunteerList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={volunteerList?.length}
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
          loading={crudVolunteerLoading}
        >
          Do you want to delete this volunteer?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default Volunteer;
