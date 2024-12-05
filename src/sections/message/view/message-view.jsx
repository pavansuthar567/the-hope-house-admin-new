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
  Modal,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { deleteMessage, getMessages } from 'src/_services/message.service';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { setSelectedMessage } from 'src/store/slices/messageSlice';
import { fhelper } from 'src/_helpers';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';

// ----------------------------------------------------------------------

const MessageView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState();

  const { messageLoading, messageList, crudMessageLoading } = useSelector(({ message }) => message);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredMessages = messageList?.filter((message) => {
    return (
      `${message.firstName} ${message.lastName}`.toLowerCase().includes(searchKey) ||
      message.email.toLowerCase().includes(searchKey) ||
      message.phoneNumber.toLowerCase().includes(searchKey) ||
      message.message.toLowerCase().includes(searchKey) ||
      new Date(message.createdAt)?.toLocaleDateString()?.includes(searchKey) ||
      new Date(message.updatedAt)?.toLocaleDateString()?.includes(searchKey)
    );
  });

  filteredMessages = filteredMessages?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getMessages());
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
      if (crudMessageLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedMessageId();
    },
    [crudMessageLoading]
  );

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteMessage(selectedMessageId));
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedMessageId]);

  const csvHeaders = useMemo(
    () => [
      { label: 'Id', key: 'srNo' },
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Phone Number', key: 'phoneNumber' },
      { label: 'Message', key: 'message' },
      { label: 'Created At', key: 'createdAt' },
      { label: 'Updated At', key: 'updatedAt' },
    ],
    []
  );

  const csvData = useMemo(() => {
    return (
      filteredMessages?.map((message) => ({
        srNo: message.srNo,
        name: `${message.firstName} ${message.lastName}`,
        email: message.email,
        phoneNumber: message.phoneNumber,
        message: message.message,
        createdAt: fhelper.formatAndDisplayDate(new Date(message.createdAt)),
        updatedAt: fhelper.formatAndDisplayDate(new Date(message.updatedAt)),
      })) || []
    );
  }, [filteredMessages]);

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
        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudMessageLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudMessageLoading ? (
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
  }, [open, crudMessageLoading]);

  return (
    <Container>
      {messageLoading ? (
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
            <Typography variant="h4">Messages</Typography>
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
                filename="messages.csv"
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
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell className="text-nowrap">Phone Number</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell className="text-nowrap">Created At</TableCell>
                      <TableCell className="text-nowrap">Updated At</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredMessages?.length ? (
                      filteredMessages.map((message, index) => (
                        <TableRow key={`message_${index}`}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="text-nowrap">
                            {message.firstName} {message.lastName}
                          </TableCell>
                          <TableCell>{message.email}</TableCell>
                          <TableCell>{message.phoneNumber}</TableCell>
                          <TableCell sx={{ minWidth: '200px', width: '400px' }}>
                            {message.message}
                          </TableCell>
                          <TableCell className="text-nowrap">
                            {fhelper.formatAndDisplayDate(new Date(message.createdAt))}
                          </TableCell>
                          <TableCell className="text-nowrap">
                            {fhelper.formatAndDisplayDate(new Date(message.updatedAt))}
                          </TableCell>
                          <TableCell>
                            <Iconify
                              className={'cursor-pointer'}
                              icon="iconamoon:menu-kebab-vertical-bold"
                              onClick={(e) => {
                                setOpen(e.currentTarget);
                                setSelectedMessageId(message._id);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography variant="body2" sx={{ color: 'text.secondary', p: 2 }}>
                            No Data
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {messageList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={messageList?.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            ) : null}
          </Card>

          {deleteDialog ? (
            <ConfirmationDialog
              open={deleteDialog}
              setOpen={setDeleteDialog}
              handleConfirm={handleDelete}
            >
              Do you want to delete this message?
            </ConfirmationDialog>
          ) : null}
        </>
      )}
      {renderPopup}
    </Container>
  );
};

export default MessageView;
