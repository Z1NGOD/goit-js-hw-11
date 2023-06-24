import fetchAPI from './fetch-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

loadMoreBtnEl.style.display = 'none';
const pixabayFecthApi = new fetchAPI();
let lightbox;

const handleSearchFromSubmit = async event => {
  event.preventDefault();
  showLoader();
  try {
    pixabayFecthApi.querry = event.target.firstElementChild.value;

    await pixabayFecthApi.fetchPhotos().then(data => {
      console.log(data);

      gallery.innerHTML = createGallery(data.hits);

      if (data.totalHits === 0) {
        showError();
        return;
      }
      hideLoader();
      loadMoreBtnEl.style.display = 'block';
      pixabayFecthApi.page = 1;
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      initializeLightbox();
    });
    event.target.reset();
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
};

const createGallery = data => {
  return data
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `
        <div class='photo-card'>
            <a href='${webformatURL}' data-lightbox='gallery'>
              <img src='${webformatURL}' alt='${tags}' loading='lazy' />
            </a>
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
  loadMoreBtnEl.style.display = 'none';
  showLoader();
  try {
    await pixabayFecthApi.fetchPhotos().then(data => {
      console.log(data);
      gallery.insertAdjacentHTML('beforeend', createGallery(data.hits));
      if (data.totalHits === 0) {
        showError();
        return;
      }
      dataCheckForLoad(data);
      hideLoader();
      smoothScroll();
      initializeLightbox();
    });
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
};

loadMoreBtnEl.addEventListener('click', LoadMore);

const smoothScroll = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const dataCheckForLoad = data => {
  if (data.hits.length >= pixabayFecthApi.perPage) {
    loadMoreBtnEl.style.display = 'block';
  } else {
    loadMoreBtnEl.style.display = 'none';
  }
};

const initializeLightbox = () => {
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a');
  }
};
const showLoader = () => {
  loader.style.display = 'block';
  gallery.style.display = 'none';
};
const hideLoader = () => {
  loader.style.display = 'none';
  gallery.style.display = 'flex';
};
