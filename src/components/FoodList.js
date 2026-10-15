import FoodItem from './FoodItem';

const FoodList = ({ food, deleteItem }) => {
  return (
    <div>
      <ul>
        {food.map((item, index) => (
          <FoodItem
            key={index}
            index={index}
            name={item.name}
            price={item.price}
            isBestSeller={item.isBestSeller}
            deleteItem={deleteItem}
          />
        ))}
      </ul>
    </div>
  );
};

export default FoodList;