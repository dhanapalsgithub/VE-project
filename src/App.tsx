import { useState } from 'react';
import { Box, Typography, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Stock from './components/Stock';
import Billing from './components/Billing';
import Staff from './components/Staff';
import IncomeExpense from './components/IncomeExpense';
import Hiring from './components/Hiring';
import Transport from './components/Transport';
// Modal-க்கு பதிலாக Page என மாற்றவும
import ClientDataPage from './components/ClientDataPage';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  

  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard': return <Dashboard />;
      case 'stock': return <Stock />;
      case 'billing': return <Billing />;
      case 'staff': return <Staff />;
      case 'income-expense': return <IncomeExpense />;
      case 'hiring': return <Hiring />;
      case 'transport': return <Transport />;
      // App.tsx-ல் renderPage பகுதியை இப்படி மாற்றவும்:
// App.tsx
case 'clients': return <ClientDataPage onSave={(data) => console.log(data)} />;
      default: return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#ffffff', minHeight: '100vh', flexDirection: isMobile ? 'column' : 'row' }}>
      <CssBaseline />
      
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, pt: isMobile ? 4 : 4, display: 'flex', flexDirection: 'column', minHeight: isMobile ? 'calc(100vh - 64px)' : '100vh', width: '100%', overflowX: 'hidden' }}>
        <Box sx={{ flexGrow: 1 }}>
          {renderPage()}
        </Box>

        <Typography variant="body2" sx={{ mt: 5, color: 'text.secondary', pt: 2, borderTop: '1px solid #e5e7eb', fontSize: { xs: '11px', sm: '13px' }, textAlign: { xs: 'center', sm: 'left' } }}>
          Vinayaga Enterprises © 2026 | Secured Application
        </Typography>
      </Box>
    </Box>
  );
}

export default App;