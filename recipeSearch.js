async function populateCategories() {
        const categoriesApiUrl = `https://www.themealdb.com/api/json/v1/1/categories.php`;
        const categorySelect = document.getElementById('category-select')

    try {
        const response = await fetch(categoriesApiUrl);
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

document.getElementById('search-button').addEventListener('click', () => {
    const mealInput = document.getElementById('meal-name-input');
    const searchTerm = mealInput.value.toLowerCase().trim();
    const category = document.getElementById('category-select')
    if (searchTerm && category) {
        searchRecipeByName(searchTerm);
        filterRecipesByCategory(category);
    } else {
        alert('Please enter a meal name.');
    }
});


function searchRecipeByName(mealName) {
    const apiSearchURL = `
    https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
    fetch(apiSearchURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok:' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Search arrname:', data);
            displayMeals(data.meals);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

function filterRecipesByCategory(categoryName) {
    const categoryFilterUrl = `
    https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(categoryName)}`;
    fetch(categoryFilterUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok:' + response.statusText);
            }
            return response.json();
        })
        .then (data => {
           console.log('Search arrname:', data);
            displayMeals(data.meals);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error); 
        });
    
}

function displayMeals(meals) {
    const resultsContainer = document.getElementById('meal-results');
    resultsContainer.innerHTML = '';

    if (meals && meals.length > 0) {
        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.className = 'meal-card';
            mealCard.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 200px; padding: 20px;">
            <p>Category: <b>${meal.strCategory}</p></b>
            <a href="${meal.strSource}" target="_blank">View Source</a>
            `;
            resultsContainer.appendChild(mealCard);
        });
    } else {
    resultsContainer.innerHTML = '<p>No meals found with that name.</p>'
    }
}

/* async function filterMealsByNameAndCategory(mealName, categoryName) {

    // 1. Fetch meals filtered by the category first
    const categoryFilterUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(categoryName)}`;
    
    try {
        const response = await fetch(categoryFilterUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const mealsByCategory = data.meals; // This is an array of meals

        if (!mealsByCategory) {
            return []; // No meals found for this category
        }

        // 2. Client-side filter the results by meal name
        const filteredMeals = mealsByCategory.filter(meal => {
            // Case-insensitive check if the meal name includes the search term
            return meal.strMeal.toLowerCase().includes(mealName.toLowerCase());
        });

    } catch (error) {
        console.error("Error fetching or filtering meals:", error);
        return [];
    }
} */

/* // Main search handler
async function handleSearch() {
    const mealNameQuery = mealNameInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;

    if (!selectedCategory) {
        alert('Please select a category.');
        return;
    }

    // 1. Fetch meals by the selected category from the API
    const categoryUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c={selectedCategory}';
    try {
        const response = await fetch(categoryUrl);
        const data = await response.json();
        let meals = data.meals;

        if (!meals) {
            mealResultsDiv.innerHTML = '<p>No meals found for the selected category.</p>';
            return;
        }

        // 2. Filter results by meal name in JavaScript
        if (mealNameQuery) {
            meals = meals.filter(meal =>
                meal.strMeal.toLowerCase().includes(mealNameQuery)
            );
        }

        displayMeals(meals);

    } catch (error) {
        console.error('Error fetching meals:', error);
    }
}

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

// Initialize the application
populateCategories(); */