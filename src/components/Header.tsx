import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Search } from 'lucide-react';
import { setSearchTerm } from '../store/slices/productsSlice';
import cartImage from '../assets/cart.svg'
import userImage from '../assets/user.svg'

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setSearchTerm(localSearchTerm));
        navigate('/');
    };

    return (
        <header className="bg-blue-600 text-white">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-col sm:flex-row gap-4">
                <Link to="/" className="text-2xl font-bold">Eteration</Link>
                <form onChange={handleSearch} className="flex-grow max-w-md mx-4 sm:w-auto w-full">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            value={localSearchTerm}
                            onChange={(e) => setLocalSearchTerm(e.target.value)}
                            className="w-full py-2 px-4 pr-10 rounded-full text-black"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Search size={20} />
                        </div>
                    </div>
                </form>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-3">
                        <img src={cartImage} width={20} height={18} />
                        <span className="font-medium text-md">{totalPrice.toFixed(2)}₺</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src={userImage} width={14} height={16} />
                        <span className="font-medium text-md">Hakan</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;