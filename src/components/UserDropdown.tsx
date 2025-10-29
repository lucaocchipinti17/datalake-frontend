import React, { useState } from 'react';
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserDropdown = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/'); // or '/login'
  };

  if (!username) return null;

  return (
    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
      <IconButton onClick={handleMenuOpen} size="small">
        <Avatar>{username[0]?.toUpperCase()}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 4,
          sx: { mt: 1.5, minWidth: 150 },
        }}
      >
        <MenuItem disabled>
          <Typography variant="body2">Signed in as </Typography>
          <Typography fontWeight={600}>{username}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default UserDropdown;