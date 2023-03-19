import './css/styles.css';
import { debounce } from 'debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

class CountrySearch {
  constructor() {
    this.searchRef = document.querySelector('#search-box');
    this.countryInfoRef = document.querySelector('.country-info');
    this.countryListRef = document.querySelector('.country-list');

    this.handleInput = debounce(this.handleInput.bind(this), DEBOUNCE_DELAY);
    this.searchRef.addEventListener('input', this.handleInput);
  }

  async handleInput(e) {
    const textInput = e.target.value.trim();

    if (!textInput) {
      this.cleanMarkup(this.countryListRef);
      this.cleanMarkup(this.countryInfoRef);
      return;
    }

    try {
      const data = await fetchCountries(textInput);

      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }

      this.renderMarkup(data);
    } catch (error) {
      Notify.failure('Oops, something went wrong');
      this.cleanMarkup(this.countryListRef);
      this.cleanMarkup(this.countryInfoRef);
    }
  }

  renderMarkup(data) {
    if (data.length === 1) {
      this.cleanMarkup(this.countryListRef);
      const markupInfo = this.createInfoMarkup(data);
      this.countryInfoRef.innerHTML = markupInfo;
    } else {
      this.cleanMarkup(this.countryInfoRef);
      const markupList = this.createListMarkup(data);
      this.countryListRef.innerHTML = markupList;
    }
  }

  createListMarkup(data) {
    return data
      .map(
        ({ name, flags }) => `
        <li>
          <img src="${flags.png}" alt="${name.official}" width="60" height="40">
          <span class="name-span">${name.official}</span>
        </li>
      `
      )
      .join('');
  }

  createInfoMarkup(data) {
    const { name, capital, population, flags, languages } = data[0];

    return `
      <img src="${flags.png}" alt="${name.official}" width="200" height="100">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>
    `;
  }

  cleanMarkup(el) {
    el.innerHTML = '';
  }
}

new CountrySearch();
