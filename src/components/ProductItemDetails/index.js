// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare} from 'react-icons/bs'
import {BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productQuantity: 1,
    productDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const each = await response.json()
      const updatedData = {
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
        similarProducts: each.similar_products,
      }
      console.log(updatedData)

      this.setState({
        productDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div>
      <div data-testid="loader" className="products-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    </div>
  )

  onClickPlusIcon = () =>
    this.setState(prevState => ({
      productQuantity: prevState.productQuantity + 1,
    }))

  onClickMinusIcon = () => {
    const {productQuantity} = this.state

    if (productQuantity > 1) {
      this.setState(prevState => ({
        productQuantity: prevState.productQuantity - 1,
      }))
    }
  }

  renderProductDetails = () => {
    const {productDetails, productQuantity} = this.state
    const {
      id,
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productDetails
    const updatedSimilarProducts = similarProducts.map(each => ({
      id: each.id,
      imageUrl: each.image_url,
      title: each.title,
      style: each.style,
      price: each.price,
      description: each.description,
      brand: each.brand,
      totalReviews: each.total_reviews,
      rating: each.rating,
      availability: each.availability,
    }))

    return (
      <div>
        <img src={imageUrl} alt="product" />
        <h1>{title}</h1>
        <p>{brand}</p>
        <p>{price}</p>
        <p>{description}</p>
        <p>{totalReviews}</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
        />
        <BsDashSquare />
        <BsPlusSquare />
        <p>{rating}</p>
        <button data-testid="plus" onClick={this.onClickPlusIcon}>
          +
        </button>
        <p>{productQuantity}</p>
        <button data-testid="minus" onClick={this.onClickMinusIcon}>
          -
        </button>
        <p>{availability}</p>
        <button>ADD TO CART</button>
        <h1>Similar Products</h1>
        <ul>
          {updatedSimilarProducts.map(each => (
            <SimilarProductItem similarProducts={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  clickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button onClick={this.clickContinueShopping}>Continue Shopping</button>
    </div>
  )

  renderAllViews = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderAllViews()}</div>
  }
}

export default ProductItemDetails
