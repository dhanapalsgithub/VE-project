import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Stack,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  TablePagination,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Inventory2 as InventoryIcon,
  WarningAmber as LowStockIcon,
  ErrorOutlined as OutOfStockIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

interface StockItem {
  id: string;
  itemName: string;
  qty: number;
  unit: string; 
  updatedBy: string;
  dateAdded: string; // ISO String format YYYY-MM
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
const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027", "2028"];

export default function Stock() {
  const theme = useTheme(); 
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [stock, setStock] = useState<StockItem[]>([
    { id: "VEM-01", itemName: "3x2 angle sheet", qty: 120, unit: "Nos", updatedBy: "Kumar", dateAdded: "2026-06" },
    { id: "VEM-02", itemName: "2m jockey", qty: 15, unit: "Nos", updatedBy: "Siva", dateAdded: "2026-06" },
    { id: "VEM-03", itemName: "span", qty: 0, unit: "Nos", updatedBy: "Ram", dateAdded: "2026-05" },
    { id: "VEM-04", itemName: "box", qty: 85, unit: "Nos", updatedBy: "Kumar", dateAdded: "2026-04" },
    { id: "VEM-05", itemName: "4m jockey", qty: 200, unit: "Nos", updatedBy: "Siva", dateAdded: "2026-06" },
    { id: "VEM-06", itemName: "3m shockey", qty: 45, unit: "Nos", updatedBy: "Ram", dateAdded: "2026-06" },
    { id: "VEM-07", itemName: "half shet", qty: 12, unit: "Nos", updatedBy: "Kumar", dateAdded: "2026-05" },
    { id: "VEM-08", itemName: "box", qty: 90, unit: "Nos", updatedBy: "Siva", dateAdded: "2026-06" },
    { id: "VEM-09", itemName: "span", qty: 150, unit: "Nos", updatedBy: "Kumar", dateAdded: "2026-06" },
    { id: "VEM-10", itemName: "2m jockey", qty: 0, unit: "Nos", updatedBy: "Ram", dateAdded: "2026-03" },
    { id: "VEM-11", itemName: "3x2 angle sheet", qty: 75, unit: "Nos", updatedBy: "Siva", dateAdded: "2026-06" }
  ]);

  // Date Filtering Matrix
  const [filterMonth, setFilterMonth] = useState<string>("06");
  const [filterYear, setFilterYear] = useState<string>("2026");

  // Pagination Controls
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  
  const [formItemName, setFormItemName] = useState(MATERIAL_OPTIONS[0]);
  const [formQty, setFormQty] = useState<number>(0);
  const [formAuditor, setFormAuditor] = useState("");
  const [updateMode, setUpdateMode] = useState<"add" | "override">("add");

  // Dynamic Filtering Process Engine
  const filteredStock = stock.filter(item => {
    const targetMatch = `${filterYear}-${filterMonth}`;
    return item.dateAdded === targetMatch;
  });

  // Safe Index Slicing for Pagination Matrix
  const paginatedStock = filteredStock.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormItemName(MATERIAL_OPTIONS[0]);
    setFormQty(0);
    setFormAuditor("");
    setUpdateMode("add");
    setOpenDialog(true);
  };

