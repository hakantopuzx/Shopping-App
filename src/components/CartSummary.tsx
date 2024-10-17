import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

const CartSummary: React.FC = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const handleQuantityChange = (id: string, quantity: number, name: string) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ id, quantity }));
        } else {
            dispatch(removeFromCart(id));
            toast.error(`${name} removed from cart!`);
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-3">
                <h2 className="text-xl font-bold mb-4">Cart</h2>
                {cartItems.map((item) => (
                    <div key={item.id} className="flex 2xl:flex-row lg:flex-col justify-between lg:items-start 2xl:items-center mb-3 gap-2 border-b pb-2">
                        <div className="info flex flex-col">
                            <span className='text-md'>{item.name}</span>
                            <span className='text-blue-700 text-sm'>{item.price} ₺</span>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.name)}
                                className="bg-gray-200 px-2 py-1 rounded-l"
                            >
                                -
                            </button>
                            <span className="px-2 py-1 bg-blue-500 text-white">{item.quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.name)}
                                className="bg-gray-200 px-2 py-1 rounded-r"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 bg-white rounded-lg shadow-md p-3">
                <p className="font-bold">Total Price: ₺{totalPrice.toFixed(2)}</p>
                <button className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                    Checkout
                </button>
            </div>
        </>
    );
};

export default CartSummary;