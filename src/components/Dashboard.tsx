import { Box, Typography, Grid, Card, CardContent, Stack } from '@mui/material';

export default function Dashboard() {
  const cards = [
    { title: 'Today Income', value: '₹45,230', color: '#111827' },
    { title: 'Total Worker', value: '18', color: '#111827' },
    { title: 'Monthly Expense', value: '₹12,400', color: '#ef4444' }
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 0 } }}>
      {/* Title Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#e88917', 
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', sm: '1.5rem' } // Scales font size for small viewports
          }}
        >
          Report Dashboard / அறிக்கை டாஷ்போர்டு
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Real-time metrics overview
        </Typography>
      </Box>

      {/* Grid Layout Matrix */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {cards.map((card, index) => (
          /* Fixed for MUI v6: Removed "item" and combined breakpoints under the "size" attribute */
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card 
              variant="outlined"
              sx={{ 
                borderRadius: 3, 
                borderColor: '#e5e7eb', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  borderColor: '#e88917'
                }
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Stack spacing={1}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: '#6b7280', 
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.75rem'
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: card.color,
                      fontSize: { xs: '1.75rem', sm: '2.125rem' } // Scaled typography for mobile
                    }}
                  >
                    {card.value}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}