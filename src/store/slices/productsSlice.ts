import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    createdAt: Date;
}

interface ProductsState {
    items: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    searchTerm: string;
}

const initialState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
    searchTerm: '',
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await axios.get('https://5fc9346b2af77700165ae514.mockapi.io/products');
    return response.data;
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            });
    },
});

export const { setSearchTerm } = productsSlice.actions;
export default productsSlice.reducer;