async function fetchRandomRecipe() {
    const apiURL = 'www.themealdb.com/api/json/v1/1/random.php';
    const placceholderImage = document.getElementById('placeholder__img');
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = 'Loading...';
    const recipeDetailsContainer = document.getElementById('recipe-details-container')

    try {
        const response = await fetch(`https://${apiURL}`);
        recipeContainer.innerHTML = '';
        recipeDetailsContainer.innerHTML = '';
        placceholderImage.style.display = 'none';
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const recipeImage = data.meals[0].strMealThumb;
        const recipeName = data.meals[0].strMeal;
        
        const recipeImageElement = document.createElement('img');
        recipeImageElement.src = recipeImage;
        recipeImageElement.alt = 'Random Recipe Image';
        recipeImageElement.classList.add('recipe__img');
        recipeImageElement.style.maxWidth = '400px';

        const recipeNameElement = document.createElement('h2');
        recipeNameElement.textContent = recipeName;
        recipeNameElement.classList.add('recipe__name');

        recipeContainer.appendChild(recipeNameElement);
        recipeContainer.appendChild(recipeImageElement);

        const link = document.createElement('a');
        link.href = '#';
        link.textContent = 'Show full recipe';
        link.style.marginTop = '20px';
        link.classList.add('recipe__link');
        recipeContainer.appendChild(link);

        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const detailsData = await fetchRecipeDetails(recipeId);
            const ingredientsList = document.createElement('ul');
            for (let i = 1; i <= 20; i++) {
                const ingredient = detailsData.meals[0][`strIngredient${i}`]?.trim();
                const measurement = detailsData.meals[0][`strMeasure${i}`]?.trim();
                if (ingredient) {
                    const ingredientItem = document.createElement('li');
                    ingredientItem.textContent = measurement ? `${measurement} ${ingredient}` : ingredient;
                    ingredientsList.appendChild(ingredientItem);
                }
            }
            const instructionsText = detailsData.meals[0].strInstructions;
            const instructionsList = document.createElement('ol');

            instructionsText
                .split('\r\n')
                .filter(step => step.trim() !== '')
                .forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    instructionsList.appendChild(li);
            });

            recipeDetails.innerHTML = `<h3>Ingredients:</h3><br><ul>${ingredientsList.innerHTML}</ul><br><h3>Instructions:</h3><br>`;
            recipeDetails.appendChild(instructionsList);

            recipeDetailsContainer.appendChild(recipeDetails);
        });

        const recipeId = data.meals[0].idMeal;

        const fetchRecipeDetails = async (id) => {
            const detailsResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const detailsData = await detailsResponse.json();
            return detailsData;
        };

        const recipeDetails = document.createElement('div');
        recipeDetails.id = 'recipe-details-container';

    } catch (error) {
        console.error('Error fetching recipe:', error);
        container.innerHTML = '<p>Error fetching recipe. Please try again later.</p>';
    }
}