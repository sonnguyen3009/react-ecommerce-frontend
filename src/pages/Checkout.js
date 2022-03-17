import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from '../functions/user'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [address, setAddress] = useState('')
  const [addressSaved, setAddressSaved] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [discountError, setDiscountError] = useState('')

  //redux
  const dispatch = useDispatch()
  const { user, COD } = useSelector((state) => ({ ...state }))
  const couponTrueOrFalse = useSelector((state) => state.coupon)

  useEffect(() => {
    if (user && user.token) {
      getUserCart(user.token).then((res) => {
        setProducts(res.data.products)
        setTotal(res.data.cartTotal)
      })
    }
  }, [user])

  const emptyCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: [],
    })

    emptyUserCart(user.token).then((res) => {
      setProducts([])
      setTotal(0)
      setTotalAfterDiscount(0)
      setCoupon('')
      toast.success('Cart is empty.Continue shopping.')
    })
  }

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true)
        toast.success('Address saved')
      }
    })
  }

  const applyDiscoutCoupon = () => {
    applyCoupon(user.token, coupon).then((res) => {
      if (res.data) {
        setTotalAfterDiscount(res.data)
        //Update redux coupon applied
        dispatch({
          type: 'COUPON_APPLIED',
          payload: true,
        })
      }
      //error
      if (res.data.err) {
        setDiscountError(res.data.err)
        //Update redux coupon applied
        dispatch({
          type: 'COUPON_APPLIED',
          payload: false,
        })
      }
    })
  }

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  )

  const showProductSumary = () => {
    return products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={' '}
          {p.product.price * p.count}
        </p>
      </div>
    ))
  }

  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => {
          setCoupon(e.target.value)
          setDiscountError('')
        }}
        value={coupon}
        type="text"
        className="form-control"
      />
      <button onClick={applyDiscoutCoupon} className="btn btn-primary mt-2">
        Apply
      </button>
    </>
  )

  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, couponTrueOrFalse).then((res) => {
      //empty cart from redux, local storage, resetcoupon, resetCOD
      if (res.data.ok) {
        //empty cart from local storage, redux, database
        if (typeof window !== 'undefined') localStorage.removeItem('cart')
        dispatch({
          type: 'ADD_TO_CART',
          payload: [],
        })
        dispatch({
          type: 'COUPON_APPLIED',
          payload: false,
        })
        dispatch({
          type: 'COD',
          payload: false,
        })
        emptyUserCart(user.token)
        setTimeout(() => {
          navigate('/user/history')
        }, 1000)
      }
    })
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>

      <div className="col-md-6">
        <h4>Order Sumary</h4>

        <hr />
        <p>Product {products.length}</p>
        <hr />
        {showProductSumary()}
        <hr />
        <p>Cart Total: {total}</p>

        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount applied, total payable:${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            {COD ? (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={() => navigate('/payment')}
              >
                Place Order
              </button>
            )}
          </div>

          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
