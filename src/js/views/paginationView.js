import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.currentPage;
    const lastPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const prevBtnMarkup = `
      <button class="btn--inline pagination__btn--prev ${
        curPage > 1 ? '' : 'hidden'
      }" data-goto="${curPage - 1}">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;

    const pageNumberOfPagesTotal = `<div class="pagination__pages-total">Page ${curPage} of ${lastPage}</div>`;

    const nextBtnMarkup = `
      <button class="btn--inline pagination__btn--next ${
        curPage !== lastPage ? '' : 'hidden'
      }" data-goto="${curPage + 1}">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>`;

    return prevBtnMarkup + pageNumberOfPagesTotal + nextBtnMarkup;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
