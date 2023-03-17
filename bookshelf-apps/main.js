const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "DATA_BUKU";

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function generateId() {
  return +new Date();
}

function findTitle(bookTitle) {
  for (const bookItem of books) {
    if (bookItem.title === bookTitle) {
      return bookItem;
    }
  }
  return null;
}
function findAuthor(bookAuthor) {
  for (const bookItem of books) {
    if (bookItem.author === bookAuthor) {
      return bookItem;
    }
  }
  return null;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const textTitle = document.createElement("h2");
  textTitle.innerText = title;

  const textAuthor = document.createElement("h3");
  textAuthor.innerText = "Author : " + author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun : " + year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(textContainer);
  container.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.innerText = "Unfinished Read";
    author.id = generateId.id,
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Delete";
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.innerText = "Finish Read";
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addBookToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Delete";
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBook() {
  const textId = document.getElementById("idBook").value;
  const textTitle = document.getElementById("title").value;
  const textAuthor = document.getElementById("author").value;
  const textYear = document.getElementById("year").value;
  const readed = document.getElementById("inputBookIsComplete").checked;

  if (textId == "") {
    const generatedID = generateId();

    const bookObject = generateBookObject(
      generatedID,
      textTitle,
      textAuthor,
      textYear,
      readed
    );
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
  } else {
    const bookData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const index = findBookIndex(textId);

    bookData[index].title = textTitle;
    bookData[index].author = textAuthor;
    bookData[index].year = textYear;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
    document.dispatchEvent(new Event(RENDER_EVENT));
    location.reload()
  }
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }


function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById("books");
  const listCompleted = document.getElementById("completed-books");

  uncompletedBOOKList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});

const btnSearch = document.querySelector("#btn-search");

btnSearch.addEventListener("click", function (event) {
  const textSearch = document.getElementById("search").value;
  const searchForm = document.getElementById("form-search");
  const searchResult = document.getElementById("searchSection");
  console.log(textSearch);
  event.preventDefault();
  if (textSearch == "") {
    showSearchResult(null);
  } else {
    if (findTitle(textSearch)) {
      showSearchResult(findTitle(textSearch));
    } else if (findAuthor(textSearch)) {
      showSearchResult(findAuthor(textSearch));
    } else {
      searchResult.innerHTML = "";
      alert(textSearch + " oops, your search was not found! ");
    }
  }
  searchForm.reset();
});

function showSearchResult(bookObject) {
  const searchResult = document.getElementById("searchSection");

  if (bookObject == null) {
    searchResult.innerHTML = "";
  } else {
    searchResult.innerHTML = "";
    const { id, title, author, year, isCompleted } = bookObject;

    const textTitle = document.createElement("h2");
    textTitle.innerText = title;

    const textAuthor = document.createElement("h3");
    textAuthor.innerText = "Author : " + author;

    const textYear = document.createElement("p");
    textYear.innerText = "Tahun : " + year;

    const keterangan = document.createElement("p");
    if (isCompleted) {
      keterangan.innerText = "Finished Read";
    } else {
      keterangan.innerText = "Unfinished Read";
    }

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textAuthor, textYear, keterangan);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `book-${id}`);
    searchResult.append(container);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  const form = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    form.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
