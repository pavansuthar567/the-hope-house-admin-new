import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Tooltip, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

export default function HomeCard({ home, setOpenDialog, isEdit = true, setSelectedId }) {
  const navigate = useNavigate();

  const renderImg = (
    <div className="min-h-[300px] flex justify-center items-center w-full">
      <ProgressiveImg
        src={home?.logo}
        alt={home?.caption || ''}
        title={home?.caption || ''}
        placeHolderClassName={'h-[75px]'}
      />
    </div>
  );

  return (
    <Card className="group !rounded-lg">
      <Box className="flex justify-center items-center bg-neutral-800">{renderImg}</Box>
      <Stack spacing={1} sx={{ py: 1, px: 2, bgcolor: 'white' }}>
        <Stack justifyContent="space-between" className="!mt-0">
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {home?.whoWeAre || ''}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {home?.whatWeDo || ''}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" className="!mt-0">
          <Typography variant="caption">{home?.quote || ''}</Typography>
        </Stack>
      </Stack>

      <Stack
        spacing={2}
        sx={{
          top: 0,
          width: '100%',
          gap: '0.5rem',
          height: '100%',
          display: 'none',
          position: 'absolute',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          transition: 'all 1s ease',
          backdropFilter: 'blur(50px)',
          bgcolor: 'rgba(24, 119, 242, 0.16)',
        }}
        className="group-hover:!flex"
      >
        {isEdit ? (
          <Tooltip title="Edit">
            <Iconify
              width={28}
              icon="flowbite:edit-solid"
              onClick={() => navigate(`/home/add?homeId=${home?._id}`)}
              className="hover:text-white text-slate-300 duration-200 transition-all ease-in-out cursor-pointer w-fit !mt-0"
            />
          </Tooltip>
        ) : null}
        <Tooltip title="Delete">
          <Iconify
            width={28}
            onClick={() => {
              setOpenDialog(true);
              setSelectedId(home?._id);
            }}
            icon="icon-park-solid:delete-five"
            className="hover:text-white text-slate-300 duration-200 transition-all ease-in-out cursor-pointer !mt-0"
          />
        </Tooltip>
      </Stack>
    </Card>
  );
}

HomeCard.propTypes = {
  home: PropTypes.object,
};
