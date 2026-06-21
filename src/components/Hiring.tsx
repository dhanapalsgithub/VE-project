import { Box, Typography, Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField,  } from '@mui/material';
import { Inventory, WarningAmber, AttachMoney, AssignmentReturn } from '@mui/icons-material';
import  { useState } from 'react'; // React இறக்குமதி சரியாக இருக்கட்டும்

export default function MaterialDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('In Stock');
  const [page, setPage] = useState(0);

  // மாதிரி தரவுகள்
  const data = [
    { id: 1, name: 'Steel Pipe', status: 'In Stock', date: '2026-06-20', amount: 0 },
    { id: 2, name: 'Scaffolding', status: 'Overdue', date: '2026-05-15', amount: 500 },
  ];

  const stats = [
    { title: 'In Stock', value: 120, icon: <Inventory sx={{ color: '#2e7d32' }} />, color: '#e8f5e9' },
    { title: 'On Rent', value: 45, icon: <AssignmentReturn sx={{ color: '#1976d2' }} />, color: '#e3f2fd' },
    { title: 'Overdue', value: 8, icon: <WarningAmber sx={{ color: '#d32f2f' }} />, color: '#ffebee' },
    { title: 'Pending Rent', value: '₹ 15,500', icon: <AttachMoney sx={{ color: '#f57c00' }} />, color: '#fff3e0' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: '#ff6600', fontWeight: 'bold', mb: 3 }}>Material Tracking</Typography>

      {/* Grid2 ஐப் பயன்படுத்துங்கள் (MUI v6/latest) */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
            <Card onClick={() => setSelectedCategory(item.title)} sx={{ bgcolor: item.color, cursor: 'pointer', borderRadius: 3, boxShadow: 'none' }}>
              <CardContent>
                
                  <Box>
                    <Typography variant="caption">{item.title}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{item.value}</Typography>
                  </Box>
                  {item.icon}
               
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter Section */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField 
          size="small" 
          type="date" 
          label="Date" 
          slotProps={{ inputLabel: { shrink: true } }} // புதிய முறை: InputLabelProps-க்கு பதிலாக slotProps
        />
      </Stack>

      {/* Table Section */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Material Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.filter(item => item.status === selectedCategory).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination 
           component="div" 
           count={10} 
           page={page} 
           onPageChange={(_event, newPage) => setPage(newPage)} // 'e' என்பதற்கு பதிலாக '_event'
           rowsPerPage={5} 
        />
      </TableContainer>
    </Box>
  );
}