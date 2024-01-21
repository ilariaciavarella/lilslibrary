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

    book.id = `${work.key}`;

    bookCollection.append(book);
}

// DISPLAY DETAILS
function displayDetails() {
    const allBooks = bookCollection.querySelectorAll('.book');
    //console.log(allBooks);
    _.forEach(allBooks, book => {
        book.addEventListener('click', () => {
            console.log(book.id);
            axios.get(`https://openlibrary.org${book.id}.json`)
                .then(res => {
                    console.log(res.data);
                    createDetails(res.data);
                })
        })
    })
};

// Create details element
function createDetails(work) {
    const detailsBox = detailsTemplate.content.cloneNode('true').children[0];
    const cover = detailsBox.querySelector('img');
    const title = detailsBox.querySelector('h3');
    const authors = detailsBox.querySelector('.author');
    const plot = detailsBox.querySelector('p');

    title.textContent = work.title;


    _.forEach(work.authors, (author, index) => {
        if (index + 1 == work.authors.length) {
            axios.get(`https://openlibrary.org${author.author.key}.json`).then(res => {
                authors.textContent += res.data.name;
            })
        } else {
            axios.get(`https://openlibrary.org${author.author.key}.json`).then(res => {
                authors.textContent += res.data.name + ', ';
            })
        }
    })

    //cover.setAttribute('src', `https://covers.openlibrary.org/b/oclc/${work.covers[0]}-L.jpg`);

    plot.textContent = work.description;

    document.querySelector('body').appendChild(detailsBox);

}

axios.get(fetchUrl)
    .then(res => {
        let bookData = res.data;
        console.log(bookData);
        _.forEach(bookData.works, worksToBooks);

        displayDetails();
    });