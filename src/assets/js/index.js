// IMPORT
import '../scss/styles.scss';

import ArrowIcon from '../imgs/icons/submit_arrow.svg';
document.querySelector('img').setAttribute('src', ArrowIcon);

// SCRIPT
const submitBtn = document.querySelector('#submit-btn');
const searchInput = document.querySelector('#search-input');
const bookCollection = document.querySelector('.collection');

function getUrl(userInput) {
    if (userInput.match(/^[a-zA-Z\s]*$/gi)) {
        return `${process.env.OPEN_LIBRARY}${userInput.toLowerCase().split(' ').join('_')}.json`;
    } else {
        userInput = userInput.replace(/[_\d\W]/gi, "");
        return `${process.env.OPEN_LIBRARY}${userInput.toLowerCase().split(' ').join('_')}.json`;
    }
}

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem("chosenGenre", getUrl(searchInput.value));
    window.open('results.html', '_self');
})