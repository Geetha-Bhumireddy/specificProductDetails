// Write your code here

const SimilarProductItem = props => {
  const {similarProducts} = props
  const {
    id,
    imageUrl,
    title,
    style,
    price,
    description,
    brand,
    totalReviews,
    rating,
    availability,
  } = similarProducts

  return (
    <li>
      <img src={imageUrl} alt="similar product" />
      <h1>{title}</h1>
      <p>{brand}</p>
      <p>{totalReviews}</p>
      <p>{price}</p>
      <p>{description}</p>
      <img
        src="https://assets.ccbp.in/frontend/react-js/star-img.png"
        alt="star"
      />
      <p>{rating}</p>
      <p>{availability}</p>
    </li>
  )
}

export default SimilarProductItem
