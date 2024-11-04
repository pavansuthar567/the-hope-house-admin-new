import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

import HomeCard from './home-card';
import NoData from 'src/components/no-data';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import { Button } from 'src/components/button';
import Pagination from 'src/components/pagination';
import { fPageCount } from 'src/utils/format-number';
import { perPageCountOptions } from 'src/_helpers/constants';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { deleteHome, getHomeList } from 'src/_services/home.service';
import { setPerPageCount, setSelectedHome } from 'src/store/slices/homeSlice';

// ----------------------------------------------------------------------

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [selectedHomeId, setSelectedHomeId] = useState();

  const { homeLoading, homeList, crudHomeLoading, perPageCount } = useSelector(({ home }) => home);

  useEffect(() => {
    const searchKey = searchedValue?.trim()?.toLowerCase();

    let filteredList = homeList?.filter((item) => {
      const matchesSearch =
        item?.mission?.toLowerCase()?.includes(searchKey) ||
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
  }, [page, homeList, perPageCount, searchedValue]);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getHomeList());
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
      if (crudHomeLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedHomeId();
    },
    [crudHomeLoading]
  );

  const handleEdit = useCallback(async () => {
    const home = homeList?.find((x) => x?._id === selectedHomeId);
    if (home) {
      dispatch(setSelectedHome(home));
      navigate(`/home/add?homeId=${home?._id}`);
    }
  }, [selectedHomeId, homeList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteHome(selectedHomeId));
    if (res) {
      const cPage = page !== 0 && currentPageData?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedHomeId, currentPageData]);

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
        <MenuItem onClick={handleEdit} disabled={crudHomeLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudHomeLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudHomeLoading ? (
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
  }, [open, crudHomeLoading]);

  return (
    <Container>
      {homeLoading ? (
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
            <Typography variant="h4">Home</Typography>
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
                onClick={() => navigate('/home/add')}
              >
                New Home
              </Button>
            </Box>
          </Box>
          <Stack sx={{ height: '99%', display: 'flex', justifyContent: 'space-between' }}>
            {homeLoading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            ) : (
              currentPageData?.length > 0 && (
                <>
                  <Grid container spacing={3}>
                    {currentPageData?.map((x) => (
                      <Grid key={x?._id} xs={12} sm={6}>
                        <HomeCard
                          home={x}
                          openDialog={deleteDialog}
                          setOpenDialog={setDeleteDialog}
                          setSelectedId={setSelectedHomeId}
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
            {(homeList?.length === 0 || currentPageData?.length === 0) && !homeLoading && (
              <NoData>
                {homeList?.length === 0
                  ? `Click the "New Home" button to get started.`
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
          loading={crudHomeLoading}
        >
          Do you want to delete this home?
        </ConfirmationDialog>
      ) : null}
    </Container>
  );
};

export default Home;
