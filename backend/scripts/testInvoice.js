const axios = require('axios');

async function testInvoice() {
  try {
    // Test token - this should be from an actual logged-in user
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzU1YTg4ODlkZmI4NWEwZDI4MWY4MCIsImVtYWlsIjoiYWRtaW5AY3VsdHVyYWZ0LmNvbSIsImlhdCI6MTc2NTE4MzI4MCwiZXhwIjoxNzY1MjY5NjgwfQ.KBfFMaPp3zTErXvt6__shsOpKrZdCpBHbf8EaswEouw';
    
    // Try different order IDs from the error logs
    const orderIds = [
      '69368cdd93a4507ff4908d18',
      '6936b4b188463e9a099aaa72',
      '693689718b595070f9b9053d'
    ];
    
    for (const orderId of orderIds) {
      console.log(`\nTesting order: ${orderId}`);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/${orderId}/invoice`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Success:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2).substring(0, 500));
      } catch (error) {
        console.log('❌ Error:', error.response?.status, error.response?.data);
      }
    }
    
  } catch(e) {
    console.error('Test error:', e.message);
  }
}

testInvoice();
