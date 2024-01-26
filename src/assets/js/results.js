// IMPORT
import axios from 'axios';
import _ from 'lodash';

import '../scss/results.scss';

import CloseIcon from '../imgs/icons/close.svg';
import LoadGif from '../imgs/icons/loading.gif';

// GRAB STORAGE DATA
const chosenGenre = localStorage.getItem('chosenGenre');
const fetchUrl = localStorage.getItem('fetchUrl');

// BASICS ------------------------------------------------------------------------------------
// Grab page elements
const headerOne = document.querySelector('h1');
const headerTwo = document.querySelector('h2');
const bookCollection = document.querySelector('.collection');
const pagination = document.querySelector('.pagination');
const bookTemplate = document.querySelector('[data-book-template]');
const detailsTemplate = document.querySelector('[data-details-template]');

// Display genre name as header
let genre = document.createElement('span');
genre.textContent = ` “${chosenGenre}”`;
genre.classList.add('non-italic');
headerOne.appendChild(genre);

// Display always different sentences in h2
let headerOptions = ['I would have done the same choice! Here is what we have:',
    'Nice one! Take a look at these books:',
    'You have great taste! You will like these titles:',
    'I like this one! Let me show you what we have:',
    'Splendid selection! Let me reveal our assortment of books:',
    'Good choice! These are the titles we have:',
    'Fantastic pick! Allow me to unveil our collection:',
    'Terrific decision! Witness the breadth of our library:',
    'Wonderful choice! Prepare to discover our captivating titles:',
    'Brilliant pick! Explore the enchanting books we have:',
];

let index = Math.floor(Math.random() * headerOptions.length);
headerTwo.textContent = headerOptions[index];

// Display books
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

// Loading
function loading() {
    const loadImg = document.createElement('img');
    const loadBox = document.createElement('div');
    loadImg.setAttribute('src', LoadGif);
    loadImg.classList.add('load-gif');
    loadBox.classList.add('load-box');
    loadBox.appendChild(loadImg);
    document.querySelector('main').appendChild(loadBox);
}

function removeLoad() {
    const loadBox = document.querySelector('.load-box');
    document.querySelector('main').removeChild(loadBox);
}

// DISPLAY DETAILS ---------------------------------------------------------------------------
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
    coverElement.setAttribute('alt', `Cover of the book: ${title}`);

    plotElement.textContent = typeof description == 'string' ? description : typeof description == 'object' ? description.value : '[Sorry! We have no details about this book]';

    createCloseBtn(detailsBox);

    document.body.appendChild(detailsBox);
    document.body.classList.toggle('details-bg');

    // avoid grid resizing when hiding overflow
    const documentWidth = document.documentElement.clientWidth;
    const scrollbarWidth = Math.abs(window.innerWidth - documentWidth);
    document.body.style.paddingRight = `${scrollbarWidth}px`;
}

// Create close icon
function createCloseBtn(box) {
    const closeBtn = box.querySelector('.close-btn')
    closeBtn.setAttribute('src', CloseIcon);
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(box);
        document.body.classList.toggle('details-bg');
    })
}

// Display them
function displayDetails() {
    const allBooks = bookCollection.querySelectorAll('.book');
    _.forEach(allBooks, book => {
        book.addEventListener('click', () => {
            axios.get(`https://openlibrary.org${book.getAttribute('data-key')}.json`)
                .then(res => {
                    console.log(res.data);
                    createDetails(res.data, book.getAttribute('data-cover-id'));
                });
        })
    })
};

// ERROR POP UP ------------------------------------------------------------------------------
function errorPopup(err) {
    const overlay = document.createElement('div');
    overlay.classList.add('dark-overlay');

    const popup = document.createElement('div');
    popup.classList.add('error-box');
    overlay.appendChild(popup);

    const msgHeader = document.createElement('h2');
    const msg = document.createElement('p');
    msgHeader.textContent = "Ops! Something went wrong"
    msg.innerHTML = `Sorry, the following error occurred: &ldquo;${err.message}&rdquo;. Return to the <a href="../../">Home Page</a> and try again!`
    popup.appendChild(msgHeader);
    popup.appendChild(msg);

    document.body.appendChild(overlay);
}

// PAGINATION --------------------------------------------------------------------------------
function getPagesNumber({ work_count }) {
    const pagesNumber = _.ceil(work_count / 60);
    const maxPages = 5;
    let startPage;
    let endPage;

    if (pagesNumber > 1) {
        pagination.innerHTML += '<span class="previous-page">&lsaquo;</span>';

        if (currentPage < 3) {
            startPage = 1;
            endPage = maxPages;
        } else {
            startPage = currentPage - Math.floor(maxPages / 2);
            endPage = currentPage + Math.floor(maxPages / 2);
        }
        for (let i = startPage; i <= endPage; i++) {
            pagination.innerHTML += `<span class="pages">${i}</span>`;
        }

        pagination.innerHTML += '<span class="next-page">&rsaquo;</span>';
    }

    // Make numbers clickable
    const pages = document.querySelectorAll('.pages');
    _.forEach(pages, page => {
        if (page.textContent == currentPage) {
            page.classList.add('current-page')
        } else {
            page.addEventListener('click', () => {
                changePage(page);
                location.replace(newLocation);
            })
        }

    });

    // Next page click or disable
    const nextPage = document.querySelector('.next-page');
    if (nextPage) {
        if (currentPage != pagesNumber) {
            nextPage.addEventListener('click', () => {
                let pageValue = ++currentPage;
                console.log(pageValue);
                localStorage.setItem('currentPage', pageValue);
                let reg = /page=\d+/;
                newLocation = _.replace(location.href, reg, `page=${pageValue}`)
                location.replace(newLocation);
            })
        } else {
            nextPage.classList.add('disabled');
        }
    }

    // Previous page click or disable
    const previousPage = document.querySelector('.previous-page');
    if (previousPage) {
        if (currentPage > 1) {
            previousPage.addEventListener('click', () => {
                let pageValue = --currentPage;
                localStorage.setItem('currentPage', pageValue);
                let reg = /page=\d+/;
                newLocation = _.replace(location.href, reg, `page=${pageValue}`)
                location.replace(newLocation);
            })
        } else {
            previousPage.classList.add('disabled');
        }
    }
}

function changePage(page) {
    let pageValue = page.textContent;
    localStorage.setItem('currentPage', pageValue);
    let reg = /page=\d+/;
    newLocation = _.replace(location.href, reg, `page=${pageValue}`)
}

// ACTUAL REQUEST ----------------------------------------------------------------------------
let currentPage = Number(localStorage.getItem('currentPage')) || 1;
let limit = 30;
let newLocation;

loading();

axios.get(fetchUrl, {
    params: {
        limit: limit,
        offset: (limit * (currentPage - 1)),
    }
})
    .then(res => {
        let bookData = res.data;
        if (bookData.works.length == 0) {
            headerTwo.innerHTML = 'Sorry! We have no books for the genre you chose. <a href="../../">Try another research</a>'
        }
        _.forEach(bookData.works, worksToBooks);

        displayDetails();
        removeLoad();

        getPagesNumber(bookData);
    })
    .catch(e => {
        console.error(e);
        errorPopup(e);
    });