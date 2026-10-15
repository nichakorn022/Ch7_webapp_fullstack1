import { useState } from 'react';

const FoodForm = ({ addItem }) => {
  const [inputs, setInputs] = useState({ name: '', price: '', isBestSeller: 'true' });

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newFood = {
      name: inputs.name,
      price: Number(inputs.price),
      isBestSeller: inputs.isBestSeller === 'true',
    };
    addItem(newFood);
    setInputs({ name: '', price: '', isBestSeller: 'true' });
  }

  return (
    <form onSubmit={handleSubmit}>
      New Food <br />
      name : <input type="text" name="name" value={inputs.name} onChange={handleChange} />
      <br />
      price : <input type="number" name="price" value={inputs.price} onChange={handleChange} />
      <br />
      Best Seller :
      <select name="isBestSeller" value={inputs.isBestSeller} onChange={handleChange}>
        <option value="true">BestSeller</option>
        <option value="false">Normal</option>
      </select>
      <br />
      <button>Add menu</button>
    </form>
  );
};

export default FoodForm;