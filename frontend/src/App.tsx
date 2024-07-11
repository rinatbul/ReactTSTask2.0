import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ProductsPage from './components/ProductsPage';
import CreateProductPage from './components/CreateProductPage';
import EditProductPage from './components/EditProductPage';

const App = () => {
  return (
      <Provider store={store}>
        <Router>
          <Routes>
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
