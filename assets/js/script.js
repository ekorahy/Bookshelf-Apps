// function menu icon to make header responsive
function iconMenu() {
    const nav = document.getElementById("nav-links");
    if (nav.style.display === "block") {
        nav.style.display = "none";
    } else {
        nav.style.display = "block";
    }
}

// function to change text bookshelf from button form input
function changeBookshelfText(){
    let isComplete = document.getElementById("inputBookIsComplete");
    let bookshelfText = document.getElementById("bookshelfText");
    if (isComplete.checked == true) {
        bookshelfText.innerText = "Selesai dibaca";
    } else {
        bookshelfText.innerText = "Belum selesai dibaca";
    }
}

// main section
const booksData = [];
const RENDER_EVENT = "render-data";

document.addEventListener(RENDER_EVENT, function() {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    incompleteBookshelfList.innerHTML = "";
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    completeBookshelfList.innerHTML = "";
    for (dataItem of booksData) {
        const dataElement = makeBookData(dataItem);
        if(dataItem.isComplete == false){
            incompleteBookshelfList.append(dataElement);
        } else {
            completeBookshelfList.append(dataElement);
        } 
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addBookData();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBookData() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookisComplete = document.getElementById("inputBookIsComplete").checked;
    const generateID = generateId();
    const dataObject = generateDataObject(generateID, bookTitle, bookAuthor, bookYear, bookisComplete);
    booksData.push(dataObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateDataObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function makeBookData(dataObject) {
    const textTitle = document.createElement("h3");
    textTitle.classList.add("titleItem");
    textTitle.innerText = dataObject.title;
    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Penulis: "+dataObject.author;
    const textYear = document.createElement("p");
    textYear.innerText = "Tahun: "+dataObject.year;
    const greenButton = document.createElement("button");
    greenButton.classList.add("green");
    const redButton = document.createElement("button");
    redButton.classList.add("red");
    redButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i> Hapus';
    const action = document.createElement("div");
    action.classList.add("action");
    action.append(greenButton, redButton);
    const articleBookItem = document.createElement("div");
    articleBookItem.classList.add("book_item");
    articleBookItem.append(textTitle, textAuthor, textYear, action);
    articleBookItem.setAttribute("id", `data-${dataObject.id}`);
    if (dataObject.isComplete) {
        greenButton.innerHTML = '<i class="fa fa-undo" aria-hidden="true"></i> Belum selesai dibaca';
        greenButton.addEventListener("click", function() {
            notFinishedReading(dataObject.id);
        });
        redButton.addEventListener("click", function() {
            deleteBook(dataObject.id);
            alert("Data Buku dengan Judul: "+dataObject.title+", Penulis: "+dataObject.author+
            ", Tahun: "+dataObject.year+". Berhasil Dihapus!");
        });
    } else {
        greenButton.innerHTML = '<i class="fa fa-check-circle" aria-hidden="true"></i> Selesai dibaca';
        greenButton.addEventListener("click", function() {
            finishedReading(dataObject.id);
        });
        redButton.addEventListener("click", function() {
            deleteBook(dataObject.id);
            alert("Data Buku dengan Judul: "+dataObject.title+", Penulis: "+dataObject.author+
            ", Tahun: "+dataObject.year+". Berhasil Dihapus!");
        });
    }
    return articleBookItem;
}

function finishedReading(dataId) {
    const dataTarget = findData(dataId);
    if (dataTarget == null) return;
    dataTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function notFinishedReading(dataId) {
    const dataTarget = findData(dataId);
    if(dataTarget == null) return;
    dataTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBook(dataId) {
    const dataTarget = findDataIndex(dataId);
    if (dataTarget === -1) return;
    booksData.splice(dataTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findData(dataId) {
    for (dataItem of booksData) {
        if (dataItem.id === dataId) {
            return dataItem;
        }
    }
    return null;
}

function findDataIndex(dataId) {
    for (index in booksData) {
        if (booksData[index].id === dataId) {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(booksData);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

// local storage section
const SAVED_EVENT = "saved-bookdata";
const STORAGE_KEY = "bookshelf_apps";

function isStorageExist() {
    if(typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if(data != null) {
        for (book of data) {
            booksData.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// search book data section
document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("searchBook");
    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        searchData();
    });
});

function searchData(){
    const textJudul = document.getElementById("searchBookTitle").value;
    let book_item = document.getElementsByClassName("book_item");
    const titleItem = document.getElementsByClassName("titleItem");
    for(index in booksData) {
        if (titleItem[index].innerHTML.indexOf(textJudul) == -1) {
            book_item[index].style.display = "none";
        } else {
            book_item[index].style.display = "block";
        }
    }
}