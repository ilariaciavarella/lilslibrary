// IMPORT
import axios from 'axios';
import _ from 'lodash';

import '../scss/styles.scss';

import ArrowIcon from '../imgs/icons/submit_arrow.svg';
document.querySelector('img').setAttribute('src', ArrowIcon);

// SCRIPT
const submitBtn = document.querySelector('#submit-btn');
const searchInput = document.querySelector('#search-input');

const getUrl = function (genre) {
    return `${process.env.OPEN_LIBRARY}${genre}.json`;
}

let fetchUrl;

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fetchUrl = getUrl(searchInput.value);
    // window.open('results.html', '_self');
})