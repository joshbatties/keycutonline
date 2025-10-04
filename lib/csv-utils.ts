import { formatCurrency } from './types';

// Helper function to flatten nested objects for CSV export
function flattenObject(obj: any, prefix = ''): any {
  const flattened: any = {};

  Object.keys(obj).forEach(key => {
    const newKey = prefix ? `${prefix}_${key}` : key;

    if (obj[key] && typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], newKey));
    } else if (Array.isArray(obj[key])) {
      flattened[newKey] = JSON.stringify(obj[key]);
    } else {
      flattened[newKey] = obj[key];
    }
  });

  return flattened;
}

// Convert orders data to CSV format
export function convertOrdersToCSV(orders: any[]): string {
  if (orders.length === 0) return '';

  const flattenedOrders = orders.map(order => {
    const flattened = flattenObject(order);

    // Format currency fields
    if (flattened.subtotal_cents) flattened.subtotal = formatCurrency(flattened.subtotal_cents);
    if (flattened.gst_cents) flattened.gst = formatCurrency(flattened.gst_cents);
    if (flattened.delivery_cents) flattened.delivery = formatCurrency(flattened.delivery_cents);
    if (flattened.total_cents) flattened.total = formatCurrency(flattened.total_cents);

    // Format dates
    if (flattened.created_at) flattened.created_at = new Date(flattened.created_at).toLocaleString('en-AU');
    if (flattened.updated_at) flattened.updated_at = new Date(flattened.updated_at).toLocaleString('en-AU');

    // Clean up the flattened object
    delete flattened.subtotal_cents;
    delete flattened.gst_cents;
    delete flattened.delivery_cents;
    delete flattened.total_cents;

    return flattened;
  });

  const headers = Object.keys(flattenedOrders[0]).sort();
  const csvRows = [
    headers.join(','),
    ...flattenedOrders.map(order =>
      headers.map(header => {
        const value = order[header] || '';
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        return typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}

// Convert bookings data to CSV format
export function convertBookingsToCSV(bookings: any[]): string {
  if (bookings.length === 0) return '';

  const flattenedBookings = bookings.map(booking => {
    const flattened = flattenObject(booking);

    // Format currency fields
    if (flattened.callout_fee_cents) flattened.callout_fee = formatCurrency(flattened.callout_fee_cents);
    if (flattened.estimated_total_cents) flattened.estimated_total = formatCurrency(flattened.estimated_total_cents);
    if (flattened.total_cents) flattened.total = formatCurrency(flattened.total_cents);
    if (flattened.gst_cents) flattened.gst = formatCurrency(flattened.gst_cents);

    // Format dates
    if (flattened.preferred_date) flattened.preferred_date = new Date(flattened.preferred_date).toLocaleDateString('en-AU');
    if (flattened.created_at) flattened.created_at = new Date(flattened.created_at).toLocaleString('en-AU');
    if (flattened.updated_at) flattened.updated_at = new Date(flattened.updated_at).toLocaleString('en-AU');

    // Clean up the flattened object
    delete flattened.callout_fee_cents;
    delete flattened.estimated_total_cents;
    delete flattened.total_cents;
    delete flattened.gst_cents;

    return flattened;
  });

  const headers = Object.keys(flattenedBookings[0]).sort();
  const csvRows = [
    headers.join(','),
    ...flattenedBookings.map(booking =>
      headers.map(header => {
        const value = booking[header] || '';
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        return typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}

// Download CSV file
export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
