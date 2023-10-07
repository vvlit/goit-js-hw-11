
import PixabayApiService from "./pixabay-service"

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more')
};
const pixabayApiService = new PixabayApiService();

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(event) {
  event.preventDefault();
  clearGallery();
  pixabayApiService.query = event.currentTarget.elements.searchQuery.value;
  pixabayApiService.resetPage();
  pixabayApiService.fetchInfo()
    .then(({ hits }) => {
      createMarkup(hits) }
    )
  
};



function createMarkup(fetchData) {
  console.log(fetchData)
  const markup = fetchData.map(
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
                  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
  })
    .join('');
  
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function onLoadMore() {
  pixabayApiService.fetchInfo()
    .then(({ hits }) => {
      createMarkup(hits) }
    )
}

function clearGallery() {
  refs.gallery.innerHTML = "";
}
