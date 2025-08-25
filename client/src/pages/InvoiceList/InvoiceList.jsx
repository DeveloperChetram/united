import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './InvoiceList.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('/api/invoices', config);
        setInvoices(data);
      } catch (error) {
        console.error('Failed to fetch invoices', error);
      }
    };
    fetchInvoices();
  }, [user.token]);

  return (
    <div className="invoice-list-container">
      <h1>Invoices</h1>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Client</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice.invoiceNumber}</td>
              <td>{invoice.client}</td>
              <td>{new Date(invoice.bookingDate).toLocaleDateString()}</td>
              <td>{invoice.totalAmount}</td>
              <td>{invoice.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;