import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getCategories } from '../../../functions/category'
import { updateSub, getSub } from '../../../functions/sub'
import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import CategoryForm from '../../../components/forms/CategoryForm'
import LocalSearch from '../../../components/forms/LocalSearch'
import { useParams, useNavigate } from 'react-router-dom'

const SubUpdate = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => ({ ...state }))
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [parent, setParent] = useState()

  const { slug } = useParams()

  useEffect(() => {
    loadCategories()
    loadSub()
  }, [])

  const loadCategories = () =>
    getCategories().then((c) => {
      setCategories(c.data)
    })

  const loadSub = () =>
    getSub(slug).then((s) => {
      setName(s.data.name)
      setParent(s.data.parent)
    })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    updateSub(slug, { name, parent }, user.token)
      .then((res) => {
        console.log(res)
        setLoading(false)
        setName('')
        toast.success(`"${res.data.name}" is updated`)
        navigate('/admin/sub')
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        if (err.response.status === 400) toast.error(err.response.data)
      })
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Update Sub Category</h4>
          )}

          <div className="form-group">
            <label>Parent category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setParent(e.target.value)}
            >
              {/* <option value={}></option> */}
              <option>Please select</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id} selected={c._id === parent}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
        </div>
      </div>
    </div>
  )
}

export default SubUpdate
