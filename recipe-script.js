// Function to extract query parameter from URL
function getMealIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('meal_id');
}

// Function to fetch and display recipe details
async function fetchAndDisplayRecipe() {
  const mealId = getMealIdFromUrl();

  if (!mealId) {
    document.getElementById('recipe-name').textContent = 'Meal ID not found.';
    return;
  }

  try {
    // Fetch details for the specific ID
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    const meal = data.meals[0];

    if (meal) {
      // Display name, image, and instructions
      document.getElementById('recipe-name').textContent = meal.strMeal;
      document.getElementById('recipe-thumbnail').src = meal.strMealThumb;
      document.getElementById('recipe-thumbnail').alt = meal.strMeal;
      document.getElementById('recipe-instructions').textContent = meal.strInstructions;

    const  instructionsText = meal.strInstructions
    const instructionsList = document.createElement('ol');

        instructionsText
                .split('\r\n')
                .filter(step => step.trim() !== '')
                .forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    instructionsList.appendChild(li);
            });

      // Display ingredients
      const ingredientList = document.getElementById('ingredient-list');
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
          const li = document.createElement('li');
          li.textContent = `${measure} ${ingredient}`;
          ingredientList.appendChild(li);
        }
      }
    } else {
      document.getElementById('recipe-name').textContent = 'Recipe not found.';
    }
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    document.getElementById('recipe-name').textContent = 'Error loading recipe.';
  }
}
// Run the function when the page loads
fetchAndDisplayRecipe();

