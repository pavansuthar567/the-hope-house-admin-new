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

import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { setSelectedBlog } from 'src/store/slices/blogSlice';
import { fhelper } from 'src/_helpers';
import { useNavigate } from 'react-router-dom';
import { getBlogs, deleteBlog } from 'src/_services/blog.service';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

const Testimonial = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState();

  const { blogLoading, blogList, crudBlogLoading } = useSelector(({ blog }) => blog);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = blogList?.filter((item) => {
    return (
      item?.title?.toLowerCase()?.includes(searchKey) ||
      item?.author?.toLowerCase()?.includes(searchKey) ||
      item?.content?.toLowerCase()?.includes(searchKey) ||
      item?.status?.toLowerCase()?.includes(searchKey) ||
      item?.createdBy?.name?.toLowerCase()?.includes(searchKey) ||
      item?.updatedBy?.name?.toLowerCase()?.includes(searchKey) ||
      new Date(item?.createdAt)?.toLocaleDateString()?.includes(searchKey) ||
      new Date(item?.updatedAt)?.toLocaleDateString()?.includes(searchKey)
    );
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getBlogs());
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
      if (crudBlogLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedBlogId();
    },
    [crudBlogLoading]
  );

  const handleEdit = useCallback(async () => {
    const blog = blogList?.find((x) => x?._id === selectedBlogId);
    if (blog) {
      dispatch(setSelectedBlog(blog));
      navigate(`/blog/add?blogId=${blog?._id}`);
    }
  }, [selectedBlogId, blogList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteBlog(selectedBlogId));
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedBlogId]);

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
        <MenuItem onClick={handleEdit} disabled={crudBlogLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudBlogLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudBlogLoading ? (
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
  }, [open, crudBlogLoading]);

  return (
    <Container>
      {blogLoading ? (
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
            <Typography variant="h4">Blogs</Typography>
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
                onClick={() => navigate('/blog/add')}
              >
                New Blog
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
                      <TableCell className="text-nowrap">Title</TableCell>
                      <TableCell className="text-nowrap">Author</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Tags</TableCell>
                      <TableCell>Likes</TableCell>
                      <TableCell>Views</TableCell>
                      <TableCell className="text-nowrap">Published Date</TableCell>
                      <TableCell className="text-nowrap">Created By</TableCell>
                      <TableCell className="text-nowrap">Updated By</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredItems?.length
                      ? filteredItems?.map((x, i) => (
                          <TableRow key={`blog-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell>{x?.title}</TableCell>
                            <TableCell>{x?.author}</TableCell>
                            <TableCell>{x?.category}</TableCell>
                            <TableCell>{x?.status}</TableCell>
                            <TableCell>
                              {x?.tags?.map((x, i) => (
                                <Label sx={{ m: 0 }} key={`tags-${x}-${i}`} className="!mb-1 !mr-1">
                                  {x}
                                </Label>
                              ))}
                            </TableCell>
                            <TableCell>{x?.likes}</TableCell>
                            <TableCell>{x?.views}</TableCell>
                            <TableCell className="text-nowrap">
                              {x?.publishedDate
                                ? fhelper.formatAndDisplayDate(new Date(x?.publishedDate))
                                : ''}
                            </TableCell>
                            <TableCell>{x?.createdBy?.name || 'N/A'}</TableCell>
                            <TableCell>{x?.updatedBy?.name || 'N/A'}</TableCell>
                            <TableCell sx={{ width: '50px' }}>
                              <Iconify
                                className={'cursor-pointer'}
                                icon="iconamoon:menu-kebab-vertical-bold"
                                onClick={(e) => {
                                  setOpen(e.currentTarget);
                                  setSelectedBlogId(x?._id);
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
            {blogList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={blogList?.length}
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
          loading={crudBlogLoading}
        >
          Do you want to delete this blog?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default Testimonial;
