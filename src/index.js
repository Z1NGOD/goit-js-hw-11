import fetchAPI from './fetch-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';

const searchFormEl = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
loadMoreBtnEl.style.display = 'none';
const pixabayFecthApi = new fetchAPI();

const handleSearchFromSubmit = async event => {
  event.preventDefault();

  try {
    pixabayFecthApi.querry = event.target.firstElementChild.value;

    await pixabayFecthApi.fetchPhotos().then(data => {
      console.log(data);
      gallery.innerHTML = createGallery(data.hits);
      if (data.totalHits === 0) {
        showError();
        return;
      }
      loadMoreBtnEl.style.display = 'block';
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    });
    event.target.reset();
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
};

const createGallery = data => {
  return data
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `
        <div class='photo-card'>
            <img src='${webformatURL}' alt='${tags}' loading='lazy' />
                <div class='info'>
                    <p class='info-item'>
                    Likes:
                        <b>${likes}</b>
                    </p>
                    <p class='info-item'>
                    Views:
                        <b>${views}</b>
                    </p>
                    <p class='info-item'>
                    Comments:
                        <b>${comments}</b>
                    </p>
                    <p class='info-item'>
                    Downloads:
                        <b>${downloads}</b>
                    </p>
                </div>
        </div>`;
    })
    .join('');
};

searchFormEl.addEventListener('submit', handleSearchFromSubmit);

const showError = () => {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
};
const LoadMore = async () => {
  pixabayFecthApi.page += 1;

  try {
    await pixabayFecthApi.fetchPhotos().then(data => {
      console.log(data);
      gallery.insertAdjacentHTML('beforeend', createGallery(data.hits));
      if (data.totalHits === 0) {
        showError();
        return;
      }
    });
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
};
loadMoreBtnEl.addEventListener('click', LoadMore);
//якщо фото закінчуюються то треба поставити на кнопку loadmore статус display none
