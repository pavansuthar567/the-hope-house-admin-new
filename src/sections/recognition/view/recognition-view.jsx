import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';

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
import ProgressiveImg from 'src/components/progressive-img';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { setSelectedRecognition } from 'src/store/slices/recognitionSlice';
import { deleteRecognition, getRecognitions } from 'src/_services/recognition.service';

// ----------------------------------------------------------------------

const Recognition = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedRecognitionId, setSelectedRecognitionId] = useState();

  const { recognitionLoading, recognitionList, crudRecognitionLoading } = useSelector(
    ({ recognition }) => recognition
  );

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = recognitionList?.filter((item) => {
    return (
      item?.title?.toLowerCase()?.includes(searchKey) ||
      item?.type?.toLowerCase()?.includes(searchKey) ||
      item?.description?.toLowerCase()?.includes(searchKey) ||
      item?.date?.toLowerCase()?.includes(searchKey) ||
      item?.createdAt?.toLowerCase()?.includes(searchKey) ||
      item?.createdBy?.toLowerCase()?.includes(searchKey) ||
      item?.updatedBy?.toLowerCase()?.includes(searchKey) ||
      item?.updatedAt?.toLowerCase()?.includes(searchKey)
    );
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getRecognitions());
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
      if (crudRecognitionLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedRecognitionId();
    },
    [crudRecognitionLoading]
  );

  const handleEdit = useCallback(async () => {
    const recognition = recognitionList?.find((x) => x?._id === selectedRecognitionId);
    if (recognition) {
      dispatch(setSelectedRecognition(recognition));
      navigate(`/recognition/add?recognitionId=${recognition?._id}`);
    }
  }, [selectedRecognitionId, recognitionList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteRecognition(selectedRecognitionId));
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedRecognitionId]);

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
        <MenuItem onClick={handleEdit} disabled={crudRecognitionLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudRecognitionLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudRecognitionLoading ? (
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
  }, [open, crudRecognitionLoading]);

  // CSV Headers
  const csvHeaders = [
    { label: 'Id', key: 'srNo' },
    { label: 'Title', key: 'title' },
    { label: 'Type', key: 'type' },
    { label: 'Description', key: 'description' },
    { label: 'Date', key: 'date' },
    { label: 'Created At', key: 'createdAt' },
    { label: 'Updated At', key: 'updatedAt' },
    { label: 'Created By', key: 'createdBy.username' },
    { label: 'Updated By', key: 'updatedBy.username' },
  ];

  // Memoized CSV Data
  const csvData = useMemo(() => {
    return (
      filteredItems?.map((item) => ({
        srNo: item.srNo,
        title: item.title,
        type: item.type,
        description: item.description,
        date: fhelper.formatAndDisplayDate(new Date(item.date)),
        createdAt: fhelper.formatAndDisplayDate(new Date(item.createdAt)),
        updatedAt: fhelper.formatAndDisplayDate(new Date(item.updatedAt)),
        'createdBy.username': item.createdBy?.username || 'N/A',
        'updatedBy.username': item.updatedBy?.username || 'N/A',
      })) || []
    );
  }, [filteredItems]);

  return (
    <Container>
      {recognitionLoading ? (
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
            <Typography variant="h4">Recognition</Typography>
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
                onClick={() => navigate('/recognition/add')}
              >
                New Recognition
              </Button>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="recognition_data.csv"
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
                      <TableCell className="text-nowrap">Title</TableCell>
                      <TableCell className="text-nowrap">Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell className="text-nowrap">Date</TableCell>
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
                          <TableRow key={`recognition-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell className="overflow-hidden">
                              <ProgressiveImg
                                src={x?.imageUrl}
                                customClassName={'max-h-10 h-10 w-10 object-contain rounded'}
                              />
                            </TableCell>
                            <TableCell sx={{ minWidth: '150px' }}>{x?.title}</TableCell>
                            <TableCell>{x?.type}</TableCell>
                            <TableCell sx={{ minWidth: '400px' }}>{x?.description}</TableCell>
                            <TableCell className="text-nowrap">
                              {fhelper.formatAndDisplayDate(new Date(x?.date))}
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
                                  setSelectedRecognitionId(x?._id);
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
            {recognitionList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={recognitionList?.length}
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
          loading={crudRecognitionLoading}
        >
          Do you want to delete this recognition?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default Recognition;
