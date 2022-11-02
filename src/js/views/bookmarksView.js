import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
  _message = '';

  addHandlerInitialRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.reduce(
      (html, item) => html + previewView.render(item, false),
      ''
    );
  }
}

export default new BookmarksView();
