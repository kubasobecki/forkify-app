import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async-await

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecepies = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner(recipeContainer); // show spinner

    await model.loadRecipe(id); // load recipe

    recipeView.render(model.state.recipe); // render recipe
  } catch (err) {
    console.error(err);
  }
};

// Event handlers
['load', 'hashchange'].forEach(ev =>
  window.addEventListener(ev, controlRecepies)
);
