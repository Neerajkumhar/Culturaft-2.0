const axios = require('axios');

async function testInvoice() {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzU1YTg4ODlkZmI4NWEwZDI4MWY4MCIsImVtYWlsIjoiYWRtaW5AY3VsdHVyYWZ0LmNvbSIsImlhdCI6MTc2NTE4MzI4MCwiZXhwIjoxNzY1MjY5NjgwfQ.KBfFMaPp3zTErXvt6__shsOpKrZdCpBHbf8EaswEouw';
    
    const response = await axios.get(
      'http://localhost:5000/api/orders/6936b4b188463e9a099aaa72/invoice',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Success! Invoice data:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch(error) {
    console.error('❌ Error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    if (error.message) console.error('Message:', error.message);
  }
}

testInvoice();
