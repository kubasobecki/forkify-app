import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found. Please try another one!`;
  _message = '';

  _generateMarkup() {
    return this._data.reduce(
      (html, item) => html + previewView.render(item, false),
      ''
    );
  }
}

export default new ResultsView();
