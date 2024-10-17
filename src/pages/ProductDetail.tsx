import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import CartSummary from '../components/CartSummary';
import { fetchProducts } from '../store/slices/productsSlice';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch: AppDispatch = useDispatch();
    const product = useSelector((state: RootState) =>
        state.products.items.find(p => p.id === id)
    );

    useEffect(() => {
        if (product === undefined) {
            dispatch(fetchProducts());
        }
    }, [dispatch, product]);

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row gap-4">
            <div className="detail w-full lg:w-5/6 flex flex-col md:flex-row rounded-lg bg-white shadow-md p-4">
                <div className="md:w-1/2 p-4">
                    <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                </div>
                <div className="md:w-1/2 p-4">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl font-semibold text-blue-600 mb-4">₺{Number(product.price).toFixed(2)}</p>
                    <p className="text-gray-700 mb-6">{product.description}</p>
                    <button
                        onClick={() => {
                            dispatch(addToCart(product));
                            toast.success(`${product.name} added to cart!`);
                        }}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            <div className="w-full lg:w-1/6">
                <CartSummary />
            </div>
        </div>
    );
};

export default ProductDetail;