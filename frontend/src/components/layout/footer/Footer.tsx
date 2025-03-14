// src/components/Footer/Footer.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "white", p: 2, textAlign: "center" }}>
      <Typography variant="body1">© 2023 Project Echo RPA. All rights reserved.</Typography>
    </Box>
  );
}

export default Footer;