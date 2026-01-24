import { useState, FormEvent } from 'react';
import { OrderItem } from '../types/order.types';
import './CreateOrder.css';

interface CreateOrderProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CreateOrder({ onSubmit, onCancel }: CreateOrderProps) {
  const [items, setItems] = useState<OrderItem[]>([
    { name: '', quantity: 1, price: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      items,
      totalAmount: calculateTotal()
    });
  };

  return (
    <div className="create-order">
      <div className="create-card">
        <h2>Create New Order</h2>

        <form onSubmit={handleSubmit}>
          <div className="items-section">
            <div className="section-header">
              <h3>Order Items</h3>
              <button type="button" onClick={addItem} className="btn-add">
                Add Item
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="item-row">
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                  required
                />
                <span className="item-subtotal">
                  ${(item.quantity * item.price).toFixed(2)}
                </span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="total-section">
            <span>Total Amount:</span>
            <span className="total-amount">${calculateTotal().toFixed(2)}</span>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
