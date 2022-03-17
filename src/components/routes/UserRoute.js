import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import History from '../../pages/user/History'
import Password from '../../pages/user/Password'
import Wishlist from '../../pages/user/Wishlist'
import LoadingToRedirect from './LoadingToRedirect'

const UserRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }))

  return user && user.token ? (
    <Routes>
      <Route exact path="history" element={<History />} />
      <Route exact path="password" element={<Password />} />
      <Route exact path="wishlist" element={<Wishlist />} />
    </Routes>
  ) : (
    <LoadingToRedirect />
  )
}

export default UserRoute
