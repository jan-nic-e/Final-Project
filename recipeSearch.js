async function populateCategories() {
        const allCategoriesiUrl = `https://www.themealdb.com/api/json/v1/1/categories.php`;
        const categorySelect = document.getElementById('category-select')

    try {
        const response = await fetch(allCategoriesiUrl);
        const data = await response.json();
        const categories = data.categories;

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.strCategory;
            option.textContent = category.strCategory;
            categorySelect.appendChild(option);
        })

    } catch (error) {
        console.error('Error fetching categories:', error);
        const errorOption = document.createElement('option');
        errorOption.textContent = 'Error loading categories';
        categorySelect.appendChild(errorOption)
    }
}

const triggerInput = document.getElementById('category-select');

triggerInput.addEventListener('click', (event) => {
    populateCategories();
});

const searchMeals = async (mealName, category) => {
    let apiUrl = `https://www.themealdb.com/api/json/v1/1/`;
    if (mealName && category) {
        apiUrl += `search.php?s=${mealName}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        const meals = data.meals;

        if (meals) {
            const filteredMeals = meals.filter(meal => meal.strCategory === category);
            return filteredMeals;
        } else {
            return [];
        }
    } else if (mealName) {
        apiUrl += `search.php?s=${mealName}`;
    } else if (category) {
        apiUrl += `filter.php?c=${category}`;
    } else {
        console.log("Please enter a meal name or select a category");
        return;
    }

 try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // The API response structure has a 'meals' array
        return data.meals || []; // Return the meals array, or an empty array if none found
    } catch (error) {
        console.error("Error fetching meals:", error);
        return [];
    }
};

const searchButton = document.getElementById('search-button');
searchButton.addEventListener("click", async () => {
    const mealName = document.getElementById('meal-name-input').value;
    const category = document.getElementById('category-select').value;
    
    const mealResults = await searchMeals(mealName, category);
    displayMeals(mealResults);
});

// Display filtered meals in the results div
function displayMeals(mealResults) {
    const mealResultsDiv = document.getElementById('meal-results')
    mealResultsDiv.innerHTML = '';
    if (mealResults.length === 0) {
        mealResultsDiv.innerHTML = '<p>No meals found matching your criteria.</p>';
        return;
    }

    mealResults.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.innerHTML = `
            <h3 id="meal-heading">${meal.strMeal}</h3><br>
            <img id="meal-img" src="${meal.strMealThumb}" alt="${meal.strMeal}"><br>
            <a id="recipe-link" href="selectedMeal.html">Take Me to Recipe</a>
        `;
        mealResultsDiv.appendChild(mealCard);
    });
}

/* const headingElement = document.getElementById('meal-heading');
if (headingElement) {
    headingElement.style.fontSize = '14px';
    headingElement.style.maxWidth = '120px';
    headingElement.style.textAlign = 'center';
    headingElement.style.marginBottom = '8px';
}

const imageElement = document.getElementById('meal-img');
if (imageElement) {
    imageElement.style.padding = '10px';    
} */