// IMPORT
import '../scss/styles.scss';

import ArrowIcon from '../imgs/icons/submit_arrow.svg';
document.querySelector('img').setAttribute('src', ArrowIcon);

// Grab elements
const submitBtn = document.querySelector('#submit-btn');
const searchInput = document.querySelector('#search-input');

// Convert to url
function getUrl(userInput) {
    return `${process.env.OPEN_LIBRARY}${userInput.toLowerCase().split(' ').join('_')}.json`;
}

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (searchInput.value.length > 0) {
        localStorage.setItem("chosenGenre", searchInput.value.toLowerCase());
        localStorage.setItem("fetchUrl", getUrl(searchInput.value));
        window.location.replace(`results.html?search=${localStorage.getItem('chosenGenre')}&page=1`);
    } else {
        searchInput.setAttribute('style', 'background-color: #bb5a5a; color: #f7f0e9');
        searchInput.setAttribute('placeholder', 'Please, fill this box before submitting')
    }
})

searchInput.addEventListener('focus', () => {
    searchInput.removeAttribute('style');
    searchInput.setAttribute('placeholder', 'Search');
})

localStorage.removeItem('currentPage');