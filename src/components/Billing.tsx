import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  TextField, 
  Stack, 
  useTheme,
  useMediaQuery,
  Chip,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination
} from '@mui/material';
import { 
  Add as AddIcon, 
  Receipt as ReceiptIcon, 
  QrCode2 as QrCodeIcon, 
  PersonAdd as PersonAddIcon,
  Download as DownloadIcon 
} from '@mui/icons-material';

// 1. Interface-ஐ மாற்றியமைக்கவும்
interface CustomerProfile {
  id: string;
  customerName: string;
  companyName: string;
  mobileNumber: string; // புதிய புலம்
  address: string;      // புதிய புலம்
}

interface BillItem {
  id: string;
  customerName: string;
  companyName: string;
  materialName: string;
  qty: number;
  rate: number;
  startDate: string;
  endDate: string;
  amount: number;
  billedBy: string;
  paymentMethod: 'Cash' | 'Online';
  status: 'Paid' | 'Pending';
}

const MATERIAL_OPTIONS = [
  "3x2 angle sheet",
  "2m jockey",
  "4m jockey",
  "3m shockey",
  "span",
  "half shet",
  "box"
];

export default function Billing() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filter State (By Invoice Start Date)
  const [filterDate, setFilterDate] = useState<string>('');

  // Pagination States
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // Saved Customer Profiles State
  const [customerList, setCustomerList] = useState<CustomerProfile[]>([
    { id: "CUST-01", customerName: "Rajesh Kumar", companyName: "RKM Constructions", mobileNumber: "", address: "" },
    { id: "CUST-02", customerName: "Siva Chandran", companyName: "Siva Traders", mobileNumber: "", address: "" },
    { id: "CUST-03", customerName: "Arun Mass", companyName: "Mass Builders", mobileNumber: "", address: "" },
  ]);

  // Billing Matrix Record State
  const [bills, setBills] = useState<BillItem[]>([
    { 
      id: "VE-2601", 
      customerName: "Rajesh Kumar", 
      companyName: "RKM Constructions", 
      materialName: "3x2 angle sheet", 
      qty: 50, 
      rate: 15, 
      startDate: "2026-06-01", 
      endDate: "2026-06-11", 
      amount: 7500, 
      billedBy: "Kumar", 
      paymentMethod: "Cash", 
      status: "Paid" 
    },
  ]);

  // Modals Controller
  const [openCustomerModal, setOpenCustomerModal] = useState(false);

  // New Profile Fields State
  const [newCustName, setNewCustName] = useState('');
  const [newCompName, setNewCompName] = useState('');
  const [newMobileNumber, setNewMobileNumber] = useState(''); // புதிய ஸ்டேட்
  const [newAddress, setNewAddress] = useState('');           // புதிய ஸ்டேட்

  // Primary Invoice Fields State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [materialName, setMaterialName] = useState(MATERIAL_OPTIONS[0]);
  const [qty, setQty] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [billedBy, setBilledBy] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online'>('Cash');
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);

  // Auto Calculations Hook (Qty * Rate * Rental Duration Days)
  useEffect(() => {
    if (qty && rate && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Default to 1 day minimum
      
      setCalculatedAmount(Number(qty) * Number(rate) * diffDays);
    } else {
      setCalculatedAmount(0);
    }
  }, [qty, rate, startDate, endDate]);

  // Filter Logic Engine
  const filteredBills = bills.filter(bill => {
    if (!filterDate) return true; // Show all if no filter date is selected
    return bill.startDate === filterDate;
  });

  // Pagination Slice
  const paginatedBills = filteredBills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Export to Excel Native XML Engine
  const handleExportExcel = () => {
    let xmlContent = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40"><Worksheet ss:Name="Invoices"><Table>`;
    
    xmlContent += `<Row><Cell><Data ss:Type="String">Invoice ID</Data></Cell><Cell><Data ss:Type="String">Company Name</Data></Cell><Cell><Data ss:Type="String">Customer Name</Data></Cell><Cell><Data ss:Type="String">Material Name</Data></Cell><Cell><Data ss:Type="String">Quantity</Data></Cell><Cell><Data ss:Type="String">Rate</Data></Cell><Cell><Data ss:Type="String">Start Date</Data></Cell><Cell><Data ss:Type="String">End Date</Data></Cell><Cell><Data ss:Type="String">Total Amount</Data></Cell><Cell><Data ss:Type="String">Billed By</Data></Cell><Cell><Data ss:Type="String">Payment Method</Data></Cell><Cell><Data ss:Type="String">Status</Data></Cell></Row>`;
    
    filteredBills.forEach(bill => {
      xmlContent += `<Row><Cell><Data ss:Type="String">${bill.id}</Data></Cell><Cell><Data ss:Type="String">${bill.companyName}</Data></Cell><Cell><Data ss:Type="String">${bill.customerName}</Data></Cell><Cell><Data ss:Type="String">${bill.materialName}</Data></Cell><Cell><Data ss:Type="Number">${bill.qty}</Data></Cell><Cell><Data ss:Type="Number">${bill.rate}</Data></Cell><Cell><Data ss:Type="String">${bill.startDate}</Data></Cell><Cell><Data ss:Type="String">${bill.endDate}</Data></Cell><Cell><Data ss:Type="Number">${bill.amount}</Data></Cell><Cell><Data ss:Type="String">${bill.billedBy}</Data></Cell><Cell><Data ss:Type="String">${bill.paymentMethod}</Data></Cell><Cell><Data ss:Type="String">${bill.status}</Data></Cell></Row>`;
    });
    
    xmlContent += `</Table></Worksheet></Workbook>`;
    
    const blobStream = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blobStream);
    const anchorNode = document.createElement('a');
    anchorNode.href = downloadUrl;
    anchorNode.download = `Billing_Report_${filterDate || 'All'}.xls`;
    document.body.appendChild(anchorNode);
    anchorNode.click();
    document.body.removeChild(anchorNode);
  };

  // Register New Client Profiles Callback
  const handleAddCustomerProfile = () => {
    if (!newCustName.trim() || !newCompName.trim()) {
      alert("Please provide both individual name and organization name.");
      return;
    }
    const targetId = `CUST-${String(customerList.length + 1).padStart(2, '0')}`;
    const profile: CustomerProfile = {
      id: targetId,
      customerName: newCustName.trim(),
      companyName: newCompName.trim(),
      mobileNumber: newMobileNumber.trim(), // புதிய தரவு சேமிப்பு
      address: newAddress.trim()            // புதிய தரவு சேமிப்பு
    };
    setCustomerList([...customerList, profile]);
    setSelectedCustomerId(targetId); // Auto-select newly added profile
    setNewCustName('');
    setNewCompName('');
    setNewMobileNumber(''); // ரீசெட்
    setNewAddress('');      // ரீசெட்
    setOpenCustomerModal(false);
  };

  // Dispatch and Save Invoice Form Actions
  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const activeProfile = customerList.find(c => c.id === selectedCustomerId);
    
    if (!activeProfile) {
      alert("Please select or register a customer first.");
      return;
    }
    if (!qty || !rate || !billedBy.trim()) return;

    const newBill: BillItem = {
      id: `INV-${2600 + bills.length + 1}`,
      customerName: activeProfile.customerName,
      companyName: activeProfile.companyName,
      materialName,
      qty: Number(qty),
      rate: Number(rate),
      startDate,
      endDate,
      amount: calculatedAmount,
      billedBy: billedBy.trim(),
      paymentMethod,
      status: paymentMethod === 'Online' ? 'Paid' : 'Pending'
    };

    setBills([newBill, ...bills]);
    setPage(0); // Reset to first page on new bill add
    
    // Clear out invoice inputs
    setSelectedCustomerId('');
    setQty('');
    setRate('');
    setBilledBy('');
    setPaymentMethod('Cash');
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Title Block Header Section & Date Filters */}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={2} 
        sx={{ mb: 4, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}
      >
        <Box>
          <Typography variant="h5" sx={{ color: '#d97706', fontWeight: 800, letterSpacing: '-0.5px', fontSize: { xs: '1.4rem', sm: '1.75rem' } }}>
            Billing Matrix
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
            Generate items rental invoices, calculate processing periods, and track active statuses
          </Typography>
        </Box>

        {/* Calendar Filter & Export Controls Stack */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' }, alignItems: 'center' }}>
          <TextField
            label=""
            type="date"
            size="small"
            
            value={filterDate}
            onChange={(e) => { setFilterDate(e.target.value); setPage(0); }}
            sx={{ width: { xs: '100%', sm: 180 } }}
          />
          {filterDate && (
            <Button size="small" onClick={() => { setFilterDate(''); setPage(0); }} sx={{ color: '#64748b', textTransform: 'none' }}>
              Clear
            </Button>
          )}
          <Button 
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportExcel}
            sx={{ 
              borderColor: '#d97706', 
              color: '#d97706', 
              '&:hover': { borderColor: '#b45309', bgcolor: '#fffbeb' }, 
              borderRadius: '10px', 
              textTransform: 'none', 
              fontWeight: 700, 
              width: { xs: '100%', sm: 'auto' }, 
              height: 40,
              whiteSpace: 'nowrap'
            }}
          >
            Export Excel
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        {/* INVOICE DISPATCH AND FORM BUILDER TERMINAL */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ borderRadius: '16px', borderColor: '#e2e8f0', bgcolor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptIcon sx={{ color: '#d97706' }} /> Invoice Engine
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<PersonAddIcon />} 
                  onClick={() => setOpenCustomerModal(true)}
                  sx={{ color: '#d97706', fontWeight: 700, textTransform: 'none', fontSize: '0.8rem' }}
                >
                  + New Client
                </Button>
              </Stack>
              
              <Box component="form" onSubmit={handleCreateBill}>
                <Stack spacing={2.5}>
                  <TextField
                    select
                    label="Select Target Client"
                    size="small"
                    fullWidth
                    color="warning"
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    required
                  >
                    {customerList.map((c) => (
                      <MenuItem key={c.id} value={c.id} sx={{ fontWeight: 500 }}>
                        {c.companyName} ({c.customerName})
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Material / Asset Type"
                    size="small"
                    fullWidth
                    color="warning"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    required
                  >
                    {MATERIAL_OPTIONS.map((opt) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </TextField>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        label="Quantity (Nos)"
                        type="number"
                        size="small"
                        fullWidth
                        color="warning"
                        value={qty}
                        onChange={(e) => setQty(e.target.value === '' ? '' : Number(e.target.value))}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        label="Rate / Day (₹)"
                        type="number"
                        size="small"
                        fullWidth
                        color="warning"
                        value={rate}
                        onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
                        required
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        label="Rent Start Date"
                        type="date"
                        size="small"
                        fullWidth
                        color="warning"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        label="Rent End Date"
                        type="date"
                        size="small"
                        fullWidth
                        color="warning"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    label="Billed Representative Name"
                    size="small"
                    fullWidth
                    color="warning"
                    value={billedBy}
                    onChange={(e) => setBilledBy(e.target.value)}
                    required
                  />

                  <TextField
                    select
                    label="Payment Type Selection"
                    size="small"
                    fullWidth
                    color="warning"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'Cash' | 'Online')}
                    required
                  >
                    <MenuItem value="Cash">Cash Transaction (Pending Processing)</MenuItem>
                    <MenuItem value="Online">Online / UPI Gateway Instant Pay</MenuItem>
                  </TextField>

                  {/* REAL-TIME PAYMENTS & QR DYNAMICS */}
                  {paymentMethod === 'Online' && calculatedAmount > 0 && (
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, display: 'block', mb: 1, letterSpacing: '0.5px' }}>
                        SCAN INSTANT PAYMENTS GATEWAY
                      </Typography>
                      <Box sx={{ width: 110, height: 110, bgcolor: '#ffffff', border: '1px solid #e2e8f0', mx: 'auto', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <QrCodeIcon sx={{ fontSize: 90, color: '#0f172a' }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 700, mt: 1, display: 'block' }}>
                        Dynamic Amount Locked: ₹{calculatedAmount.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Calculated Gross Total:</Typography>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 800 }}>₹{calculatedAmount.toLocaleString('en-IN')}</Typography>
                  </Stack>

                  <Button 
                    type="submit"
                    variant="contained" 
                    startIcon={<AddIcon />}
                    sx={{ 
                      bgcolor: '#d97706', 
                      '&:hover': { bgcolor: '#b45309' }, 
                      fontWeight: 700, 
                      borderRadius: '10px', 
                      py: 1.2, 
                      textTransform: 'none',
                      boxShadow: '0 2px 8px rgba(217,119,6,0.15)'
                    }}
                  >
                    Generate Invoice Record
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* COMPREHENSIVE INVOICING ARCHIVE METRICS */}
        <Grid size={{ xs: 12 }}>
          {!isMobile ? (
            /* SYSTEM TABLE ARCHIVE DESIGN MATRIX */
            <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Inv ID</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Customer & Company</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Material Details</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Rental Duration</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Gross Total</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Settlement / Auth</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBills.map((bill) => (
                    <TableRow key={bill.id} sx={{ '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>{bill.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{bill.companyName}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Pic: {bill.customerName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{bill.materialName}</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>{bill.qty} units × ₹{bill.rate}/d</Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#334155' }}>{bill.startDate}</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>to {bill.endDate}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>₹{bill.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <Stack spacing={0.5} sx={{ alignItems: 'flex-start' }}>
                          <Chip 
                            label={`${bill.status} (${bill.paymentMethod})`} 
                            size="small" 
                            sx={{ 
                              bgcolor: bill.status === 'Paid' ? '#f0fdf4' : '#fffbeb', 
                              color: bill.status === 'Paid' ? '#15803d' : '#92400e',
                              fontWeight: 700,
                              borderRadius: '6px'
                            }} 
                          />
                          <Typography variant="caption" sx={{ color: '#94a3b8', pl: 0.5 }}>By: {bill.billedBy}</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedBills.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No invoices found for the selected date.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredBills.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5]}
              />
            </TableContainer>
          ) : (
            /* RESPONSIVE MOBILE HANDSET VIEW ADAPTER PORT */
            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 800, px: 0.5, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                Recent Invoices Summary ({filteredBills.length})
              </Typography>
              {paginatedBills.map((bill) => (
                <Card key={bill.id} variant="outlined" sx={{ borderRadius: '14px', borderColor: '#e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 700 }}>
                        {bill.id} • {bill.startDate}
                      </Typography>
                      <Chip 
                        label={bill.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: bill.status === 'Paid' ? '#f0fdf4' : '#fffbeb', 
                          color: bill.status === 'Paid' ? '#15803d' : '#92400e',
                          fontWeight: 700,
                          height: 20,
                          fontSize: '11px',
                          borderRadius: '4px'
                        }} 
                      />
                    </Stack>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {bill.companyName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
                      Asset: {bill.qty} × {bill.materialName}
                    </Typography>
                    
                    <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                    
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>Auth Agent: {bill.billedBy}</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        ₹{bill.amount.toLocaleString('en-IN')}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
              {paginatedBills.length === 0 && (
                <Typography variant="body2" align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No invoices found for the selected date.
                </Typography>
              )}
              <TablePagination
                component="div"
                count={filteredBills.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5]}
              />
            </Stack>
          )}
        </Grid>
      </Grid>

      {/* NEW CUSTOMER REGISTRATION POPUP MODAL */}
      <Dialog 
        open={openCustomerModal} 
        onClose={() => setOpenCustomerModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1e293b', pt: 3, pb: 1 }}>
          Create Customer Profile
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Company / Enterprise Name"
              size="small"
              fullWidth
              color="warning"
              value={newCompName}
              onChange={(e) => setNewCompName(e.target.value)}
              required
            />
            <TextField
              label="Contact Person Name (Customer)"
              size="small"
              fullWidth
              color="warning"
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
              required
            />
            {/* புதிய மொபைல் எண் புலம் */}
            <TextField
              label="Mobile Number"
              size="small"
              fullWidth
              color="warning"
              value={newMobileNumber}
              onChange={(e) => setNewMobileNumber(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 10 } }}
            />
            {/* புதிய முகவரி புலம் */}
            <TextField
              label="Address"
              size="small"
              fullWidth
              multiline
              rows={2}
              color="warning"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc' }}>
          <Button onClick={() => setOpenCustomerModal(false)} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddCustomerProfile}
            sx={{ bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' }, textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
          >
            Save Profile
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}