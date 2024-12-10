
import AdminLogin from './AdminLogin'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import RestaurantForm from './RestaurantForm';
import RestaurantList from './RestaurantListing';
import RestaurantManagement from './RestaurantListing';

function App() {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<RestaurantForm/>} />
        <Route path="/list" element={<RestaurantManagement/>} />

        

      </Routes>
    </Router>
      
    </>
  )
}

export default App
