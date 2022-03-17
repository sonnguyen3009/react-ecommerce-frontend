import React from 'react'
import Jumbotron from '../components/cards/Jumbotron'
import NewArrivals from '../components/home/NewArrivals'
import BestSellers from '../components/home/BestSellers'
import CategoryList from '../components/category/CategoryList'
import SubList from '../components/sub/SubList'

const Home = () => {
  return (
    <>
      <div className="container-fluid bg-light p-5">
        <div className="container bg-light p-5 text-danger h1 fw-bold text-center">
          <Jumbotron
            text={['Latest Product', 'New Arrivals', 'Best Sellers']}
          />
        </div>
      </div>

      <h4 className="text-center p-3 mt-5 mb-5 display-3 bg-light">
        New Arrivals
      </h4>

      <NewArrivals />

      <h4 className="text-center p-3 mt-5 mb-5 display-3 bg-light">
        Best Sellers
      </h4>
      <BestSellers />

      <h4 className="text-center p-3 mt-5 mb-5 display-3 bg-light">
        Categories
      </h4>
      <CategoryList />

      <h4 className="text-center p-3 mt-5 mb-5 display-3 bg-light">Subs</h4>
      <SubList />
      <br />
      <br />
    </>
  )
}

export default Home
