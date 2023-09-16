// CUSTOM EVENT
const REFRESH_EVENT = "refreshList";
const refreshList = new Event(REFRESH_EVENT);

// INPUT
const inputTitle = document.querySelector("#inputBookTitle");
const inputAuthor = document.querySelector("#inputBookAuthor");
const inputYear = document.querySelector("#inputBookYear");
const inputCheckCompleted = document.querySelector("#inputBookIsComplete");

function resetInput() {
  inputTitle.value = "";
  inputAuthor.value = "";
  inputYear.value = "";
  inputCheckCompleted.checked = false;
}

// COLLECTIONS
const bookCollections = "book_collections";

function getAllBooks() {
  if (typeof Storage === undefined) {
    alert("This browser doesn't support local storage");
    return;
  }

  const result = localStorage.getItem(bookCollections);

  if (!result) return [];

  return JSON.parse(result);
}

function markBookAsComplete(markedBook) {
  const books = getAllBooks();

  const updatedBooks = books.map((book) => {
    if (markedBook.id === book.id) {
      return { ...book, isComplete: true };
    }

    return book;
  });
  localStorage.setItem(bookCollections, JSON.stringify(updatedBooks));

  window.dispatchEvent(refreshList);
}

function markBookAsIncomplete(markedBook) {
  const books = getAllBooks();

  const updatedBooks = books.map((book) => {
    if (markedBook.id === book.id) {
      return { ...book, isComplete: false };
    }

    return book;
  });
  localStorage.setItem(bookCollections, JSON.stringify(updatedBooks));

  window.dispatchEvent(refreshList);
}

function deleteBook(deletedBook) {
  const books = getAllBooks();

  const filteredBooks = books.filter((book) => book.id !== deletedBook.id);
  localStorage.setItem(bookCollections, JSON.stringify(filteredBooks));

  window.dispatchEvent(refreshList);
}

function displayUncompletedBooks(books) {
  const container = document.querySelector("#incompleteBookshelfList");
  container.innerHTML = "";

  for (const book of books) {
    const article = document.createElement("article");
    article.setAttribute("class", "book_item");

    const heading = document.createElement("h3");
    heading.innerText = book.title;

    const author = document.createElement("p");
    author.innerText = `Penulis: ${book.author}`;

    const year = document.createElement("p");
    year.innerText = `Tahun: ${book.year}`;

    article.appendChild(heading);
    article.appendChild(author);
    article.appendChild(year);

    const actions = document.createElement("div");
    actions.setAttribute("class", "action");

    const completeButton = document.createElement("button");
    completeButton.innerText = "Selesai Dibaca";
    completeButton.setAttribute("class", "green");
    completeButton.addEventListener("click", function () {
      markBookAsComplete(book);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.setAttribute("class", "red");
    deleteButton.addEventListener("click", function () {
      deleteBook(book);
    });

    actions.appendChild(completeButton);
    actions.appendChild(deleteButton);

    article.appendChild(actions);

    container.appendChild(article);
  }
}

function displayCompletedBooks(books) {
  const container = document.querySelector("#completeBookshelfList");
  container.innerHTML = "";

  for (const book of books) {
    const article = document.createElement("article");
    article.setAttribute("class", "book_item");

    const heading = document.createElement("h3");
    heading.innerText = book.title;

    const author = document.createElement("p");
    author.innerText = `Penulis: ${book.author}`;

    const year = document.createElement("p");
    year.innerText = `Tahun: ${book.year}`;

    article.appendChild(heading);
    article.appendChild(author);
    article.appendChild(year);

    const actions = document.createElement("div");
    actions.setAttribute("class", "action");

    const completeButton = document.createElement("button");
    completeButton.innerText = "Belum Selesai Dibaca";
    completeButton.setAttribute("class", "green");
    completeButton.addEventListener("click", function () {
      markBookAsIncomplete(book);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.setAttribute("class", "red");
    deleteButton.addEventListener("click", function () {
      deleteBook(book);
    });

    actions.appendChild(completeButton);
    actions.appendChild(deleteButton);

    article.appendChild(actions);

    container.appendChild(article);
  }
}

function loadBookList() {
  const searchQuery = document.querySelector("#searchBookTitle").value.toLowerCase();

  const books = getAllBooks();
  let filteredBooks = books;

  if (searchQuery.length > 0 && books.length > 0) {
    filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery)
    );
  }

  const uncompletedBooks = filteredBooks.filter((book) => !book.isComplete);
  const completedBooks = filteredBooks.filter((book) => book.isComplete);

  displayUncompletedBooks(uncompletedBooks);
  displayCompletedBooks(completedBooks);
}

// FORM SEARCH HANDLING
function searchBook(event) {
  event.preventDefault();

  loadBookList();
}

const searchForm = document.querySelector("#searchBook");
searchForm.addEventListener("submit", searchBook);

// FORM EVENT SUBMIT HANDLING
function submitBook(event) {
  event.preventDefault();

  const id = +new Date();
  const title = inputTitle.value;
  const author = inputAuthor.value;
  const year = inputYear.value;
  const isComplete = inputCheckCompleted.checked;

  const newBook = { id, title, author, year, isComplete };

  const books = getAllBooks();
  books.push(newBook);

  localStorage.setItem(bookCollections, JSON.stringify(books));

  window.dispatchEvent(refreshList);

  resetInput();
}

const bookFormInput = document.querySelector("#inputBook");
bookFormInput.addEventListener("submit", submitBook);

// LISTEN EVENT
window.addEventListener(REFRESH_EVENT, loadBookList);

// TRIGGER EVENT LOAD ON FIRST OPEN
window.addEventListener("load", function () {
  this.window.dispatchEvent(refreshList);
});
