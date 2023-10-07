import axios from 'axios';
import Notiflix from 'notiflix';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1
  }

  async fetchInfo() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '39837054-9469d224a9fc48ca296e128bd';

    // const searchQuery = event.currentTarget.elements.searchQuery.value;

    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 4,
      page: this.page
    });

    return await axios
      .get(`${BASE_URL}?${searchParams}`)
      .then(response => {
        // console.log(response.data);
        if (response.data.total === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
            {
              position: 'center-top',
            }
          );
        }
        this.incrementPage();

        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    // return response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
