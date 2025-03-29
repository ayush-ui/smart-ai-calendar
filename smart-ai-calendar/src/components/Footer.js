import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 4,
        mt: "auto",
        textAlign: "center",
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "#fafafa",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Smart AI Calendar. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
