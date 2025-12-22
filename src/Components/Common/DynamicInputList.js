import React, { useState } from 'react';

export default function DynamicInputList(props) {
  const { inputs, setInputs, placeholder, isIPRS } = props

  const handleInputChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index].id = index;
    newInputs[index].name = event.target.value;
    setInputs(newInputs);
  };

  const handleInputChangeIPRS = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index].id = index;
    newInputs[index].iprs = event.target.value;
    setInputs(newInputs);
  };



  const handleAddInput = () => {
    setInputs([...inputs, { id: '', name: '' }]);
  };

  const handleRemoveInput = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  return (
    <div className="dynamic-input-container d-flex row">

      {inputs.map((input, index) => (
        <div className="add-row input-group input-group-sm">
          <input
            type="text"
            value={input.name}
            onChange={(event) => handleInputChange(index, event)}
            placeholder={placeholder}
            className="form-control"
            style={{
              width: '90%',
              display: 'flex', // Ensure the container is a flex container
              flexDirection: 'row', // Align items in a row 
              alignItems: 'center', // Align items vertically centered
            }}
          />
          {isIPRS &&
          <input type="text"
            className="form-control"
            placeholder='IPRS NO'
            value={input.iprs}
            onChange={(e) => handleInputChangeIPRS(index, e)}
          />
          }
          <span className="add-minus input-group-btn">
            {index == 0 ?
              <button className="btn btn-primary add-label" type="button" onClick={handleAddInput} >+</button>
              :
              <button type="button" onClick={() => handleRemoveInput(index)} className="btn btn-primary add-label" >
                X
              </button>

            }
          </span>
        </div>
      ))}
    </div>
  );
}
