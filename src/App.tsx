import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    <Header />
                    <main className="container mx-auto px-2 py-8">
                        <Routes>
                            <Route path="/" element={<ProductList />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                        </Routes>
                    </main>
                    <ToastContainer />
                </div>
            </Router>
        </Provider>
    );
}

export default App;