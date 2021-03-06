
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class="btn btn-danger btn-sm delete">X</a></td>`;
        list.appendChild(row);
    }

    static deleteBook(element) {
        if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    static showAlerts(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //Vanish in 3 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000)
    }

    static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
    }
}

//Display book event
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//Add a book event
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //prevent defaul submit behavior
    e.preventDefault();

    //Get values 
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validatation
    if (title === '' || author === '' || isbn === '') {
        UI.showAlerts('Пожалуйста заполните все поля', 'danger');
        } else { 

        //Instatiate book
        const book = new Book(title, author, isbn);

        //Add book to UI
        UI.addBookToList(book);

        //Add book to Store
        Store.addBook(book);
        
        //Show success message
        UI.showAlerts('Книга успешно добавлена', 'success');
        
        //Clear fields
        UI.clearFields();
        }
    });

    class Store {
        static getBooks() {
            let books;
            if(localStorage.getItem('books') === null) {
                books = [];
            } else {
                books = JSON.parse(localStorage.getItem('books'));
            }
            return books;
        }

        static addBook(book) {
            const books = Store.getBooks();

            books.push(book);

            localStorage.setItem('books', JSON.stringify(books));
        }

        static removeBook(isbn) {
            const books = Store.getBooks();

            books.forEach((book, index) => {
                if(book.isbn === isbn) {
                    books.splice(index, 1);
                }
            });

            localStorage.setItem('books', JSON.stringify(books));
        }
    }

//Remove a book event
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove from UI
    UI.deleteBook(e.target);

    //Remove book from localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show remove message
    UI.showAlerts('Книга удалена', 'success');

});