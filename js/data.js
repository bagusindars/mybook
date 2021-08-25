const STORAGE_KEY = "my_tasks";

let books = [];
let booksSearch = [];

 function isStorageExist(){
      if (typeof Storage === undefined) {
           alert("Browser tidak mendukung local storage");
           return false;
      }
      return true;
}


function createObject(title,author,year,isFinished){
       return {
              id: +new Date(),
              title,
              author,
              year,
              isComplete: isFinished
       }
}

function updateDataStorage(){
       if(isStorageExist()){
              saveDataStorage();
       }
}

function saveDataStorage(){
       const dataJson = JSON.stringify(books);
       localStorage.setItem(STORAGE_KEY,dataJson);
}

function loadDataStorage(){
       let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

       if(data !== null) books = data;

       document.dispatchEvent(new Event("ondataloaded"));
}

function findBook(taskId){
       for (book of books) {
            if (book.id === taskId) return book;
       }

       return null;
}

function searchBookByTitle(text){
       booksSearch = books;
       return booksSearch.filter(
            (book) =>
                 book.title.toLowerCase().includes(text.toLowerCase()) ||
                 book.author.toLowerCase().includes(text.toLowerCase()) ||
                 book.year.toLowerCase().includes(text.toLowerCase())
       );
}

function findBookIndex(taskId){
       let index = 0;
       for (book of books) {
              if (book.id === taskId) return index;
              index++;
       }

       return -1;
}