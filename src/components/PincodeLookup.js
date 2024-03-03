import React, { useState } from 'react';
import axios from 'axios';
import "../styles.css"

const PincodeLookup = () => {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPincodeData = async () => {
    if (pincode.length !== 6) {
      setError('Pincode must be 6 digits');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const responseData = response.data[0];
      if (responseData.Status === 'Success') {
        setData(responseData.PostOffice);
        setError('');
      } else {
        setError(responseData.Message);
      }
    } catch (error) {
      setError('Error fetching data');
    }
    setLoading(false);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredData = data.filter((postOffice) =>
    postOffice.Name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {data.length === 0 ? (
        <div className='pincode-form'>
          <h1>Enter Pincode</h1>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter Pincode"
          />
          <button onClick={fetchPincodeData}>Lookup</button>
          {loading && <div className="loader-container"><div class="loader"></div></div>}
          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <div className='pincode-list'>
          <h1>Pincode Data</h1>
          <h2>Pincode - {pincode}</h2>
          <h2>Message - {data.length} pincodes found</h2>
          <input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            placeholder="Filter by Post Office Name"
          />
          {filteredData.length === 0 && <div className='no-data'>No postal data found</div>}
          <ul>
            {filteredData.map((postOffice) => (
              <li key={postOffice.Name}>
                <strong>Name:</strong> {postOffice.Name} <br />
                <strong>Branch Type:</strong> {postOffice.BranchType}  <br />
                <strong>Delivery Status:</strong> {postOffice.DeliveryStatus} <br />
                <strong>District:</strong> {postOffice.District} <br />
                <strong>State:</strong> {postOffice.State}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PincodeLookup;
