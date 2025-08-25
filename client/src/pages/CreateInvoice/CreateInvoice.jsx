import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './CreateInvoice.css';

const CreateInvoice = () => {
  const [formData, setFormData] = useState({
    billFrom: '',
    placeOfSupplyState: '',
    company: 'UFL',
    bookingDate: '',
    client: '',
  });
  const { user } = useContext(AuthContext);

  const {
    billFrom,
    placeOfSupplyState,
    company,
    bookingDate,
    client,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post('/api/invoices', formData, config);
      // Redirect or show success message
    } catch (error) {
      console.error('Failed to create invoice', error);
    }
  };

  return (
    <div className="create-invoice-container">
      <h1>Create Invoice</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Bill From</label>
          <input
            type="text"
            name="billFrom"
            value={billFrom}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Place of Supply (State)</label>
          <input
            type="text"
            name="placeOfSupplyState"
            value={placeOfSupplyState}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Company</label>
          <select name="company" value={company} onChange={onChange}>
            <option value="UFL">UFL</option>
            <option value="UFC">UFC</option>
          </select>
        </div>
        <div className="form-group">
          <label>Booking Date</label>
          <input
            type="date"
            name="bookingDate"
            value={bookingDate}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Client</label>
          <input
            type="text"
            name="client"
            value={client}
            onChange={onChange}
          />
        </div>
        <button type="submit">Create Invoice</button>
      </form>
    </div>
  );
};

export default CreateInvoice;