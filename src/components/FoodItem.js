const FoodItem = ({ index, name, price, isBestSeller, deleteItem }) => {
  return (
    <li className="food-item">
      <span className="food-info">
        <span className="food-name">{name}</span>
        <span className="food-price">{price} baht</span>
      </span>
      {isBestSeller && <span className="best">🎖️ Best seller</span>}
      <button className="btn btn-del" onClick={() => deleteItem(index)}>
        Del
      </button>
    </li>
  );
};

export default FoodItem;