  const handleOpenEdit = (item: StockItem) => {
    setEditingItem(item);
    setFormItemName(item.itemName);
    setFormQty(0); 
    setFormAuditor("");
    setUpdateMode("add"); 
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this stock category?")) {
      setStock(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSave = () => {
    if (!formAuditor.trim()) {
      alert("Please provide the name of the Auditor updating the record.");
      return;
    }
    const currentPeriod = `${filterYear}-${filterMonth}`;

    if (editingItem) {
      setStock(prev => prev.map(item => {
        if (item.id === editingItem.id) {
          const finalQty = updateMode === "add" 
            ? item.qty + formQty 
            : formQty;
          return {
            ...item,
            itemName: formItemName,
            qty: Math.max(0, finalQty),
            updatedBy: formAuditor
          };
        }
        return item;
      }));
    } else {
      const generatedId = `STK-${String(stock.length + 1).padStart(2, '0')}`;
      const newItem: StockItem = {
        id: generatedId,
        itemName: formItemName,
        qty: Math.max(0, formQty),
        unit: "Nos",
        updatedBy: formAuditor,
        dateAdded: currentPeriod
      };
      setStock(prev => [...prev, newItem]);
    }
    setOpenDialog(false);
  };

  // Raw Data Processor to Native Excel File System Stream
  const handleExportExcel = () => {
    let xmlContent = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40"><Worksheet ss:Name="Stock Audit"><Table>`;
    
    // Header Data Row Template Mapping
    xmlContent += `<Row><Cell><Data ss:Type="String">Item Code</Data></Cell><Cell><Data ss:Type="String">Material Name</Data></Cell><Cell><Data ss:Type="String">Quantity</Data></Cell><Cell><Data ss:Type="String">Unit</Data></Cell><Cell><Data ss:Type="String">Audited By</Data></Cell><Cell><Data ss:Type="String">Period Range</Data></Cell></Row>`;
    
    // Structural Node Generation Loop
    filteredStock.forEach(item => {
      xmlContent += `<Row><Cell><Data ss:Type="String">${item.id}</Data></Cell><Cell><Data ss:Type="String">${item.itemName}</Data></Cell><Cell><Data ss:Type="Number">${item.qty}</Data></Cell><Cell><Data ss:Type="String">${item.unit}</Data></Cell><Cell><Data ss:Type="String">${item.updatedBy}</Data></Cell><Cell><Data ss:Type="String">${item.dateAdded}</Data></Cell></Row>`;
    });
    
    xmlContent += `</Table></Worksheet></Workbook>`;
    
    const blobStream = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blobStream);
    const anchorNode = document.createElement('a');
    anchorNode.href = downloadUrl;
    anchorNode.download = `Stock_Report_${filterYear}_${filterMonth}.xls`;
    document.body.appendChild(anchorNode);
    anchorNode.click();
    document.body.removeChild(anchorNode);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 0 }, width: '100%' }}>
      {/* Title & Action Strip Section */}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={2} 
        sx={{ 
          mb: 4,
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' }
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ color: '#e88917', fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Inventory Management
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Live raw materials audit, quantity indicators, and inventory logs
          </Typography>
        </Box>

        {/* Month Select, Year Select & Buttons Layer */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' }, alignItems: 'center' }}>
          <TextField
            select
            size="small"
            label="Month"
            value={filterMonth}
            onChange={(e) => { setFilterMonth(e.target.value); setPage(0); }}
            sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}
          >
            {MONTH_OPTIONS.map((m) => (
              <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Year"
            value={filterYear}
            onChange={(e) => { setFilterYear(e.target.value); setPage(0); }}
            sx={{ minWidth: 100, width: { xs: '100%', sm: 'auto' } }}
          >
            {YEAR_OPTIONS.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </TextField>

          <Button 
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportExcel}
            sx={{ borderColor: '#e88917', color: '#e88917', '&:hover': { borderColor: '#d47b13', bgcolor: '#fff5ed' }, borderRadius: 2, textTransform: 'none', fontWeight: '10px', width: { xs: '100%', sm: 'auto' }, height: 40 }}
          >
            Export
          </Button>

          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ bgcolor: '#e88917', '&:hover': { bgcolor: '#d47b13' }, borderRadius: 2, textTransform: 'none', fontWeight: 'bold', width: { xs: '100%', sm: 'auto' }, height: 40, whiteSpace: 'nowrap' }}
          >
            Add New Stock
          </Button>
        </Stack>
      </Stack>

      {/* Analytics Summary Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e5e7eb' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>TOTAL SCALED PRODUCTS</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{stock.length} Categories</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e5e7eb', borderLeft: '5px solid #d97706' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>LOW STOCK RUNS (≤20)</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d97706' }}>
                {stock.filter(i => i.qty > 0 && i.qty <= 20).length} Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e5e7eb', borderLeft: '5px solid #ef4444' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>OUT OF STOCK METRICS</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ef4444' }}>
                {stock.filter(i => i.qty === 0).length} Depleted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Stock Data Table / Mobile Cards Stack */}
      {!isMobile ? (
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#fff5ed' }}>
              <TableRow>
                <TableCell sx={{ color: '#e88917', fontWeight: 'bold' }}>Item Code</TableCell>
                <TableCell sx={{ color: '#e88917', fontWeight: 'bold' }}>Material Name</TableCell>
                <TableCell sx={{ color: '#e88917', fontWeight: 'bold' }}>Current Stock Level</TableCell>
                <TableCell sx={{ color: '#e88917', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#e88917', fontWeight: 'bold' }}>Audited By</TableCell>
                <TableCell sx={{ color: '#e88917', fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStock.map((item) => {
                const isOut = item.qty === 0;
                const isLow = item.qty > 0 && item.qty <= 20;
                return (
                  <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#fbfbfb' } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{item.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#111827' }}>{item.itemName}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{item.qty} {item.unit}</TableCell>
                    <TableCell>
                      <Chip 
                        label={isOut ? "Out of Stock" : isLow ? "Low Stock" : "Healthy"}
                        size="small"
                        icon={isOut ? <OutOfStockIcon /> : isLow ? <LowStockIcon /> : <InventoryIcon />}
                        sx={{ 
                          bgcolor: isOut ? '#fef2f2' : isLow ? '#fffbeb' : '#f0fdf4',
                          color: isOut ? '#ef4444' : isLow ? '#d97706' : '#16a34a',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>{item.updatedBy}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <IconButton onClick={() => handleOpenEdit(item)} sx={{ color: '#e88917', mr: 0.5 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} sx={{ color: '#ef4444' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedStock.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No data found for the selected period ({filterYear}-{filterMonth}).
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredStock.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[10]}
          />
        </TableContainer>
      ) : (
        <Stack spacing={2}>
          {paginatedStock.map((item) => {
            const isOut = item.qty === 0;
            const isLow = item.qty > 0 && item.qty <= 20;
            return (
              <Card key={item.id} variant="outlined" sx={{ borderRadius: 3, borderColor: '#e5e7eb' }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack 
                    direction="row" 
                    sx={{ 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 1.5 
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">{item.id}</Typography>
                    <Box>
                      <IconButton onClick={() => handleOpenEdit(item)} size="small" sx={{ color: '#e88917', p: 0.5, mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} size="small" sx={{ color: '#ef4444', p: 0.5 }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Stack>
                  
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>{item.itemName}</Typography>
                  
                  <Stack 
                    direction="row" 
                    sx={{ 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      bgcolor: '#f9fafb', 
                      p: 1, 
                      borderRadius: 2, 
                      mb: 1 
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">Quantity:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {item.qty} {item.unit} 
                      <Chip 
                        label={isOut ? "Depleted" : isLow ? "Low" : "OK"} 
                        size="small" 
                        sx={{ ml: 1, height: 18, fontSize: '10px', bgcolor: isOut ? '#fef2f2' : isLow ? '#fffbeb' : '#f0fdf4', color: isOut ? '#ef4444' : isLow ? '#d97706' : '#16a34a' }}
                      />
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Auditor: {item.updatedBy}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
          {paginatedStock.length === 0 && (
            <Typography variant="body2" align="center" sx={{ py: 3, color: 'text.secondary' }}>
              No data found for the selected period ({filterYear}-{filterMonth}).
            </Typography>
          )}
          <TablePagination
            component="div"
            count={filteredStock.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[10]}
          />
        </Stack>
      )}

      {/* CRUD Core Modal Subsystem Dialog Box */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs" >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#e88917' }}>
          {editingItem ? 'Modify/Audit Material' : 'Register New Asset Stock'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              select
              label="Select Material Category"
              value={formItemName}
              onChange={(e) => setFormItemName(e.target.value)}
              fullWidth
            >
              {MATERIAL_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>

            {editingItem && (
              <Box sx={{ p: 1.5, bgcolor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                  UPDATE CALCULATION METHOD
                </Typography>
                <RadioGroup row value={updateMode} onChange={(e) => setUpdateMode(e.target.value as 'add' | 'override')}>
                  <FormControlLabel value="add" control={<Radio size="small" sx={{ color: '#e88917', '&.Mui-checked': { color: '#e88917' } }} />} label="Add to Existing" />
                  <FormControlLabel value="override" control={<Radio size="small" sx={{ color: '#e88917', '&.Mui-checked': { color: '#e88917' } }} />} label="Override / Reset Total" />
                </RadioGroup>
              </Box>
            )}

            <TextField
              label={editingItem && updateMode === 'add' ? "Quantity to Add" : "Total Quantity Value"}
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={formQty === 0 ? "" : formQty}
              onChange={(e) => setFormQty(Number(e.target.value))}
              helperText={`Measurement Unit: Numbers (Nos)`}
              fullWidth
            />

            <TextField
              label="Auditor Name / Name of Person Updating"
              value={formAuditor}
              onChange={(e) => setFormAuditor(e.target.value)}
              placeholder="e.g., Kumar, Siva"
              required
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#6b7280', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#e88917', '&:hover': { bgcolor: '#d47b13' }, textTransform: 'none' }}>
            Apply and Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}