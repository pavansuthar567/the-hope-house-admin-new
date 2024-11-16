import { useNavigate } from 'react-router-dom';
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

import { fhelper } from 'src/_helpers';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import { setSelectedQuote } from 'src/store/slices/quoteSlice';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { deleteQuote, getQuotes } from 'src/_services/quote.service';
import { CSVLink } from 'react-csv';

// ----------------------------------------------------------------------

const QuoteView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState();

  const { quoteLoading, quoteList, crudQuoteLoading } = useSelector(({ quote }) => quote);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = quoteList?.filter((item) => {
    return (
      item?.category?.toLowerCase()?.includes(searchKey) ||
      item?.text?.toLowerCase()?.includes(searchKey) ||
      item?.author?.toLowerCase()?.includes(searchKey) ||
      item?.source?.toLowerCase()?.includes(searchKey)
    );
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getQuotes());
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
      if (crudQuoteLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedQuoteId();
    },
    [crudQuoteLoading]
  );

  const handleEdit = useCallback(async () => {
    const quote = quoteList?.find((x) => x?._id === selectedQuoteId);
    if (quote) {
      dispatch(setSelectedQuote(quote));
      navigate(`/quote/add?quoteId=${quote?._id}`);
    }
  }, [selectedQuoteId, quoteList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteQuote(selectedQuoteId));
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedQuoteId]);

  const csvHeaders = useMemo(
    () => [
      { label: 'Id', key: 'srNo' },
      { label: 'Text', key: 'text' },
      { label: 'Author', key: 'author' },
      { label: 'Category', key: 'category' },
      { label: 'Source', key: 'source' },
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
        text: item.text,
        author: item.author,
        category: item.category,
        source: item.source,
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
        <MenuItem onClick={handleEdit} disabled={crudQuoteLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudQuoteLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudQuoteLoading ? (
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
  }, [open, crudQuoteLoading]);

  return (
    <Container>
      {quoteLoading ? (
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
            <Typography variant="h4">Quotes</Typography>
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
                onClick={() => navigate('/quote/add')}
              >
                New Quote
              </Button>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="quotes.csv"
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
                      <TableCell>Text</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell className="text-nowrap">Category</TableCell>
                      <TableCell>Source</TableCell>
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
                          <TableRow key={`quote-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell>{x?.text}</TableCell>
                            <TableCell>{x?.author}</TableCell>
                            <TableCell>{x?.category}</TableCell>
                            <TableCell>{x?.source}</TableCell>
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
                                  setSelectedQuoteId(x?._id);
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
            {quoteList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={quoteList?.length}
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
          loading={crudQuoteLoading}
        >
          Do you want to delete this quote?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default QuoteView;
