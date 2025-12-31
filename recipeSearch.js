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

// Display filtered meals in the results div
function displayMeals(meals) {
    mealResultsDiv.innerHTML = '';
    if (meals.length === 0) {
        mealResultsDiv.innerHTML = '<p>No meals found matching your criteria.</p>';
        return;
    }

    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="100">
        `;
        mealResultsDiv.appendChild(mealCard);
    });
}

const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', searchMeals);