// IMPORT
import axios from 'axios';
import _ from 'lodash';

import '../scss/results.scss';

// SCRIPTS
function getBooks(fetchUrl) {
    console.log(fetchUrl);
    axios.get(fetchUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            // data.works.forEach(work => {
            //     const book = bookTemplate.content.cloneNode('true').children[0];
            //     const title = book.querySelector('.title');
            //     const author = book.querySelector('.author');


            //     title.textContent = work.title;

            //     for (authorNames of work.authors) {
            //         author.textContent += authorNames.name
            //     }

            //     bookCollection.append(book);
            // })
        })
}