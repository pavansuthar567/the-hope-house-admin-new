import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';

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
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { CSVLink } from 'react-csv';
import { fhelper } from 'src/_helpers';

// import { setSelectedAlert } from 'src/store/slices/alertSlice';
import { getAlerts } from 'src/_services/quote.service';

const AlertView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState();

  const { alertLoading, alertList, crudAlertLoading } = useSelector(({ quote }) => quote);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = alertList?.filter((item) => {
    return item?.rawData?.message?.toLowerCase()?.includes(searchKey);
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getAlerts());
      setPage(cPage);
    },
    [dispatch, page]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      if (crudAlertLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedAlertId();
    },
    [crudAlertLoading]
  );

  const handleEdit = useCallback(async () => {
    const alert = alertList?.find((x) => x?._id === selectedAlertId);
    if (alert) {
      // dispatch(setSelectedAlert(alert));
      navigate(`/alert/add?alertId=${alert?._id}`);
    }
  }, [selectedAlertId, alertList, dispatch, navigate]);

  // const handleDelete = useCallback(async () => {
  //   const res = await dispatch(deleteAlert(selectedAlertId));
  //   if (res) {
  //     const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
  //     loadData(cPage);
  //     handlePopup();
  //     setDeleteDialog(false);
  //   }
  // }, [selectedAlertId, dispatch, page, filteredItems, loadData, handlePopup]);

  const csvHeaders = useMemo(
    () => [
      { label: 'Id', key: '_id' },
      { label: 'Message', key: 'message' },
      { label: 'Timestamp', key: 'timestamp' },
      { label: 'Created At', key: 'createdAt' },
      { label: 'Updated At', key: 'updatedAt' },
    ],
    []
  );

  const csvData = useMemo(() => {
    return (
      alertList?.map((item) => ({
        _id: item._id,
        message: item.rawData?.message,
        timestamp: fhelper.formatAndDisplayDate(new Date(item.timestamp)),
        createdAt: fhelper.formatAndDisplayDate(new Date(item.createdAt)),
        updatedAt: fhelper.formatAndDisplayDate(new Date(item.updatedAt)),
      })) || []
    );
  }, [filteredItems]);

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
        <MenuItem onClick={handleEdit} disabled={crudAlertLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudAlertLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudAlertLoading ? (
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
  }, [open, crudAlertLoading, handleEdit, handlePopup]);

  return (
    <Container>
      {alertLoading ? (
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
            <Typography variant="h4">Alerts</Typography>
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
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="alerts.csv"
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
                      <TableCell>Sr No.</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Updated At</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredItems?.length
                      ? filteredItems?.map((x, i) => (
                          <TableRow key={`alert-${i}`}>
                            <TableCell>{x?.srNo}</TableCell>
                            <TableCell>{x?.rawData?.message}</TableCell>
                            <TableCell className="text-nowrap">
                              {moment(x?.timestamp).format('DD-MM-YYYY HH:mm:ss')}
                              {/* {fhelper.formatAndDisplayDate(new Date(x?.timestamp))} */}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fhelper.formatAndDisplayDate(new Date(x?.createdAt))}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {fhelper.formatAndDisplayDate(new Date(x?.updatedAt))}
                            </TableCell>
                            <TableCell sx={{ width: '50px' }}>
                              <Iconify
                                className="cursor-pointer"
                                icon="iconamoon:menu-kebab-vertical-bold"
                                onClick={(e) => {
                                  setOpen(e.currentTarget);
                                  setSelectedAlertId(x?._id);
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
            {alertList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={alertList?.length}
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
          // handleConfirm={handleDelete}
          loading={crudAlertLoading}
        >
          Do you want to delete this alert?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default AlertView;
