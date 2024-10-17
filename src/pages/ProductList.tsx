import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchProducts } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CartSummary from '../components/CartSummary';
import { ColorRing } from 'react-loader-spinner';
import { toast } from 'react-toastify';

const ProductList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: products, status, error, searchTerm } = useSelector((state: RootState) => state.products);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<{ brands: string[], models: string[] }>({ brands: [], models: [] });
    const [sortBy, setSortBy] = useState('');
    const [brandSearchTerm, setBrandSearchTerm] = useState('');
    const [modelSearchTerm, setModelSearchTerm] = useState('');

    const productsPerPage = 12;

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filters.brands.length === 0 || filters.brands.some(brand => product.name.toLowerCase().includes(brand.toLowerCase()))) &&
            (filters.models.length === 0 || filters.models.some(model => product.name.toLowerCase().includes(model.toLowerCase())))
        )
        .sort((a, b) => {
            if (sortBy === 'priceAsc') return Number(a.price) - Number(b.price);
            if (sortBy === 'priceDesc') return Number(b.price) - Number(a.price);
            if (sortBy === 'Old to new') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === 'New to old') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return 0;
        });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const uniqueBrands = Array.from(new Set(products.map(product => product.name.split(' ')[0])));
    const uniqueModels = Array.from(new Set(products.map(product => product.name.split(' ')[1])));

    const handleBrandChange = (brand: string) => {
        setFilters(prev => ({
            ...prev,
            brands: prev.brands.includes(brand)
                ? prev.brands.filter(b => b !== brand)
                : [...prev.brands, brand]
        }));
    };

    const handleModelChange = (model: string) => {
        setFilters(prev => ({
            ...prev,
            models: prev.models.includes(model)
                ? prev.models.filter(m => m !== model)
                : [...prev.models, model]
        }));
    };

    if (status === 'loading') {
        return <div className="loader w-full h-[100vh] flex items-center justify-center">
            <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
            />;
        </div>
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/6 w-full flex lg:flex-col flex-row gap-3 lg:gap-5">
                <div className="w-full">
                    <h3 className="font-medium text-slate-700 mb-2">Sort By</h3>
                    <div className='filter-list bg-white lg:p-4 p-2 lg:h-auto h-[170px] shadow-md overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300'>
                        <label className="block mb-2 cursor-pointer xl:text-base text-sm">
                            <input
                                type="radio"
                                name="sortBy"
                                value="priceAsc"
                                checked={sortBy === 'priceAsc'}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="mr-2 cursor-pointer"
                            />
                            Price: Low to High
                        </label>
                        <label className="block mb-2 cursor-pointer xl:text-base text-sm">
                            <input
                                type="radio"
                                name="sortBy"
                                value="priceDesc"
                                checked={sortBy === 'priceDesc'}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="mr-2 cursor-pointer"
                            />
                            Price: High to Low
                        </label>
                        <label className="block mb-2 cursor-pointer xl:text-base text-sm">
                            <input
                                type="radio"
                                name="sortBy"
                                value="Old to new"
                                checked={sortBy === 'Old to new'}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="mr-2 cursor-pointer"
                            />
                            Old to new
                        </label>
                        <label className="block mb-2 cursor-pointer xl:text-base text-sm">
                            <input
                                type="radio"
                                name="sortBy"
                                value="New to old"
                                checked={sortBy === 'New to old'}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="mr-2 cursor-pointer"
                            />
                            New to old
                        </label>
                    </div>
                </div>
                <div className="w-full">
                    <h3 className="font-medium text-slate-700 mb-2">Brand</h3>
                    <div className="filter-list lg:h-[205px] h-[170px] overflow-y-auto shadow-md bg-white lg:p-4 p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={brandSearchTerm}
                            onChange={(e) => setBrandSearchTerm(e.target.value)}
                            className="w-full p-2 mb-2 border rounded shadow-sm"
                        />
                        {uniqueBrands
                            .filter(brand => brand.toLowerCase().includes(brandSearchTerm.toLowerCase()))
                            .map(brand => (
                                <label key={brand} className="block mb-2 xl:text-base text-sm">
                                    <input
                                        type="checkbox"
                                        checked={filters.brands.includes(brand)}
                                        onChange={() => handleBrandChange(brand)}
                                        className="mr-2"
                                    />
                                    {brand}
                                </label>
                            ))}
                    </div>
                </div>
                <div className="w-full">
                    <h3 className="font-medium text-slate-700 mb-2">Model</h3>
                    <div className="filter-list lg:h-[205px] h-[170px] overflow-y-auto shadow-md bg-white lg:p-4 p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                        <input
                            type="text"
                            placeholder="Search models..."
                            value={modelSearchTerm}
                            onChange={(e) => setModelSearchTerm(e.target.value)}
                            className="w-full p-2 mb-2 border rounded shadow-sm"
                        />
                        {uniqueModels
                            .filter(model => model.toLowerCase().includes(modelSearchTerm.toLowerCase()))
                            .map(model => (
                                <label key={model} className="block mb-2 xl:text-base text-sm">
                                    <input
                                        type="checkbox"
                                        checked={filters.models.includes(model)}
                                        onChange={() => handleModelChange(model)}
                                        className="mr-2"
                                    />
                                    {model}
                                </label>
                            ))}
                    </div>
                </div>
            </div>
            <div className="lg:w-4/6 w-full px-0 lg:px-4 lg:py-0 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {currentProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex justify-between flex-col">
                            <Link to={`/product/${product.id}`} className='flex p-2'>
                                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                            </Link>
                            <div className="p-2">
                                <p className="text-blue-600 text-md font-medium mb-1">₺{Number(product.price).toFixed(2)}</p>
                                <h3 className="text-md font-medium mb-3">{product.name}</h3>
                                <button
                                    onClick={() => {
                                        dispatch(addToCart(product));
                                        toast.success(`${product.name} added to cart!`);
                                    }}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {currentProducts.length >= 1 ?
                    <div className="mt-8 flex justify-center flex-wrap gap-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border rounded disabled:opacity-50"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                            className="px-3 py-2 border rounded disabled:opacity-50"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    :
                    <div className='no-products flex justify-center items-center h-full'>
                        <span className='font-medium text-2xl'>No product found</span>
                    </div>
                }
            </div>
            <div className="lg:w-1/6 w-full">
                <CartSummary />
            </div>
        </div>
    );
};

export default ProductList;