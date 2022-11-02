import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import { async } from 'regenerator-runtime'; // polyfill async await
import 'core-js/stable'; // polyfill everything else
import bookmarksView from './views/bookmarksView.js';

// if (module.hot) module.hot.accept(); // Parcel hot module replacement

const controlRecipes = async function () {
  try {
    // 1. Get recipe ID from the hash in URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 2. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 3. Update bookmarks view to mark selected search result
    bookmarksView.update(model.state.bookmarks);

    // 4. Show spinner
    recipeView.renderSpinner();

    // 5. Load recipe
    await model.loadRecipe(id);

    // 6. Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Show spinner
    resultsView.renderSpinner();

    // 2. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 3. Load search results
    await model.loadSearchResults(query);

    // 4. Clear input
    searchView.clearInput();

    // 5. Render results
    resultsView.render(model.getSearchResultsPage());

    // 6. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render NEW pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1. Update recipe servings (in state)
  model.updateServings(newServings);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);
};

const controlUpdateBookmark = function () {
  // 1. Update bookmark
  model.updateBookmarks(model.state.recipe);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Update bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlInitializeBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // 1. Show spinner
    addRecipeView.renderSpinner();

    // 2. Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // 3. Render recipe
    recipeView.render(model.state.recipe);

    // 4. Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // 5. Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 6. Render Success message
    addRecipeView.renderMessage();

    // 7. Close form
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);

    // 8. Close form and restore markup
    setTimeout(() => {
      addRecipeView.restoreFormAfterSubmission();
      addRecipeView.validateIngredientsFields();
    }, (MODAL_CLOSE_SEC + 1) * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerInitialRender(controlInitializeBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateBookmark(controlUpdateBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addRecipeView.validateIngredientsFields();
};

init();
