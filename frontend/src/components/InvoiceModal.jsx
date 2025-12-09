import React, { useState, useEffect } from 'react'
import { X, Download, Printer } from 'lucide-react'
import API from '../lib/api'

export default function InvoiceModal({ orderId, isOpen, onClose }) {
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && orderId) {
      fetchInvoice()
    }
  }, [isOpen, orderId])

  const fetchInvoice = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await API.get(`/orders/${orderId}/invoice`)
      setInvoice(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load invoice')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = () => {
    if (!invoice) return

    // Create HTML content for the invoice
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          
          .invoice-container {
            background-color: white;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 2px solid #1c1917;
            padding-bottom: 20px;
          }
          
          .company-info {
            flex: 1;
          }
          
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #1c1917;
            margin-bottom: 8px;
            font-family: Georgia, serif;
          }
          
          .invoice-details {
            text-align: right;
          }
          
          .invoice-number {
            font-size: 18px;
            font-weight: bold;
            color: #1c1917;
            margin-bottom: 4px;
          }
          
          .invoice-date {
            color: #666;
            font-size: 14px;
            margin-bottom: 4px;
          }
          
          .invoice-status {
            display: inline-block;
            padding: 4px 12px;
            background-color: #f5f5f5;
            border-radius: 4px;
            font-size: 12px;
            text-transform: uppercase;
            color: #666;
            font-weight: bold;
          }
          
          .address-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }
          
          .address-block {
            font-size: 14px;
          }
          
          .address-label {
            color: #999;
            text-transform: uppercase;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
          }
          
          .address-content {
            color: #1c1917;
            line-height: 1.6;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          
          .items-table thead {
            background-color: #f5f5f5;
            border-bottom: 2px solid #e5e7eb;
          }
          
          .items-table th {
            padding: 12px;
            text-align: left;
            font-weight: bold;
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
            color: #1c1917;
          }
          
          .items-table tbody tr:last-child td {
            border-bottom: 2px solid #1c1917;
          }
          
          .text-right {
            text-align: right;
          }
          
          .text-left {
            text-align: left;
          }
          
          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          
          .totals-box {
            width: 300px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
            color: #666;
          }
          
          .total-row.total {
            font-size: 18px;
            font-weight: bold;
            color: #1c1917;
            border-top: 2px solid #1c1917;
            padding-top: 12px;
            margin-top: 12px;
          }
          
          .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
          
          @media print {
            body {
              background-color: white;
              padding: 0;
            }
            .invoice-container {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="company-info">
              <div class="company-name">Culturaft</div>
              <div style="color: #999; font-size: 14px;">Artisan Marketplace</div>
            </div>
            <div class="invoice-details">
              <div class="invoice-number">${invoice.invoiceNumber}</div>
              <div class="invoice-date">Invoice Date: ${invoice.invoiceDate}</div>
              <div class="invoice-date">Due Date: ${invoice.dueDate}</div>
              <div style="margin-top: 8px;">
                <span class="invoice-status">${invoice.status}</span>
              </div>
            </div>
          </div>
          
          <div class="address-section">
            <div class="address-block">
              <div class="address-label">Bill To</div>
              <div class="address-content">
                <strong>${invoice.customerName}</strong><br>
                ${invoice.shippingAddress.address}<br>
                ${invoice.shippingAddress.city}, ${invoice.shippingAddress.postalCode}<br>
                <br>
                <strong>Email:</strong> ${invoice.customerEmail}
              </div>
            </div>
            
            <div class="address-block">
              <div class="address-label">Shipping Address</div>
              <div class="address-content">
                ${invoice.shippingAddress.fullName}<br>
                ${invoice.shippingAddress.address}<br>
                ${invoice.shippingAddress.city}, ${invoice.shippingAddress.postalCode}
              </div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th class="text-left">Product</th>
                <th class="text-left">Category</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.productCategory}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">₹${item.price.toFixed(2)}</td>
                  <td class="text-right">₹${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals-section">
            <div class="totals-box">
              <div class="total-row">
                <span>Subtotal</span>
                <span>₹${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Shipping</span>
                <span>${invoice.shippingCost === 0 ? 'Free' : '₹' + invoice.shippingCost.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>SGST</span>
                <span>₹${(invoice.sgstTotal || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>CGST</span>
                <span>₹${(invoice.cgstTotal || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Total Tax</span>
                <span>₹${(invoice.totalTax || 0).toFixed(2)}</span>
              </div>
              <div class="total-row total">
                <span>Total</span>
                <span>₹${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Payment Method: ${invoice.paymentMethod}</p>
            <p style="margin-top: 12px;">Thank you for your order! For any inquiries, please contact us at support@culturaft.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Create a blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${invoice.invoiceNumber}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const printInvoice = () => {
    const printWindow = window.open('', '', 'height=600,width=800')
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 40px;
          }
          
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 2px solid #1c1917;
            padding-bottom: 20px;
          }
          
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #1c1917;
            font-family: Georgia, serif;
          }
          
          .invoice-number {
            font-size: 18px;
            font-weight: bold;
            color: #1c1917;
          }
          
          .address-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
            font-size: 14px;
          }
          
          .address-label {
            color: #999;
            text-transform: uppercase;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
            font-size: 14px;
          }
          
          .items-table th {
            padding: 12px;
            text-align: left;
            font-weight: bold;
            background-color: #f5f5f5;
            border-bottom: 1px solid #ddd;
          }
          
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }
          
          .text-right {
            text-align: right;
          }
          
          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          
          .totals-box {
            width: 300px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }
          
          .total-row.total {
            font-size: 18px;
            font-weight: bold;
            border-top: 2px solid #1c1917;
            padding-top: 12px;
            margin-top: 12px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div>
            <div class="company-name">Culturaft</div>
            <div style="color: #999;">Artisan Marketplace</div>
          </div>
          <div>
            <div class="invoice-number">${invoice.invoiceNumber}</div>
            <div style="font-size: 14px; color: #666;">Invoice Date: ${invoice.invoiceDate}</div>
          </div>
        </div>
        
        <div class="address-section">
          <div>
            <div class="address-label">Bill To</div>
            <div><strong>${invoice.customerName}</strong></div>
            <div>${invoice.shippingAddress.address}</div>
            <div>${invoice.shippingAddress.city}, ${invoice.shippingAddress.postalCode}</div>
          </div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.productCategory}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">₹${item.price.toFixed(2)}</td>
                <td class="text-right">₹${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals-section">
          <div class="totals-box">
            <div class="total-row">
              <span>Subtotal</span>
              <span>₹${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Shipping</span>
              <span>${invoice.shippingCost === 0 ? 'Free' : '₹' + invoice.shippingCost.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>SGST</span>
              <span>₹${(invoice.sgstTotal || 0).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>CGST</span>
              <span>₹${(invoice.cgstTotal || 0).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Total Tax</span>
              <span>₹${(invoice.totalTax || 0).toFixed(2)}</span>
            </div>
            <div class="total-row total">
              <span>Total</span>
              <span>₹${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <script>
          window.print();
        </script>
      </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        
        {/* Modal Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-stone-200 bg-white">
          <h2 className="text-2xl font-serif font-bold text-stone-900">Invoice</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-12 text-stone-500">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full mb-4"></div>
              <p>Loading invoice...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Error Loading Invoice</p>
              <p className="text-sm">{error}</p>
              {error.includes('invoice details') && (
                <p className="text-sm mt-2 text-red-600">
                  💡 Tip: Older orders may not have invoice data. Try placing a new order to generate an invoice.
                </p>
              )}
            </div>
          )}

          {invoice && !loading && (
            <div className="space-y-6">
              {/* Invoice Preview */}
              <div className="bg-stone-50 p-8 rounded-lg border border-stone-200">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-stone-900">
                    <div>
                      <div className="text-2xl font-serif font-bold text-stone-900">Culturaft</div>
                      <div className="text-stone-500 text-sm">Artisan Marketplace</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-stone-900">{invoice.invoiceNumber}</div>
                      <div className="text-xs text-stone-500">{invoice.invoiceDate}</div>
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-stone-100 text-stone-700 text-xs uppercase font-bold rounded">
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
                    <div>
                      <div className="text-xs uppercase text-stone-500 font-bold mb-2">Bill To</div>
                      <div className="text-stone-900">
                        <strong>{invoice.customerName}</strong><br />
                        {invoice.shippingAddress.address}<br />
                        {invoice.shippingAddress.city}, {invoice.shippingAddress.postalCode}<br />
                        <br />
                        <strong className="text-xs text-stone-500">Email:</strong> {invoice.customerEmail}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-stone-500 font-bold mb-2">Shipping Address</div>
                      <div className="text-stone-900">
                        {invoice.shippingAddress.fullName}<br />
                        {invoice.shippingAddress.address}<br />
                        {invoice.shippingAddress.city}, {invoice.shippingAddress.postalCode}
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mb-8">
                    <table className="w-full text-sm">
                      <thead className="bg-stone-100 border-b-2 border-stone-900">
                        <tr>
                          <th className="text-left p-2 font-bold text-stone-900">Product</th>
                          <th className="text-left p-2 font-bold text-stone-900">Category</th>
                          <th className="text-right p-2 font-bold text-stone-900">Qty</th>
                          <th className="text-right p-2 font-bold text-stone-900">Price</th>
                          <th className="text-right p-2 font-bold text-stone-900">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-stone-200">
                            <td className="p-2 text-stone-900">{item.productName}</td>
                            <td className="p-2 text-stone-900">{item.productCategory}</td>
                            <td className="text-right p-2 text-stone-900">{item.quantity}</td>
                            <td className="text-right p-2 text-stone-900">₹{item.price.toFixed(2)}</td>
                            <td className="text-right p-2 text-stone-900">₹{item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                    <div className="w-64">
                      <div className="flex justify-between py-2 text-sm text-stone-600">
                        <span>Subtotal</span>
                        <span>₹{invoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm text-stone-600">
                        <span>Shipping</span>
                        <span>{invoice.shippingCost === 0 ? 'Free' : `₹${invoice.shippingCost.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm text-stone-600">
                        <span>SGST</span>
                        <span>₹{(invoice.sgstTotal || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm text-stone-600">
                        <span>CGST</span>
                        <span>₹{(invoice.cgstTotal || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm text-stone-600">
                        <span>Total Tax</span>
                        <span>₹{(invoice.totalTax || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-3 text-lg font-bold text-stone-900 border-t-2 border-stone-900 mt-2">
                        <span>Total</span>
                        <span>₹{invoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center text-xs text-stone-500 border-t pt-4">
                    <p>Payment Method: {invoice.paymentMethod}</p>
                    <p className="mt-2">Thank you for your order!</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={downloadInvoice}
                  className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors font-medium"
                >
                  <Download size={18} />
                  Download Invoice
                </button>
                <button
                  onClick={printInvoice}
                  className="flex items-center gap-2 px-6 py-2 border border-stone-300 text-stone-900 rounded hover:bg-stone-50 transition-colors font-medium"
                >
                  <Printer size={18} />
                  Print Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
