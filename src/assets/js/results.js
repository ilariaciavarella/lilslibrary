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
const detailsTemplate = document.querySelector('[data-details-template]');


// Display genre name as header
let genre = document.createElement('span');
genre.textContent = ` “${chosenGenre}”`;
genre.classList.add('non-italic');
headerOne.appendChild(genre);

// Display always different sentences in h2


//Display books
function worksToBooks({ key, title, authors, cover_id }) {
    const book = bookTemplate.content.cloneNode('true').children[0];
    const titleElement = book.querySelector('.title');
    const authorsElement = book.querySelector('.authors');

    titleElement.textContent = title;

    _.forEach(authors, (author, index) => {
        if (index + 1 == authors.length) {
            authorsElement.textContent += author.name;
        } else {
            authorsElement.textContent += author.name + ', ';
        }
    })

    book.setAttribute('data-key', `${key}`);
    book.setAttribute('data-cover-id', `${cover_id}`);

    bookCollection.append(book);
}

// DISPLAY DETAILS
// Create details element
function createDetails({ title, authors, description }, coverId) {
    const detailsBox = detailsTemplate.content.cloneNode('true').children[0];
    const coverElement = detailsBox.querySelector('img');
    const titleElement = detailsBox.querySelector('h3');
    const authorsElement = detailsBox.querySelector('.author');
    const plotElement = detailsBox.querySelector('p');

    titleElement.textContent = title;

    _.forEach(authors, (author, index) => {
        if (index + 1 == authors.length) {
            axios.get(`https://openlibrary.org${author.author.key}.json`).then(res => {
                authorsElement.textContent += res.data.name;
            })
        } else {
            axios.get(`https://openlibrary.org${author.author.key}.json`).then(res => {
                authorsElement.textContent += res.data.name + ', ';
            })
        }
    })

    coverElement.setAttribute('src', `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`);

    plotElement.textContent = description || '[Sorry! We have no details about this book]';

    document.querySelector('body').appendChild(detailsBox);
    document.querySelector('body').classList.toggle('details-bg');

    // avoid grid resizing when hiding overflow
    const documentWidth = document.documentElement.clientWidth;
    const scrollbarWidth = Math.abs(window.innerWidth - documentWidth);
    document.body.style.paddingRight = `${scrollbarWidth}px`;
}

// Display them
function displayDetails() {
    const allBooks = bookCollection.querySelectorAll('.book');
    _.forEach(allBooks, book => {
        book.addEventListener('click', () => {
            console.log(book.getAttribute('data-key'));
            axios.get(`https://openlibrary.org${book.getAttribute('data-key')}.json`)
                .then(res => {
                    console.log(res.data);
                    createDetails(res.data, book.getAttribute('data-cover-id'));
                });
        })
    })
};


// Make request
axios.get(fetchUrl)
    .then(res => {
        let bookData = res.data;
        console.log(bookData);
        _.forEach(bookData.works, worksToBooks);
        displayDetails();
    });