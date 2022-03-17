import React, { useState, useEffect } from 'react'
import ProductCard from '../components/cards/ProductCard'
import { getProductsByCount, fetchProductsByFilter } from '../functions/product'
import { getCategories } from '../functions/category'
import { getSubs } from '../functions/sub'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, Slider, Checkbox, Radio } from 'antd'
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from '@ant-design/icons'
import Star from '../components/forms/Star'

const { SubMenu, ItemGroup } = Menu

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState([0, 0])
  const [ok, setOk] = useState(false)
  const [categories, setCategories] = useState([])
  const [categoryIds, setCategoryIds] = useState([])
  const [star, setStar] = useState('')
  const [subs, setSubs] = useState([])
  const [sub, setSub] = useState('')
  const [brand, setBrand] = useState('')
  const [brands, setBrands] = useState([
    'Apple',
    'Samsung',
    'Microsoft',
    'Lenovo',
    'Asus',
  ])
  const [color, setColor] = useState('')
  const [colors, setColors] = useState([
    'Black',
    'Brown',
    'Silver',
    'White',
    'Blue',
  ])

  const [shipping, setShipping] = useState('')

  let dispatch = useDispatch()
  let { search } = useSelector((state) => ({ ...state }))
  const { text } = search

  useEffect(() => {
    loadAllProducts()
    //Fetch Categories
    getCategories().then((res) => setCategories(res.data))
    //fetch Subs
    getSubs().then((res) => setSubs(res.data))
    console.log(subs)
  }, [])

  // 1. Load products by default on page load
  const loadAllProducts = () => {
    getProductsByCount(12).then((p) => {
      setProducts(p.data)
      setLoading(false)
    })
  }

  // 2. Load products on user search input field
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text })
      if (!text) {
        loadAllProducts()
      }
    }, 300)
    return () => clearTimeout(delayed)
  }, [text])

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data)
    })
  }

  //3. Load products base on price range
  useEffect(() => {
    fetchProducts({ price })
  }, [ok])

  const handleSlider = (value) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setCategoryIds([])
    setPrice(value)
    setStar('')
    setSub('')
    setBrand('')
    setColor('')
    setShipping('')
    setTimeout(() => {
      setOk(!ok)
    }, 300)
  }

  //4. Load product based on category
  //show categories in a list of checkbox
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ))

  //handleCheck for categories
  const handleCheck = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setStar('')
    setSub('')
    setBrand('')
    setColor('')
    setShipping('')
    let inTheState = [...categoryIds]
    let justChecked = e.target.value
    let foundInTheState = inTheState.indexOf(justChecked)

    if (foundInTheState === -1) {
      inTheState.push(justChecked)
    } else {
      inTheState.splice(foundInTheState, 1)
    }

    setCategoryIds(inTheState)
    fetchProducts({ category: inTheState })
  }

  //5. Show product by star rating
  const handleStarClick = (num) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setSub('')
    setCategoryIds([])
    setBrand('')
    setColor('')
    setShipping('')
    setStar(num)
    fetchProducts({ stars: num })
  }
  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  )

  //6. show products by sub category
  const showSubs = () =>
    subs.map((s) => (
      <div
        key={s._id}
        onClick={() => handleSub(s)}
        className="p-1 m-1 badge bg-secondary rounded-pill"
        style={{ cursor: 'pointer' }}
      >
        {s.name}
      </div>
    ))

  const handleSub = (sub) => {
    setSub(sub)
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setCategoryIds([])
    setStar('')
    setBrand('')
    setColor('')
    setShipping('')
    fetchProducts({ sub })
  }

  //7. show product base on brand name
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        key={b}
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pb-1 pl-4 pr-4"
      >
        {b}
      </Radio>
    ))

  const handleBrand = (e) => {
    setSub('')
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setCategoryIds([])
    setStar('')
    setColor('')
    setShipping('')
    setBrand(e.target.value)
    fetchProducts({ brand: e.target.value })
  }

  //8. show product base on color
  const showColors = () =>
    colors.map((c) => (
      <Radio
        key={c}
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-4 pr-4"
      >
        {c}
      </Radio>
    ))

  const handleColor = (e) => {
    setSub('')
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setCategoryIds([])
    setStar('')
    setBrand('')
    setShipping('')
    setColor(e.target.value)
    fetchProducts({ color: e.target.value })
  }

  //9. show product base on shipping
  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingChange}
        value="Yes"
        checked={shipping === 'Yes'}
      >
        Yes
      </Checkbox>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingChange}
        value="No"
        checked={shipping === 'No'}
      >
        No
      </Checkbox>
    </>
  )

  const handleShippingChange = (e) => {
    setSub('')
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    })
    setPrice([0, 0])
    setCategoryIds([])
    setStar('')
    setBrand('')
    setColor('')
    setShipping(e.target.value)
    fetchProducts({ shipping: e.target.value })
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h1>Search Filter</h1>
          <hr />

          <Menu
            defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']}
            mode="inline"
          >
            {/* Price */}
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined />
                  Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `$${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="5000"
                />
              </div>
            </SubMenu>

            {/* category */}
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Categories
                </span>
              }
            >
              <div style={{ marginTop: '-10px' }}>{showCategories()}</div>
            </SubMenu>

            {/* Stars */}
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined />
                  Rating
                </span>
              }
            >
              <div style={{ marginTop: '-10px' }}>{showStars()}</div>
            </SubMenu>

            {/* Subs */}
            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Subs
                </span>
              }
            >
              <div style={{ marginTop: '-10px' }} className="pl-4 pr-4">
                {showSubs()}
              </div>
            </SubMenu>

            {/* Brand */}
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Brands
                </span>
              }
            >
              <div style={{ marginTop: '-10px' }} className="pr-5">
                {showBrands()}
              </div>
            </SubMenu>

            {/* Color */}
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Color
                </span>
              }
            >
              <div style={{ marginTop: '-10px' }} className="pr-5">
                {showColors()}
              </div>
            </SubMenu>

            {/* Shipping */}
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Shipping
                </span>
              }
            >
              <div style={{ marginTop: '-10px' }} className="pr-5">
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>

        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h3 className="text-danger">Products</h3>
          )}

          {products.length < 1 && <p>No Products found</p>}

          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
