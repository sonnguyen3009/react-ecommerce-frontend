import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'

const Search = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { search } = useSelector((state) => ({ ...state }))
  const { text } = search

  const handleChange = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: e.target.value },
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/shop?${text}`)
  }

  return (
    <form className="row ms-auto my-2 my-lg-0" onSubmit={handleSubmit}>
      <div className="col">
        <input
          onChange={handleChange}
          type="search"
          value={text}
          className="form-control mr-sm-2"
          placeholder="Search"
        />
      </div>
      <div className="col-auto">
        <SearchOutlined onClick={handleSubmit} style={{ cursor: 'pointer' }} />
      </div>
    </form>
  )
}

export default Search
