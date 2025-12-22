const API_URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;

// DOM Elements
const recipeGrid = document.getElementById('recipe-grid');
const searchInput = document.getElementById('recipe-input');
const searchBtn = document.getElementById('search-btn');
const modal = document.getElementById("recipeModal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.querySelector(".close-btn-bottom");
const backToTopBtn = document.getElementById("backToTop");

/* Fetch and Display Recipes */
async function fetchRecipes(query = "") {
    // Show Loader
    recipeGrid.innerHTML = `
        <div id="loader-container">
            <div class="loader"></div>
        </div>`;

    try {
        const response = await fetch(`${API_URL}${query}`);
        const data = await response.json();
        const meals = data.meals;

        recipeGrid.innerHTML = ""; // Clear loader

        if (!meals) {
            recipeGrid.innerHTML = "<p class='no-results'>No recipes found. Try another search!</p>";
            return;
        }

        meals.forEach(meal => {
            const card = createRecipeCard(meal);
            recipeGrid.appendChild(card);
        });
    } catch (error) {
        recipeGrid.innerHTML = "<p>Something went wrong. Please try again later.</p>";
        console.error('Error:', error);
    }
}

/* Create Card Element */

function createRecipeCard(meal) {
    const card = document.createElement('div');
    card.className = "recipe-card";
    
    const description = meal.strInstructions 
        ? meal.strInstructions.substring(0, 100) + "..." 
        : "No instructions available.";

    card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
        <div class="card-content">
            <h3>${meal.strMeal}</h3>
            <p>${description}</p>
            <button class="view-btn">VIEW DETAILS</button>
        </div>`;

    card.querySelector('.view-btn').addEventListener('click', () => showRecipeDetails(meal));
    return card;
}

/* Modal Logic */

function showRecipeDetails(meal) {
    modalBody.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="modal-text-content">
            <h2>${meal.strMeal}</h2>
            <p><strong>Category:</strong> ${meal.strCategory} | <strong>Area:</strong> ${meal.strArea}</p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

const closeModal = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
};

// Event Listeners
searchBtn.addEventListener('click', () => fetchRecipes(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchRecipes(searchInput.value);
});

closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Back to Top Logic
window.onscroll = () => {
    if (window.scrollY > 500) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

// Initial Load
fetchRecipes();