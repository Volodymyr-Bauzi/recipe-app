const RecipePage = ({recipe}) => {
  return (
    <div>
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      <p>{recipe.description}</p>
    </div>
  );
};
export default RecipePage;
