import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ProductsPage from './features/products/ProductsPage';
import CreateProductPage from './features/products/CreateProductPage';
import EditProductPage from './features/products/EditProductPage';

const App: React.FC = () => {
  return (
      <Provider store={store}> //Включает Redux хранилище для всех компонентов
        <Router> //Для маршрутизации
          <Routes> //Все маршруты приложения
            <Route path="/products/create" element={<CreateProductPage/>} />
            <Route path="/products/edit/:id" element={<EditProductPage/>} />
            <Route path="/products" element={<ProductsPage/>} />
            <Route path="/" element={<ProductsPage/>} />
          </Routes>
        </Router>
      </Provider>
  );
};

export default App;
