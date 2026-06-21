import { useState, useMemo } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Stack, TextField, 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, TablePagination, MenuItem 
} from '@mui/material';

interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: 'Income' | 'Expense';
}

export default function IncomeExpense() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState({ name: '', amount: '', type: 'Expense' as 'Income' | 'Expense' });
  const [page, setPage] = useState(0);
  const [filterDate, setFilterDate] = useState(''); // YYYY-MM format

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;
    
    const newTransaction = {
      id: Date.now(),
      name: formData.name,
      amount: Number(formData.amount),
      date: new Date().toISOString().split('T')[0],
      type: formData.type
    };
    setTransactions([newTransaction, ...transactions]);
    setFormData({ name: '', amount: '', type: 'Expense' });
  };

  const filteredList = useMemo(() => {
    return transactions.filter(t => filterDate ? t.date.startsWith(filterDate) : true);
  }, [transactions, filterDate]);

  const totalIncome = filteredList.filter(t => t.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = filteredList.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 0 } }}>
      <Typography variant="h5" sx={{ color: '#e88917', fontWeight: 'bold', mb: 3 }}>Income Expense </Typography>

      {/* Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}><Card sx={{ borderLeft: '6px solid #10b981' }}><CardContent><Typography>Total Income</Typography><Typography variant="h4" color="success.main">₹{totalIncome}</Typography></CardContent></Card></Grid>
        <Grid size={{ xs: 12, sm: 6 }}><Card sx={{ borderLeft: '6px solid #ef4444' }}><CardContent><Typography>Total Expense</Typography><Typography variant="h4" color="error.main">₹{totalExpense}</Typography></CardContent></Card></Grid>
      </Grid>

      {/* Entry Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} component="form" onSubmit={handleSubmit}>
          <TextField label="Item Name (e.g. Stationary/Xerox)" size="small" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <TextField label="Amount" type="number" size="small" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
          <TextField select label="Type" size="small" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})} sx={{ minWidth: 120 }}>
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#e88917' }}>Add Entry</Button>
        </Stack>
      </Paper>

      {/* Filter & Table */}
      <TextField type="month" size="small" label="Filter by Month" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} sx={{ mb: 2 }} />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell><TableCell>Name</TableCell><TableCell>Type</TableCell><TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.slice(page * 5, page * 5 + 5).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell sx={{ color: row.type === 'Income' ? 'green' : 'red' }}>{row.type}</TableCell>
                <TableCell>₹{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination count={filteredList.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={5} component="div" />
      </TableContainer>
    </Box>
  );
}