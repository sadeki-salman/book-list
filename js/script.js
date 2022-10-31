//Define UI Elements--------------------------
let form = document.getElementById("book-form");
let bookList = document.getElementById("book-list");
let search = document.getElementById("filter-book");

//Define Class----------------------------------
//Book Class***
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//BookList Class***
class BookList {

    //Add To Book List
    static addToBookList(book) {
        let list = bookList;
        let row = document.createElement("tr");
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class='delete'>X</a></td>`

        list.appendChild(row);
    }
    //Clear Fields
    static clearField() {
        document.getElementById("title").value = '';
        document.getElementById("author").value = '';
        document.getElementById("isbn").value = '';
    }

    //Show Alert
    static showAlert(message, className) {
        let div = document.createElement("div");
        div.className = ` alert ${className}`;
        div.innerHTML = `${message}`;

        let container = document.querySelector(".container");

        container.insertBefore(div, form);

        //Remove alert after 3 seconds
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);
    }

    //Remove From Book List
    static removeFromBookList(target) {
        if (target.hasAttribute("href")) {
            target.parentElement.parentElement.remove();
            Store.removeBook(target.parentElement.previousElementSibling.textContent.trim());

            BookList.showAlert("Book Removed!", "success");
        }
    }

    //Search Book from Book List
    static searchFromBookList(text) {

        document.querySelectorAll("tr").forEach(row => {
            let title = row.children[0].textContent.toLowerCase();
            let author = row.children[1].textContent.toLowerCase();
            let isbn = row.children[2].textContent.toLowerCase();

            if (title.indexOf(text) == -1 && author.indexOf(text) == -1 && isbn.indexOf(text) == -1 && row.children[0].hasAttribute("class") === false) {
                row.style.display = "none";
            }
        });
        if (text === '') {
            bookList.innerHTML = "";
            Store.displayBooks();
        }
    }
}

//Local Storage Class***
class Store {

    //get books from local storage
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    //add to local storage
    static addBook(book) {
        let books = Store.getBooks();
        books.push(book);

        localStorage.setItem("books", JSON.stringify(books));
    }

    //display books from local storage
    static displayBooks() {
        let books = Store.getBooks();

        books.forEach(book => {
            BookList.addToBookList(book);
        });
    }

    //remove book from local storage
    static removeBook(isbn) {
        let books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}


//Define Event Listener------------------------
form.addEventListener("submit", addBook);
bookList.addEventListener("click", removeBook);
document.addEventListener("DOMContentLoaded", Store.displayBooks);
search.addEventListener("keyup", filterBook);


//Define Function--------------------------------
//addBook Function***
function addBook(e) {
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let isbn = document.getElementById("isbn").value;

    if (title === '' || author === '' || isbn === '') {
        BookList.showAlert("Please fill all the fields!", "error");
    } else {
        let book = new Book(title, author, isbn);
        BookList.addToBookList(book);
        BookList.clearField();
        BookList.showAlert("Book Added!", "success");
        Store.addBook(book);
    }
    e.preventDefault();
}

//removeBook Function***
function removeBook(e) {
    BookList.removeFromBookList(e.target);
    e.preventDefault();
}

//filterBook Function
function filterBook(e) {
    let text = e.target.value.toLowerCase();
    BookList.searchFromBookList(text);
}