import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminDashboard from '../../pages/admin/AdminDashboard'
import CategoryCreate from '../../pages/admin/category/CategoryCreate'
import LoadingToRedirect from './LoadingToRedirect'
import { currentAdmin } from '../../functions/auth'
import CategoryUpdate from '../../pages/admin/category/CategoryUpdate'
import SubCreate from '../../pages/admin/sub/SubCreate'
import SubUpdate from '../../pages/admin/sub/SubUpdate'
import ProductCreate from '../../pages/admin/product/ProductCreate'
import AllProducts from '../../pages/admin/product/AllProducts'
import ProductUpdate from '../../pages/admin/product/ProductUpdate'
import CreateCouponPage from '../../pages/admin/coupon/CreateCouponPage'

const AdminRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          console.log('CURRENT ADMIN RES', res)
          setOk(true)
        })
        .catch((err) => {
          console.log('ADMIN ROUTE ERR', err)
          setOk(false)
        })
    }
  }, [user])

  return ok ? (
    <Routes>
      <Route exact path="dashboard" element={<AdminDashboard />} />
      <Route exact path="category" element={<CategoryCreate />} />
      <Route exact path="category/:slug" element={<CategoryUpdate />} />
      <Route exact path="sub" element={<SubCreate />} />
      <Route exact path="sub/:slug" element={<SubUpdate />} />
      <Route exact path="product" element={<ProductCreate />} />
      <Route exact path="products" element={<AllProducts />} />
      <Route exact path="product/:slug" element={<ProductUpdate />} />
      <Route exact path="coupon" element={<CreateCouponPage />} />
    </Routes>
  ) : (
    <LoadingToRedirect />
  )
}

export default AdminRoute
