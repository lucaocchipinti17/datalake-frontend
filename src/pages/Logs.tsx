import { useEffect, useState } from 'react';
import API from '../api';
import { saveAs } from 'file-saver';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Stack,
  Pagination,
  Grid,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [eventType, setEventType] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDate, setDeleteDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (
    customEventType = eventType,
    customStartDate = startDate,
    customEndDate = endDate,
    customPage = page
  ) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        event_type: customEventType,
        start_date: customStartDate ? customStartDate.toISOString() : '',
        end_date: customEndDate ? customEndDate.toISOString() : '',
        page: customPage.toString(),
        limit: '10',
      });

      const res = await API.get(`/logs/filter?${params.toString()}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(Math.ceil(data.total / 10) || 1);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'logs.json');
  };

  const handleDeleteBeforeDate = async () => {
    if (!deleteDate) return alert('Please select a date');
    const confirmed = confirm(
      `Are you sure you want to delete all logs before ${deleteDate.toDateString()}?`
    );
    if (!confirmed) return;

    try {
      await API.delete('/logs/', {
        before: deleteDate.toISOString(),
      });
      fetchLogs(); // Refresh
    } catch (err) {
      console.error(err);
      setError('Failed to delete logs');
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchLogs(eventType, startDate, endDate, 1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Logs
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Event Type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="e.g. login, import"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <DateTimePicker
                label="Start Date"
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <DateTimePicker
                label="End Date"
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                  <Button variant="outlined" onClick={handleExport}>
                    Export JSON
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="Delete logs before"
                value={deleteDate}
                onChange={(newDate) => setDeleteDate(newDate)}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteBeforeDate}
              >
                Delete
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Page {page} of {totalPages}
            </Typography>
          </Stack>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ mb: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Timestamp</strong></TableCell>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Event</strong></TableCell>
                  <TableCell><strong>Success</strong></TableCell>
                  <TableCell><strong>Details</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log: any) => (
                    <TableRow key={log.log_id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.username || 'N/A'}</TableCell>
                      <TableCell>{log.event_type}</TableCell>
                      <TableCell>
                        {log.success ? (
                          <Typography color="success.main">✓</Typography>
                        ) : (
                          <Typography color="error.main">✗</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
