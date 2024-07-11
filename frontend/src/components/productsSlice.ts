import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/*
 используется для управления состоянием товаров в Redux.
 Включает в себя определение состояния,
 действия для работы с товарами и reducers для обработки этих действий.
 */

//Структура товара
interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    status: 'active' | 'archived';
}

//Состояние товаров
interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

//Начальное состояние товаров
const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null,
};

//Асинхронные действия

//Загрузка списка товаров с сервера.
// createAsyncThunk - создает асинхронное действие,
// которое отправляет запрос на сервер и возвращает данные товаров
export const fetchProducts = createAsyncThunk<Product[]>('products/fetchProducts', async () => {
    const response = await axios.get<Product[]>('http://localhost:5000/api/products');
    return response.data;
});

//Удаление товаров по ID
export const deleteProduct = createAsyncThunk<number, number>('products/deleteProduct', async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    return id;
});

//Обновление товара
export const updateProduct = createAsyncThunk<Product, Product>('products/updateProduct', async (product) => {
    const response = await axios.put(`http://localhost:5000/api/products/${product.id}`, product);
    return response.data;
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        updateProductLocal: (state, action: PayloadAction<Product>) => {
            const index = state.products.findIndex(product => product.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            })
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
                state.products = state.products.filter(product => product.id !== action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                const index = state.products.findIndex(product => product.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            });
    },
});

export const { updateProductLocal } = productsSlice.actions;

export default productsSlice.reducer;
