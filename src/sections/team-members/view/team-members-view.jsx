import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import { Button } from 'src/components/button';
import Scrollbar from 'src/components/scrollbar';
import ProgressiveImg from 'src/components/progressive-img';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { setSelectedTeamMembers } from 'src/store/slices/teamMembersSlice';
import { deleteTeamMembers, getTeamMembers } from 'src/_services/team-members.service';
import { CSVLink } from 'react-csv';

// ----------------------------------------------------------------------

const TeamMembers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedTeamMembersId, setSelectedTeamMembersId] = useState();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const { teamMembersLoading, teamMembersList, crudTeamMembersLoading } = useSelector(
    ({ teamMembers }) => teamMembers
  );

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = teamMembersList?.filter((item) => {
    return (
      item?.firstName?.toLowerCase()?.includes(searchKey) ||
      item?.lastName?.toLowerCase()?.includes(searchKey) ||
      item?.email?.toLowerCase()?.includes(searchKey) ||
      item?.phoneNumber?.toLowerCase()?.includes(searchKey) ||
      item?.skills?.some((skill) => skill.toLowerCase().includes(searchKey)) ||
      item?.address?.street?.toLowerCase()?.includes(searchKey) ||
      item?.address?.city?.toLowerCase()?.includes(searchKey) ||
      item?.address?.state?.toLowerCase()?.includes(searchKey) ||
      item?.address?.zipCode?.toLowerCase()?.includes(searchKey) ||
      item?.dateOfJoining?.toLowerCase()?.includes(searchKey)
    );
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getTeamMembers());
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
      if (crudTeamMembersLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedTeamMembersId();
    },
    [crudTeamMembersLoading]
  );

  const handleEdit = useCallback(async () => {
    const teamMembers = teamMembersList?.find((x) => x?._id === selectedTeamMembersId);
    if (teamMembers) {
      dispatch(setSelectedTeamMembers(teamMembers));
      navigate(`/team-members/add?teamMembersId=${teamMembers?._id}`);
    }
  }, [selectedTeamMembersId, teamMembersList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteTeamMembers(selectedTeamMembersId));
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedTeamMembersId]);

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
        <MenuItem onClick={handleEdit} disabled={crudTeamMembersLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudTeamMembersLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudTeamMembersLoading ? (
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
  }, [open, crudTeamMembersLoading]);

  const csvHeaders = [
    { label: 'Id', key: 'srNo' },
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Email', key: 'email' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Role', key: 'role' },
    { label: 'Bio', key: 'bio' },
    { label: 'Date Of Joining', key: 'dateOfJoining' },
    { label: 'Skills', key: 'skills' },
    { label: 'Address', key: 'address' },
    { label: 'Created At', key: 'createdAt' },
    { label: 'Updated At', key: 'updatedAt' },
    { label: 'Created By', key: 'createdBy.username' },
    { label: 'Updated By', key: 'updatedBy.username' },
  ];

  const csvData = useMemo(() => {
    return (
      filteredItems?.map((item) => ({
        srNo: item?.srNo,
        firstName: item?.firstName,
        lastName: item?.lastName,
        email: item?.email,
        phoneNumber: item?.phoneNumber,
        role: item?.role,
        bio: item?.bio,
        dateOfJoining: fhelper.formatAndDisplayDate(new Date(item?.dateOfJoining)),
        skills: item?.skills?.join(', '),
        address: `${item?.address?.street}, ${item?.address?.city}, ${item?.address?.state}, ${item?.address?.zipCode}`,
        createdAt: fhelper.formatAndDisplayDate(new Date(item?.createdAt)),
        updatedAt: fhelper.formatAndDisplayDate(new Date(item?.updatedAt)),
        'createdBy.username': item?.createdBy?.username || 'N/A',
        'updatedBy.username': item?.updatedBy?.username || 'N/A',
      })) || []
    );
  }, [filteredItems]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage('');
  };

  return (
    <Container>
      {teamMembersLoading ? (
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
            <Typography variant="h4">TeamMember</Typography>
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
                onClick={() => navigate('/team-members/add')}
              >
                New TeamMember
              </Button>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={'team_members.csv'}
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
                      <TableCell className="text-nowrap">First Name</TableCell>
                      <TableCell className="text-nowrap">Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell className="text-nowrap">Phone Number</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Bio</TableCell>
                      <TableCell className="text-nowrap">Date Of Joining</TableCell>
                      <TableCell>Skills</TableCell>
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
                          <TableRow key={`teamMembers-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell className="overflow-hidden">
                              <ProgressiveImg
                                src={x?.profilePictureUrl}
                                customClassName={
                                  'max-h-10 h-10 w-10 object-contain rounded cursor-pointer'
                                }
                                onClick={() => handleImageClick(x?.profilePictureUrl)}
                              />
                            </TableCell>
                            <TableCell>{x?.firstName}</TableCell>
                            <TableCell>{x?.lastName}</TableCell>
                            <TableCell>{x?.email}</TableCell>
                            <TableCell>{x?.phoneNumber}</TableCell>
                            <TableCell>{x?.role}</TableCell>
                            <TableCell sx={{ minWidth: '200px' }}>{x?.bio}</TableCell>
                            <TableCell className="text-nowrap">
                              {fhelper.formatAndDisplayDate(new Date(x?.dateOfJoining))}
                            </TableCell>
                            <TableCell className="">
                              {x?.skills?.map((skill, i) => (
                                <Label sx={{ m: 0 }} key={`skill-${skill}-${i}`}>
                                  {skill}
                                </Label>
                              ))}
                            </TableCell>
                            <TableCell sx={{ minWidth: '300px' }}>
                              {x?.address?.street}, {x?.address?.city}, {x?.address?.state},{' '}
                              {x?.address?.zipCode}
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
                                  setSelectedTeamMembersId(x?._id);
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
            {teamMembersList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={teamMembersList?.length}
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
            backgroundColor: 'white',
            padding: 2,
            borderRadius: 1,
            boxShadow: 24,
          }}
          onClick={handleCloseImageModal}
        >
          <Iconify
            icon="eva:close-fill"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              cursor: 'pointer',
              zIndex: 1,
            }}
            onClick={handleCloseImageModal}
          />
          <img
            src={selectedImage}
            alt="Full view"
            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
          />
        </Box>
      </Modal>

      {renderPopup}

      {deleteDialog ? (
        <ConfirmationDialog
          open={deleteDialog}
          setOpen={setDeleteDialog}
          handleConfirm={handleDelete}
          loading={crudTeamMembersLoading}
        >
          Do you want to delete this team member?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default TeamMembers;
