import { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Typography,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  BarChart as DashboardIcon,
  Inventory as StockIcon,
  ReceiptLong as BillingIcon,
  People as StaffIcon,
  AccountBalanceWallet as WalletIcon,
  PersonAdd as HiringIcon,
  LocalShipping as TransportIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (id: string) => void;
}

export default function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  
  // மோடுல் ஸ்டேட் தேவையில்லை, எனவே நீக்கிவிடலாம்
  // const [isModalOpen, setIsModalOpen] = useState(false); 

  const desktopDrawerWidth = isOpen ? 260 : 70;
  const mobileDrawerWidth = 260;

  const menuItems = [
    { id: 'dashboard', title: 'Report Dashboard', icon: <DashboardIcon /> },
    { id: 'stock', title: 'Stock', icon: <StockIcon /> },
    { id: 'billing', title: 'Billing', icon: <BillingIcon /> },
    { id: 'staff', title: 'Staff', icon: <StaffIcon /> },
    { id: 'income-expense', title: 'Income Expense', icon: <WalletIcon /> },
    { id: 'hiring', title: 'Hiring', icon: <HiringIcon /> },
    { id: 'transport', title: 'Running Exp Transport', icon: <TransportIcon /> },
    { id: 'clients', title: 'Client Data', icon: <PersonAddIcon /> },
  ];

  
const handleMobileToggle = () => setMobileOpen(!mobileOpen);

  const handleMenuSelect = (id: string) => {
    // வெறுமனே மெனுவை மட்டும் மாற்றினால் போதும்
    setActiveMenu(id); 
    
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const renderSidebarContent = (isMobileView: boolean) => (
    <Box sx={{ height: '100%', bgcolor: '#ffffff' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', height: 64 }}>
        <Typography variant="h6" sx={{ color: '#e88917', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          {isMobileView || isOpen ? 'Vinayaga Enterprise' : 'VE'}
        </Typography>
      </Box>

      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = activeMenu === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleMenuSelect(item.id)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 1.5,
                  bgcolor: isActive ? '#fff5ed' : 'transparent',
                  color: isActive ? '#e88917' : '#080c13',
                  '&:hover': { bgcolor: isActive ? '#fff5ed' : '#f9fafb' }
                }}
              >
                <ListItemIcon sx={{ color: '#e88917', minWidth: 40 }}>{item.icon}</ListItemIcon>
                {(isMobileView || isOpen) && <ListItemText primary={item.title} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <AppBar position="fixed" elevation={0} sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #e5e7eb', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
              <IconButton onClick={handleMobileToggle} sx={{ color: '#e88917' }}><MenuIcon /></IconButton>
              <Typography variant="subtitle1" sx={{ color: '#e88917', fontWeight: 'bold' }}>Vinayaga Enterprise</Typography>
              <Box sx={{ width: 60 }} />
            </Toolbar>
          </AppBar>
          <Drawer variant="temporary" open={mobileOpen} onClose={handleMobileToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: mobileDrawerWidth } }}>
            {renderSidebarContent(true)}
          </Drawer>
          <Box sx={{ height: 64 }} />
        </>
      ) : (
        <Box sx={{ width: desktopDrawerWidth, transition: 'width 0.3s', flexShrink: 0, position: 'relative' }}>
          <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: desktopDrawerWidth, transition: 'width 0.3s', bgcolor: '#ffffff', borderRight: '1px solid #e5e7eb', overflowX: 'hidden' } }}>
            <IconButton onClick={() => setIsOpen(!isOpen)} sx={{ position: 'absolute', top: 20, right: -12, bgcolor: '#e88917', color: 'white', width: 24, height: 24, zIndex: 1201, boxShadow: 2, '&:hover': { bgcolor: '#d47b13' } }}>
              {isOpen ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
            </IconButton>
            {renderSidebarContent(false)}
          </Drawer>
        </Box>
      )}

      
    </>
  );
}