import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';

import {
  Box,
  Stack,
  Popover,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Unstable_Grid2';

import GalleryCard from './gallery-card';
import NoData from 'src/components/no-data';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import { Button } from 'src/components/button';
import Pagination from 'src/components/pagination';
import { fPageCount } from 'src/utils/format-number';
import { perPageCountOptions } from 'src/_helpers/constants';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { deleteGallery, getGalleries } from 'src/_services/gallery.service';
import { setPerPageCount, setSelectedGallery } from 'src/store/slices/gallerySlice';
import { fhelper } from 'src/_helpers';

// ----------------------------------------------------------------------

const Gallery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [selectedGalleryId, setSelectedGalleryId] = useState();

  const { galleryLoading, galleryList, crudGalleryLoading, perPageCount } = useSelector(
    ({ gallery }) => gallery
  );

  useEffect(() => {
    const searchKey = searchedValue?.trim()?.toLowerCase();

    let filteredList = galleryList?.filter((item) => {
      const matchesSearch =
        item?.mission?.toLowerCase()?.includes(searchKey) ||
        item?.caption?.toLowerCase()?.includes(searchKey) ||
        item?.createdAt?.toLowerCase()?.includes(searchKey) ||
        item?.createdBy?.toLowerCase()?.includes(searchKey) ||
        item?.updatedBy?.toLowerCase()?.includes(searchKey) ||
        item?.updatedAt?.toLowerCase()?.includes(searchKey);

      return matchesSearch;
    });

    setFilteredList(filteredList);
    const indexOfLastItem = page * perPageCount;
    const indexOfFirstItem = indexOfLastItem - perPageCount;
    const currentItems = filteredList?.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentPageData(currentItems);
  }, [page, galleryList, perPageCount, searchedValue]);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getGalleries());
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
    setPage(1);
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudGalleryLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedGalleryId();
    },
    [crudGalleryLoading]
  );

  const handleEdit = useCallback(async () => {
    const gallery = galleryList?.find((x) => x?._id === selectedGalleryId);
    if (gallery) {
      dispatch(setSelectedGallery(gallery));
      navigate(`/gallery/add?galleryId=${gallery?._id}`);
    }
  }, [selectedGalleryId, galleryList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteGallery(selectedGalleryId));
    if (res) {
      const cPage = page !== 0 && currentPageData?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedGalleryId, currentPageData]);

  const pageCount = (
    <TextField
      select
      size="small"
      value={perPageCount}
      onChange={(e) => {
        dispatch(setPerPageCount(e.target.value));
        setPage(1);
      }}
    >
      {perPageCountOptions?.map((option) => (
        <MenuItem key={option?.value} value={option?.value}>
          {option?.label}
        </MenuItem>
      ))}
    </TextField>
  );

  // CSV headers and data memoization
  const csvHeaders = [
    { label: 'Id', key: 'id' },
    { label: 'Mission', key: 'mission' },
    { label: 'Caption', key: 'caption' },
    { label: 'Created At', key: 'createdAt' },
    { label: 'Created By', key: 'createdBy' },
    { label: 'Updated At', key: 'updatedAt' },
    { label: 'Updated By', key: 'updatedBy' },
  ];

  const csvData = useMemo(() => {
    return filteredList.map((item, index) => ({
      id: index + 1,
      mission: item.mission,
      caption: item.caption,
      createdAt: fhelper.formatAndDisplayDate(new Date(item.createdAt)),
      createdBy: item.createdBy,
      updatedAt: fhelper.formatAndDisplayDate(new Date(item.updatedAt)),
      updatedBy: item.updatedBy,
    }));
  }, [filteredList]);

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
        <MenuItem onClick={handleEdit} disabled={crudGalleryLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudGalleryLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudGalleryLoading ? (
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
  }, [open, crudGalleryLoading]);

  return (
    <Container>
      {galleryLoading ? (
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
            <Typography variant="h4">Gallery</Typography>
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
                onClick={() => navigate('/gallery/add')}
              >
                New Gallery
              </Button>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="gallery_data.csv"
                style={{ textDecoration: 'none' }}
              >
                <Button variant="contained">
                  <Iconify icon="basil:file-download-solid" sx={{ width: 24, height: 24 }} />
                </Button>
              </CSVLink>
            </Box>
          </Box>
          <Stack sx={{ height: '99%', display: 'flex', justifyContent: 'space-between' }}>
            {galleryLoading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            ) : (
              currentPageData?.length > 0 && (
                <>
                  <Grid container spacing={3}>
                    {currentPageData?.map((x) => (
                      <Grid key={x?._id} xs={12} sm={6}>
                        <GalleryCard
                          gallery={x}
                          openDialog={deleteDialog}
                          setOpenDialog={setDeleteDialog}
                          setSelectedId={setSelectedGalleryId}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Stack
                    sx={{
                      mb: 6,
                      mt: 2,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Stack
                      sx={{
                        mb: 6,
                        mt: 2,
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Stack
                        sx={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 2,
                        }}
                      >
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                          <Typography variant="subtitle2">
                            Products: {filteredList?.length}
                          </Typography>
                          {pageCount}
                        </Stack>
                      </Stack>
                      <Pagination
                        page={page}
                        onChange={handleChangePage}
                        className="flex justify-center items-center"
                        count={fPageCount(filteredList?.length, perPageCount)}
                      />
                    </Stack>
                  </Stack>
                </>
              )
            )}
            {(galleryList?.length === 0 || currentPageData?.length === 0) && !galleryLoading && (
              <NoData>
                {galleryList?.length === 0
                  ? `Click the "New Gallery" button to get started.`
                  : 'Clear all filters'}
              </NoData>
            )}
          </Stack>
        </>
      )}

      {renderPopup}

      {deleteDialog ? (
        <ConfirmationDialog
          open={deleteDialog}
          setOpen={setDeleteDialog}
          handleConfirm={handleDelete}
          loading={crudGalleryLoading}
        >
          Do you want to delete this gallery?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default Gallery;
