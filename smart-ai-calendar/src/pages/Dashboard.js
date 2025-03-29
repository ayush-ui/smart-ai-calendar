import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const [calendarData, setCalendarData] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [calendarId, setCalendarId] = useState("");
  const [error, setError] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const handleDownload = async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch(
      `http://localhost:8000/calendar/download/${calendarId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `calendar_${calendarId}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setCalendarId("");

    try {
      const token = await getAccessTokenSilently();

      const res = await axios.post(
        "http://localhost:8000/calendar/plan",
        { input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.calendarId) {
        const newId = res.data.calendarId;
        setCalendarId(newId);

        const calendarRes = await axios.get(
          `http://localhost:8000/calendar/view/${newId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCalendarData(calendarRes.data.calendar);
      } else {
        setError("Calendar generation failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Error generating calendar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadLatestCalendar = async () => {
      try {
        const token = await getAccessTokenSilently();

        const res = await axios.get("http://localhost:8000/calendar/latest", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.calendar) {
          setCalendarId(res.data.calendarId);
          setCalendarData(res.data.calendar);
        }
      } catch (err) {
        console.log("No previous calendar found.");
      }
    };

    loadLatestCalendar();
  }, [getAccessTokenSilently]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        {/* Left: Input + Button */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Your Smart Scheduler
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Just describe your day and we'll generate a calendar for you.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="e.g., Study from 9-11 AM, meeting at 2 PM, gym at 5"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            variant="outlined"
            sx={{ mt: 3 }}
          />

          <Box mt={3}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Generate Calendar"
              )}
            </Button>
          </Box>

          {calendarId && (
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleDownload}>
              Download Calendar
            </Button>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Current Calendar
          </Typography>
          {calendarData ? (
            <Paper elevation={1} sx={{ p: 2, maxHeight: 400, overflowY: "auto" }}>
              <List>
                {calendarData.map((event, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            Start: {event.start.join("-")}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Duration: {event.duration.hours} hour(s)
                          </Typography>
                          {event.location && (
                            <Typography variant="body2" color="textSecondary">
                              Location: {event.location}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : (
            <Typography color="textSecondary">No calendar loaded yet.</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
