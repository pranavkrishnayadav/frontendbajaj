import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './InputForm.css'; // Import the CSS file

const options = [
  { value: 'alphabets', label: 'Alphabets' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'highestLowercaseAlphabet', label: 'Highest Lowercase Alphabet' }
];

const InputForm = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null); // Store the file object

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Get the selected file
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Parse the JSON input
      const parsedData = JSON.parse(jsonInput);

      // Prepare the FormData object to send the file
      const formData = new FormData();
      formData.append('data', JSON.stringify(parsedData)); // Send the parsed data as a string
      if (file) {
        formData.append('file', file); // Send the file
      }

      // Call the backend API with FormData
      const res = await axios.post('http://localhost:5000/bfhl', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Use multipart/form-data for file upload
        },
      });
      setResponseData(res.data); // Save the response data
    } catch (err) {
      setError('Invalid JSON input or file upload error. Please try again.');
    }
  };

  // Function to handle changes in the multi-select dropdown
  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  // Function to filter and render the response based on selected options
  const renderResponse = () => {
    if (!responseData) return null;

    const filteredResults = [];

    // Handle "Numbers" option
    if (selectedOptions.some(option => option.value === 'numbers')) {
      filteredResults.push(`Numbers: ${responseData.numbers.join(', ')}`);
    }

    // Handle "Alphabets" option
    if (selectedOptions.some(option => option.value === 'alphabets')) {
      filteredResults.push(`Alphabets: ${responseData.alphabets.join(', ')}`);
    }

    // Handle "Highest Lowercase Alphabet" option
    if (selectedOptions.some(option => option.value === 'highestLowercaseAlphabet')) {
      filteredResults.push(`Highest Lowercase Alphabet: ${responseData.highest_lowercase_alphabet}`);
    }

    return (
      <div className="filtered-response">
        <h3>Filtered Response</h3>
        <pre>{filteredResults.join('\n')}</pre>
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
          placeholder='{"data": ["A", "C", "1", "z"]}' // Example JSON structure
        />

        {/* File input field */}
        <label>Upload File</label>
        <input 
          type="file"
          onChange={handleFileChange}
          accept="image/*, .pdf, .doc, .docx" // Accept specific file types (optional)
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
