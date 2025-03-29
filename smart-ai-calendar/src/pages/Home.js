import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        py: 10,
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Smart AI Calendar
      </Typography>
      <Typography variant="h6" color="textSecondary" paragraph>
        Create your perfect schedule in seconds with the power of AI. Simply describe your day, and we'll turn it into a downloadable calendar file.
      </Typography>

      <Box mt={4}>
        {isAuthenticated ? (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() => loginWithRedirect()}
          >
            Get Started
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Home;
