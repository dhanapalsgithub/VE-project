import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function Staff() {
  const workers = [
    { id: 'V001', name: 'முருகன்', role: 'Driver', status: 'Present' },
    { id: 'V002', name: 'கணேஷ்', role: 'Manager', status: 'Present' },
    { id: 'V003', name: 'ராஜா', role: 'Helper', status: 'Absent' },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ color: '#ff6600', fontWeight: 'bold', mb: 3 }}>
        Staff Attendance / பணியாளர்கள் விவரம்
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fff5ed' }}>
            <TableRow>
              <TableCell sx={{ color: '#ff6600', fontWeight: 'bold' }}>ஐடி</TableCell>
              <TableCell sx={{ color: '#ff6600', fontWeight: 'bold' }}>ஊழியர் பெயர்</TableCell>
              <TableCell sx={{ color: '#ff6600', fontWeight: 'bold' }}>பணி (Role)</TableCell>
              <TableCell sx={{ color: '#ff6600', fontWeight: 'bold' }}>வருகை (Attendance)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.map((w) => (
              <TableRow key={w.id}>
                <TableCell>{w.id}</TableCell>
                <TableCell>{w.name}</TableCell>
                <TableCell>{w.role}</TableCell>
                <TableCell sx={{ color: w.status === 'Present' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                  {w.status === 'Present' ? '✅ வருகை' : '❌ விடுப்பு'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}