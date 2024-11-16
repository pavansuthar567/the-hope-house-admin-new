import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv'; // Import react-csv for CSV download

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
import { Icon } from '@iconify/react';

import { deleteUser, getUsers } from 'src/_services/user.service';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { setSelectedUser } from 'src/store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { fhelper } from 'src/_helpers';

// ----------------------------------------------------------------------

const UsersView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState();

  const { userLoading, userList, crudUserLoading } = useSelector(({ user }) => user);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = userList?.filter((item) => {
    return (
      item?.name?.toLowerCase()?.includes(searchKey) ||
      item?.email?.toLowerCase()?.includes(searchKey)
    );
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getUsers());
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
      if (crudUserLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedUserId();
    },
    [crudUserLoading]
  );

  const handleEdit = useCallback(async () => {
    const user = userList?.find((x) => x?._id === selectedUserId);
    if (user) {
      dispatch(setSelectedUser(user));
      navigate(`/users/add?userId=${user?._id}`);
    }
  }, [selectedUserId, userList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteUser(selectedUserId));
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedUserId]);

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
        <MenuItem onClick={handleEdit} disabled={crudUserLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudUserLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudUserLoading ? (
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
  }, [open, crudUserLoading]);

  // Prepare data for CSV download with static headers
  const csvData = filteredItems?.map((item) => ({
    Id: item?.srNo,
    Name: item?.name,
    Email: item?.email,
    'Created At': fhelper.formatAndDisplayDate(new Date(item?.createdAt)),
    'Updated At': fhelper.formatAndDisplayDate(new Date(item?.updatedAt)),
    'Created By': item?.createdBy?.username || 'N/A',
    'Updated By': item?.updatedBy?.username || 'N/A',
  }));

  const csvHeaders = [
    { label: 'Id', key: 'Id' },
    { label: 'Name', key: 'Name' },
    { label: 'Email', key: 'Email' },
    { label: 'Created At', key: 'Created At' },
    { label: 'Updated At', key: 'Updated At' },
    { label: 'Created By', key: 'Created By' },
    { label: 'Updated By', key: 'Updated By' },
  ];

  return (
    <Container>
      {userLoading ? (
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
            <Typography variant="h4">User</Typography>
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
                onClick={() => navigate('/users/add')}
              >
                New User
              </Button>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={'users_data.csv'}
                style={{ textDecoration: 'none' }}
              >
                <Button variant="contained">
                  <Icon icon="basil:file-download-solid" style={{ fontSize: '1.5rem' }} />
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
                      <TableCell className="text-nowrap">Name</TableCell>
                      <TableCell>Email</TableCell>
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
                          <TableRow key={`user-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell>{x?.name}</TableCell>
                            <TableCell>{x?.email}</TableCell>
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
                                  setSelectedUserId(x?._id);
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
            {userList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={userList?.length}
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
          loading={crudUserLoading}
        >
          Do you want to delete this user?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default UsersView;
