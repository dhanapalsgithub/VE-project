import { useState, useMemo } from 'react';
import {
  TextField, Button, Stack, Box, Grid, Typography, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, MenuItem
} from '@mui/material';

export interface NewCustomerData {
  customerName: string;
  companyName: string;
  mobileNumber: string;
  address: string;
  date: string;
}

interface ClientDataPageProps {
  onSave: (data: NewCustomerData) => void;
}

export default function ClientDataPage({ onSave }: ClientDataPageProps) {
  const [formData, setFormData] = useState({ customerName: '', companyName: '', mobileNumber: '', address: '' });
  const [clientsList, setClientsList] = useState<NewCustomerData[]>([]);
  const [page, setPage] = useState(0);
  const [filterMonth, setFilterMonth] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = { ...formData, date: new Date().toISOString() };
    setClientsList([newClient, ...clientsList]); // LIFO: புதிய தரவு முதலில்
    onSave(newClient);
    setFormData({ customerName: '', companyName: '', mobileNumber: '', address: '' });
  };

  const filteredList = useMemo(() => {
    return clientsList.filter(c => filterMonth === '' || new Date(c.date).getMonth().toString() === filterMonth);
  }, [clientsList, filterMonth]);

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>New Customer Details</Typography>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, mb: 4 }}>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            {/* 'item' என்பதை நீக்கிவிட்டு, 'size' என மாற்றவும் */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Client Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          <TextField fullWidth label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
          {/* Address field added here */}
          <TextField fullWidth label="Address" name="address" multiline rows={2} value={formData.address} onChange={handleChange} />

          <Button type="submit" variant="contained" sx={{ bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' } }}>Save Client</Button>
        </Stack>
      </Paper>

      <TextField select label="Filter by Month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} sx={{ mb: 2, width: 200 }}>
        <MenuItem value="">All Months</MenuItem>
        {[...Array(12).keys()].map(m => <MenuItem key={m} value={m.toString()}>{new Date(0, m).toLocaleString('default', { month: 'long' })}</MenuItem>)}
      </TextField>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell><TableCell>Client</TableCell><TableCell>Mobile</TableCell><TableCell>Address</TableCell><TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.slice(page * 5, page * 5 + 5).map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.companyName}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.mobileNumber}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination count={filteredList.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={5} component="div" />
      </TableContainer>
    </Box>
  );
}