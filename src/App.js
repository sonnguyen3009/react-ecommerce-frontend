import React, { useEffect, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SideDrawer from './components/drawer/SideDrawer'

// import Login from './pages/auth/Login'
// import Register from './pages/auth/Register'
// import Home from './pages/Home'
// import Header from './components/nav/Header'
// import RegisterComplete from './pages/auth/RegisterComplete'
// import ForgotPassword from './pages/auth/ForgotPassword'
// import UserRoute from './components/routes/UserRoute'
// import AdminRoute from './components/routes/AdminRoute'

// import { auth } from './firebase'
// import { useDispatch } from 'react-redux'
// import { currentUser } from './functions/auth'
// import Product from './pages/Product'
// import CategoryHome from './pages/category/CategoryHome'
// import SubHome from './pages/sub/SubHome'
// import Shop from './pages/Shop'
// import Cart from './pages/Cart'
// import Checkout from './pages/Checkout'
// import Payment from './pages/Payment'

import { auth } from './firebase'
import { useDispatch } from 'react-redux'
import { currentUser } from './functions/auth'
import { LoadingOutlined } from '@ant-design/icons'

const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Home = lazy(() => import('./pages/Home'))
const Header = lazy(() => import('./components/nav/Header'))
const RegisterComplete = lazy(() => import('./pages/auth/RegisterComplete'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const UserRoute = lazy(() => import('./components/routes/UserRoute'))
const AdminRoute = lazy(() => import('./components/routes/AdminRoute'))
const Product = lazy(() => import('./pages/Product'))
const CategoryHome = lazy(() => import('./pages/category/CategoryHome'))
const SubHome = lazy(() => import('./pages/sub/SubHome'))
const Shop = lazy(() => import('./pages/Shop'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Payment = lazy(() => import('./pages/Payment'))

const App = () => {
  const dispatch = useDispatch()

  //check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult()

        //redux store
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            })
          })
          .catch((err) => console.log(err))
      }
    })
    //clean up
    return () => unsubscribe()
  }, [dispatch])

  return (
    <Suspense
      fallback={
        <div className="col text-center p-5">
          ___React Redux EC
          <LoadingOutlined />
          MMERCE___
        </div>
      }
    >
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/register/complete" element={<RegisterComplete />} />
        <Route exact path="/forgot/password" element={<ForgotPassword />} />
        <Route exact path="/user/*" element={<UserRoute />} />
        <Route exact path="/admin/*" element={<AdminRoute />} />

        <Route exact path="/product/:slug" element={<Product />} />
        <Route exact path="/category/:slug" element={<CategoryHome />} />
        <Route exact path="/sub/:slug" element={<SubHome />} />
        <Route exact path="/shop" element={<Shop />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/checkout" element={<Checkout />} />
        <Route exact path="/Payment" element={<Payment />} />
      </Routes>
    </Suspense>
  )
}

export default App
