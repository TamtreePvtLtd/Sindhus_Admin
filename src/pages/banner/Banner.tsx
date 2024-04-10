import { Box, Button, Typography } from '@mui/material'
import BannerDrawer from '../../pageDrawers/BannerDrawer';
import { useState } from 'react';


function Banner() {
    const [bannerDrawerOpen, setBannerDrawerOpen] = useState(false);
    
  const handleOpenDrawer = () => {
    setBannerDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setBannerDrawerOpen(false);
  };

     const handleSubmit = (data) => {
       handleCloseDrawer(); 
    };
    
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Banner</Typography>
        <Button onClick={handleOpenDrawer} sx={{ float: "right" }}>
          Add Banner image
        </Button>
      </Box>

      <BannerDrawer
        bannerDrawerOpen={bannerDrawerOpen}
        onSubmit={handleSubmit}
        handleClose={handleCloseDrawer}
      />
    </>
  );
}

export default Banner