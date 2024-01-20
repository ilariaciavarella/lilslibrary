// IMPORT
import axios from 'axios';
import _ from 'lodash';

import '../scss/results.scss';

// GRAB STORAGE DATA
const chosenGenre = localStorage.getItem('chosenGenre');
const fetchUrl = localStorage.getItem('fetchUrl');

// Grab page elements
const headerOne = document.querySelector('h1');
const headerTwo = document.querySelector('h2');
const bookCollection = document.querySelector('.collection');
const bookTemplate = document.querySelector('[data-book-template]');


// Display genre name as header
let genre = document.createElement('span');
genre.textContent = ` “${chosenGenre}”`;
genre.classList.add('non-italic');
headerOne.appendChild(genre);

// Display always different sentences in h2


//Display books
function worksToBooks(work) {
    const book = bookTemplate.content.cloneNode('true').children[0];
    const title = book.querySelector('.title');
    const authors = book.querySelector('.authors');

    title.textContent = work.title;

    _.forEach(work.authors, (author, index) => {
        if (index + 1 == work.authors.length) {
            authors.textContent += author.name;
        } else {
            authors.textContent += author.name + ', ';
        }
    })

    bookCollection.append(book);
}

axios.get(fetchUrl)
    .then(res => {
        let bookData = res.data;
        console.log(bookData);
        _.forEach(bookData.works, worksToBooks)
    });

