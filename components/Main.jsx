import React from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromMistral } from "../ai";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const recipeSection = React.useRef(null);

  React.useEffect(() => {
    if (recipe !== "" && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  async function getRecipe() {
    setIsLoading(true);
    setError("");
    try {
      const recipeMarkdown = await getRecipeFromMistral(ingredients);
      setRecipe(recipeMarkdown);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function addIngredient(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newIngredient = formData.get("ingredient").trim();
    if (newIngredient) {
      setIngredients((prev) => [...prev, newIngredient]);
      e.currentTarget.reset();
    }
  }

  function removeIngredient(ingredientToRemove) {
    setIngredients((prev) =>
      prev.filter((item) => item !== ingredientToRemove),
    );
  }

  return (
    <main>
      <form onSubmit={addIngredient} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
        />
        <button type="submit">Add ingredient</button>
      </form>

      {ingredients.length > 0 && (
        <IngredientsList
          ref={recipeSection}
          ingredients={ingredients}
          getRecipe={getRecipe}
          removeIngredient={removeIngredient}
          isLoading={isLoading}
        />
      )}

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {recipe && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}

// export default function Main() {
//   const [ingredients, setIngredients] = React.useState([]);
//   const [recipe, setRecipe] = React.useState("");
//   const [isLoading, setIsLoading] = React.useState(false);
//   const recipeSection = React.useRef(null);

//   React.useEffect(() => {
//     if (recipe !== "" && recipeSection.current !== null) {
//       recipeSection.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [recipe]);

//   async function getRecipe() {
//     setIsLoading(true);
//     const recipeMarkdown = await getRecipeFromMistral(ingredients);
//     setRecipe(recipeMarkdown);
//     setIsLoading(false);
//   }

//   function addIngredient(e) {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const newIngredient = formData.get("ingredient").trim();
//     if (newIngredient) {
//       setIngredients((prev) => [...prev, newIngredient]);
//       e.currentTarget.reset();
//     }
//   }

//   function removeIngredient(ingredientToRemove) {
//     setIngredients((prev) =>
//       prev.filter((item) => item !== ingredientToRemove),
//     );
//   }

//   return (
//     <main>
//       <form onSubmit={addIngredient} className="add-ingredient-form">
//         <input
//           type="text"
//           placeholder="e.g. oregano"
//           aria-label="Add ingredient"
//           name="ingredient"
//         />
//         <button type="submit">Add ingredient</button>
//       </form>

//       {ingredients.length > 0 && (
//         <IngredientsList
//           ref={recipeSection}
//           ingredients={ingredients}
//           getRecipe={getRecipe}
//           removeIngredient={removeIngredient}
//           isLoading={isLoading}
//         />
//       )}

//       {recipe && <ClaudeRecipe recipe={recipe} />}
//     </main>
//   );
// }
