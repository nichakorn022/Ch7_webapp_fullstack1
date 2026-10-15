import { useState } from 'react';
import FoodList from './FoodList';
import FoodForm from './FoodForm';

const FoodContainer = () => {
  const [food, setFood] = useState([
    { name: 'cake', price: 35, isBestSeller: true },
    { name: 'bread', price: 25, isBestSeller: false },
    { name: 'milk', price: 15, isBestSeller: true },
    { name: 'donut', price: 45, isBestSeller: false },
    { name: 'cookie', price: 55, isBestSeller: true },
  ]);

  const deleteItem = (index) => {
    setFood(food.filter((_, i) => i !== index));
  };

  const addItem = (item) => {
    setFood([...food, item]);
  };

  return (
    <div>
      <h3>Our Menu</h3>
      <FoodList food={food} deleteItem={deleteItem} />
      <FoodForm addItem={addItem} />
    </div>
  );
};

export default FoodContainer;