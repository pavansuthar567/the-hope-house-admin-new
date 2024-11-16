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

import { deleteTestimonial, getTestimonials } from 'src/_services/testimonial.service';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { setSelectedTestimonial } from 'src/store/slices/testimonialSlice';
import { fhelper } from 'src/_helpers';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

const Testimonial = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedTestimonialId, setSelectedTestimonialId] = useState();

  const { testimonialLoading, testimonialList, crudTestimonialLoading } = useSelector(
    ({ testimonial }) => testimonial
  );

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = testimonialList?.filter((item) => {
    return (
      item?.name?.toLowerCase()?.includes(searchKey) ||
      item?.designation?.toLowerCase()?.includes(searchKey) ||
      item?.message?.toLowerCase()?.includes(searchKey) ||
      item?.createdBy?.name?.toLowerCase()?.includes(searchKey) ||
      item?.updatedBy?.name?.toLowerCase()?.includes(searchKey) ||
      new Date(item?.createdAt)?.toLocaleDateString()?.includes(searchKey) ||
      new Date(item?.updatedAt)?.toLocaleDateString()?.includes(searchKey) ||
      item?.image?.toLowerCase()?.includes(searchKey)
    );
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getTestimonials());
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
      if (crudTestimonialLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedTestimonialId();
    },
    [crudTestimonialLoading]
  );

  const handleEdit = useCallback(async () => {
    const testimonial = testimonialList?.find((x) => x?._id === selectedTestimonialId);
    if (testimonial) {
      dispatch(setSelectedTestimonial(testimonial));
      navigate(`/testimonial/add?testimonialId=${testimonial?._id}`);
    }
  }, [selectedTestimonialId, testimonialList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteTestimonial(selectedTestimonialId));
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedTestimonialId]);

  const csvHeaders = useMemo(
    () => [
      { label: 'Id', key: 'srNo' },
      { label: 'Name', key: 'name' },
      { label: 'Designation', key: 'designation' },
      { label: 'Message', key: 'message' },
      { label: 'Image', key: 'image' },
      { label: 'Created At', key: 'createdAt' },
      { label: 'Updated At', key: 'updatedAt' },
      { label: 'Created By', key: 'createdBy.username' },
      { label: 'Updated By', key: 'updatedBy.username' },
    ],
    []
  );

  const csvData = useMemo(() => {
    return (
      filteredItems?.map((item) => ({
        srNo: item.srNo,
        name: item.name,
        designation: item.designation || 'N/A',
        message: item.message,
        image: item.image,
        createdAt: fhelper.formatAndDisplayDate(new Date(item.createdAt)),
        updatedAt: fhelper.formatAndDisplayDate(new Date(item.updatedAt)),
        'createdBy.username': item.createdBy?.username || 'N/A',
        'updatedBy.username': item.updatedBy?.username || 'N/A',
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
        <MenuItem onClick={handleEdit} disabled={crudTestimonialLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudTestimonialLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudTestimonialLoading ? (
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
  }, [open, crudTestimonialLoading]);

  return (
    <Container>
      {testimonialLoading ? (
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
            <Typography variant="h4">Testimonial</Typography>
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
                onClick={() => navigate('/testimonial/add')}
              >
                New Testimonial
              </Button>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="testimonials.csv"
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
                      <TableCell>Image</TableCell>
                      <TableCell className="text-nowrap">Name</TableCell>
                      <TableCell className="text-nowrap">Designation</TableCell>
                      <TableCell sx={{ minWidth: '400px', width: '400px' }}>Message</TableCell>
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
                          <TableRow key={`testimonial-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell className="overflow-hidden">
                              <ProgressiveImg
                                alt={x?.name}
                                src={x?.image}
                                customClassName={'max-h-10 h-10 w-10 object-contain rounded'}
                              />
                            </TableCell>
                            <TableCell>{x?.name}</TableCell>
                            <TableCell>{x?.designation || 'N/A'}</TableCell>
                            <TableCell>{x?.message}</TableCell>
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
                                  setSelectedTestimonialId(x?._id);
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
            {testimonialList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={testimonialList?.length}
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
          loading={crudTestimonialLoading}
        >
          Do you want to delete this testimonial?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default Testimonial;
