import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './InputForm.css'; // Import the CSS file

const options = [
  { value: 'alphabets', label: 'Alphabets' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'highestAlphabet', label: 'Highest Alphabet' }
];

const InputForm = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const parsedData = JSON.parse(jsonInput);
      const res = await axios.post('http://localhost:5000/bfhl', parsedData);
      setResponseData(res.data);
    } catch (err) {
      setError('Invalid JSON input. Please try again.');
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    let filteredResult = '';

    if (selectedOptions.some(option => option.value === 'numbers')) {
      filteredResult = `Numbers: ${responseData.numbers.join(', ')}`;
    }
    if (selectedOptions.some(option => option.value === 'alphabets')) {
      if (filteredResult) filteredResult += '\n';
      filteredResult += `Alphabets: ${responseData.alphabets.join(', ')}`;
    }
    if (selectedOptions.some(option => option.value === 'highestAlphabet')) {
      if (filteredResult) filteredResult += '\n';
      filteredResult += `Highest Alphabet: ${responseData.highest_alphabet.join(', ')}`;
    }

    return (
      <div className="filtered-response">
        <h3>Filtered Response</h3>
        <pre>{filteredResult}</pre>
      </div>
    );
  };

  return (
    <div className="input-form-container">
      <form onSubmit={handleSubmit}>
        <label>API Input</label>
        <textarea
          className="json-input"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows="4"
          placeholder='{"data": ["M", "1", "334", "4", "B"]}'
        />
        <button className="submit-button" type="submit">Submit</button>
        {error && <p className="error-text">{error}</p>}
      </form>

      {responseData && (
        <div>
          <label>Multi Filter</label>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            placeholder="Select options"
          />
        </div>
      )}

      {renderResponse()}
    </div>
  );
};

export default InputForm;
