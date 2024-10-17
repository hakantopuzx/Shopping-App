import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../store/slices/productsSlice';
import cartReducer from '../store/slices/cartSlice';
import ProductList from '../pages/ProductList';

const mockStore = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
    },
    preloadedState: {
        products: {
            items: [
                { id: '1', name: 'Test Product', price: 100, image: 'test.jpg', description: 'Test description', createdAt: new Date() },
            ],
            status: 'succeeded',
            error: null,
            searchTerm: '',
        },
    },
});



test('renders product list', () => {
    render(
        <Provider store={mockStore}>
            <Router>
                <ProductList />
            </Router>
        </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₺100.00')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
});