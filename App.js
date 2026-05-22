import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProfileProvider } from './context/ProfileContext';
import { FeedbackProvider } from './context/FeedbackContext';
import PrivateRoute from './components/PrivateRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import StaffLayout from './layouts/StaffLayout';
import KitchenLayout from './layouts/KitchenLayout';
import CustomerLayout from './layouts/CustomerLayout';

// Auth
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Admin pages
import Dashboard from './pages/Dashboard';
import Tables from './pages/Tables';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import AdminAccounts from './pages/admin/AdminAccounts';
import AdminVouchers from './pages/admin/AdminVouchers';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminReservations from './pages/admin/AdminReservations';

// Customer pages
import CustomerMenu from './pages/customer/CustomerMenu';
import Cart from './pages/customer/Cart';
import Reservation from './pages/customer/Reservation';
import CustomerOrders from './pages/customer/CustomerOrders';
import Profile from './pages/customer/Profile';
import Feedback from './pages/customer/Feedback';

// Staff pages
import StaffTables from './pages/staff/StaffTables';
import StaffOrders from './pages/staff/StaffOrders';
import StaffReservations from './pages/staff/StaffReservations';
import StaffCustomers from './pages/staff/StaffCustomers';

import AIAnalytics from './pages/AIAnalytics';
import KitchenQueue from './pages/kitchen/KitchenQueue';
import KitchenHistory from './pages/kitchen/KitchenHistory';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProfileProvider>
        <FeedbackProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login"          element={<Login />} />
            <Route path="/register"       element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin */}
            <Route path="/" element={<PrivateRoute roles={['admin']}><AdminLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tables"    element={<Tables />} />
              <Route path="menu"      element={<Menu />} />
              <Route path="orders"    element={<Orders />} />
              <Route path="staff"     element={<Staff />} />
              <Route path="reports"   element={<Reports />} />
              <Route path="accounts"      element={<AdminAccounts />} />
              <Route path="vouchers"      element={<AdminVouchers />} />
              <Route path="feedback"      element={<AdminFeedback />} />
              <Route path="reservations"  element={<AdminReservations />} />
              {/* <Route path="ai" element={<AIAnalytics />} /> */}
            </Route>

            {/* Staff */}
            <Route path="/staff" element={<PrivateRoute roles={['staff']}><StaffLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/staff/tables" replace />} />
              <Route path="tables"       element={<StaffTables />} />
              <Route path="reservations" element={<StaffReservations />} />
              <Route path="orders"       element={<StaffOrders />} />
              <Route path="customers"    element={<StaffCustomers />} />
            </Route>

            {/* Kitchen */}
            <Route path="/kitchen" element={<PrivateRoute roles={['kitchen']}><KitchenLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/kitchen/queue" replace />} />
              <Route path="queue"   element={<KitchenQueue />} />
              <Route path="history" element={<KitchenHistory />} />
            </Route>

            {/* Customer */}
            <Route path="/customer" element={<PrivateRoute roles={['customer']}><CustomerLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/customer/menu" replace />} />
              <Route path="menu"        element={<CustomerMenu />} />
              <Route path="cart"        element={<Cart />} />
              <Route path="reservation" element={<Reservation />} />
              <Route path="orders"      element={<CustomerOrders />} />
              <Route path="profile"     element={<Profile />} />
              <Route path="feedback"    element={<Feedback />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        </FeedbackProvider>
        </ProfileProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
