'use strict';
import axios from 'axios';

export default class fetchAPI {
  #API_KEY = '37758369-8fea96641c4bcd65223bf05ae';
  #BASE_URL = 'https://pixabay.com/api/';

  querry = null;
  page = 1;
  perPage = 40;

  fetchPhotos() {
    const url = `${this.#BASE_URL}?key=${this.#API_KEY}&q=${
      this.querry
    }&image_type=photo&orientation=horizontal&safesearch=true&page=${
      this.page
    }&per_page=${this.perPage}`;

    return axios
      .get(url)
      .then(response => {
        if (response.status !== 200) {
          throw new Error(response.status);
        }
        return response.data;
      })
      .catch(error => {
        throw new Error(error.message);
      });
  }
}
