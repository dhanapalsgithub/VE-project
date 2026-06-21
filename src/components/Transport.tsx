import { useState, useRef, useMemo } from 'react';
import { 
  Box, Typography, TextField, Button, Card, CardContent, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper,   Grid, TablePagination 
} from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TransportData {
  id: number;
  vNo: string;
  driverName: string;
  driverMobile: string;
  company: string;
  material: string;
  billNo: string;
  deliveryPlace: string;
  km: number;
  date: string;
}

export default function Transport() {
  const [data] = useState<TransportData[]>([
    { id: 1, vNo: 'TN-21-AB-1234', driverName: 'Ramesh', driverMobile: '9876543210', company: 'ABC Construction', material: 'Steel Rods', billNo: 'B001', deliveryPlace: 'Site A', km: 45, date: '2026-06-20' },
  ]);
  
  const [page, setPage] = useState(0);
  const [filterDate, setFilterDate] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    return data.filter(item => item.date.includes(filterDate));
  }, [data, filterDate]);

  const handleGenerateAndPrint = async (row: TransportData) => {
    const input = printRef.current;
    if (input) {
      input.style.display = 'block';
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      input.style.display = 'none';

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: '#ff6600', fontWeight: 'bold', mb: 3 }}>
        Transport & Delivery Management
      </Typography>

      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 2 }}><TextField label="Vehicle" size="small" fullWidth /></Grid>
            <Grid size={{ xs: 12, md: 2 }}><TextField label="Material" size="small" fullWidth /></Grid>
            <Grid size={{ xs: 12, md: 2 }}><TextField label="Bill No" size="small" fullWidth /></Grid>
            <Grid size={{ xs: 12, md: 2 }}><TextField label="Delivery Place" size="small" fullWidth /></Grid>
            <Grid size={{ xs: 12, md: 2 }}><TextField label="KM" type="number" size="small" fullWidth /></Grid>
            <Grid size={{ xs: 12, md: 2 }}><Button variant="contained" fullWidth sx={{ bgcolor: '#ff6600' }}>Save</Button></Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 2 }}>
        <TextField size="small" label="Filter (YYYY-MM-DD)" onChange={(e) => setFilterDate(e.target.value)} />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle</TableCell><TableCell>Material</TableCell><TableCell>Bill No</TableCell><TableCell>Place</TableCell><TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * 5, page * 5 + 5).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.vNo}</TableCell><TableCell>{row.material}</TableCell><TableCell>{row.billNo}</TableCell><TableCell>{row.deliveryPlace}</TableCell>
                <TableCell><Button size="small" variant="contained" onClick={() => handleGenerateAndPrint(row)}>Print DC</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination component="div" count={filteredData.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={5} />
      </TableContainer>

      {/* Hidden Print Area */}
      <Box ref={printRef} sx={{ display: 'none', p: 5, bgcolor: '#fff' }}>
        <Typography variant="h4">Delivery Challan</Typography>
        <Box sx={{ my: 2 }}>
          <Typography>Material: Steel Rods</Typography>
          <Typography>Bill No: B001</Typography>
          <Typography>Destination: Site A (45 KM)</Typography>
        </Box>
      </Box>
    </Box>
  );
}