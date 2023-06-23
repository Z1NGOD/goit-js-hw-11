'use strict';

export default class fetchAPI {
  #API_KEY = '37758369-8fea96641c4bcd65223bf05ae';
  #BASE_URL = 'https://pixabay.com/api/';

  querry = null;
  page = 1;
  fetchPhotos() {
    return fetch(
      `${this.#BASE_URL}?key=${this.#API_KEY}&q=${
        this.querry
      }&image_type=photo&orientation=horizontal&safesearch=true&page=${
        this.page
      }`
    ).then(Response => {
      if (!Response.ok) {
        throw new Error(Response.status);
      }
      return Response.json();
    });
  }
}
