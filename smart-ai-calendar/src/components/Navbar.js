import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
    
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "black",
            fontWeight: "bold",
            flexGrow: 1,
          }}
        >
          Smart AI Calendar
        </Typography>

        {/* Nav Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          {isAuthenticated && (
            <Button component={Link} to="/dashboard" color="inherit">
              Dashboard
            </Button>
          )}
          {!isAuthenticated && (
            <span>{user?user.name:""}</span>
          )}
          {!isAuthenticated ? (
            <Button
              onClick={() => loginWithRedirect()}
              variant="outlined"
              sx={{ ml: 2 }}
            >
              Login / Signup
            </Button>
          ) : (
            <Button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              variant="outlined"
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
