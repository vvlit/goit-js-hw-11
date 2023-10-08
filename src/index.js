import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayApiService from './pixabay-service';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const pixabayApiService = new PixabayApiService();

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.loadMoreBtn.hidden = true;

function onSubmit(event) {
  event.preventDefault();

  clearGallery();

  pixabayApiService.query =
    event.currentTarget.elements.searchQuery.value.trim();
  pixabayApiService.resetPage();
 
  refs.loadMoreBtn.hidden = true;

  if (pixabayApiService.query === '') {
    return Notiflix.Notify.failure(
      'Please, enter search query.'
    );
  }

  pixabayApiService.fetchInfo().then(({ hits }) => {
    createMarkup(hits);
    // refs.loadMoreBtn.hidden = false;
  });
}

function createMarkup(fetchData) {
  const markup = fetchData
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                  <a class="photo-link" href="${largeImageURL}">
                  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                  </a>
                  <div class="info">
                    <p class="info-item">
                      <b>Likes</b> ${likes}
                    </p>
                    <p class="info-item">
                      <b>Views</b> ${views}
                    </p>
                    <p class="info-item">
                      <b>Comments</b> ${comments}
                    </p>
                    <p class="info-item">
                      <b>Downloads</b> ${downloads}
                    </p>
                  </div>
                </div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  const gallery = new SimpleLightbox('.gallery .photo-link');
}

function onLoadMore() {
  pixabayApiService.fetchInfo().then(({ hits }) => {
    createMarkup(hits);
  });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
