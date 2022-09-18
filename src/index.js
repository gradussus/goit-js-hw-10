import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const allDocument = document.querySelector('body');

inputEl.addEventListener(
  'input',
  debounce(e => {
    let inputText = e.target.value.trim();
    clear();

    if (inputText.length === 0) {
      Notiflix.Notify.info('Ну введи хочаб щось');
      return;
    }

    fetchCountries(inputText)
      .then(data => {
        if (data.length === 1) {
          showInfo(data);
        } else if (data.length > 1 && data.length < 11) {
          severalCountries(data);
        } else {
          Notiflix.Notify.info(
            'Забагато країн що відповідають пошуку. Напиши більш детальний запит'
          );
        }
      })
      .catch(error => {
        Notiflix.Notify.failure(
          'Не існує країни що відповідає запиту. Принаймні поки-що'
        );
      });
  }, DEBOUNCE_DELAY)
);

function severalCountries(countries) {
  countries
    .map(country => {
      //   console.log(country.name.nativeName);
      return `<li class="country-item">
            <img src=${country.flags.svg} width="60">
            <span class="country-name">${country.name.official}</span>
        </li>`;
    })
    .forEach(c => countryList.insertAdjacentHTML('beforeend', c));
}
function showInfo(countries) {
  let country = countries[0];
  if (country.name.common === 'Russia') {
    clear();
    Notiflix.Notify.info('Слава Україні');
    allDocument.style.backgroundImage =
      'linear-gradient( to bottom, blue 50%, yellow 50%';
    allDocument.style.height = '100vh';
    return;
  }
  const i = `<div class="main-info"><img src=${country.flags.svg} width="500">
            <span class="country-name-in-info">${country.name.official}</span>
</div>
            <ul class="other-info">

            <li class=country-text"><span>Capital:</span> ${
              country.capital
            }</li>
            <li class="country-text"><span>Population:</span> ${country.population.toLocaleString(
              'ru-RU'
            )}</li>
            <li class=country-text"><span>Languages:</span> ${Object.values(
              country.languages
            )}</li>
            </ul>`;
  countryInfo.insertAdjacentHTML('beforeend', i);
}

function clear() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
