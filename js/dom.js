const FINISH_READING = "finish_reading_list";
const UNFINISH_READING = "unfinish_reading_list";
const ITEM_ID = "itemId";
let isEdit = false;
let editElement;
let editArray = [];

function loadDataComponent(){
          
       if(books.length > 0){
              for (book of books) {
                     
                     const box = document.getElementById( book.isComplete ? FINISH_READING : UNFINISH_READING);
                     const data = createData(
                            book.title,
                            book.author,
                            book.year,
                            book.isComplete
                     );
                     data[ITEM_ID] = book.id;
                     box.append(data);
              }

       }
       checkEmptyData();
       
}

function checkEmptyData(){
       const finishDiv = document.getElementById(FINISH_READING);
       const unfinishDiv = document.getElementById(UNFINISH_READING);

      

       if(unfinishDiv.childElementCount <= 0 ){
              emptyComponent(unfinishDiv);
       }else{
              const emptyDiv = unfinishDiv.getElementsByClassName("empty-card")[0];

              if(emptyDiv && unfinishDiv.childElementCount > 1){
                     emptyDiv.remove();
              }
       }

       if (finishDiv.childElementCount <= 0) {
            emptyComponent(finishDiv);
       } else {
              const emptyDiv = finishDiv.getElementsByClassName("empty-card")[0];
              if (emptyDiv && finishDiv.childElementCount > 1) {
                     emptyDiv.remove();
              }
       }

}

function emptyComponent(el) {
     const card = document.createElement("div");
     card.classList.add("card","empty-card");
     card.innerText = "Data Kosong";
     el.append(card);
}



function submitform(){
       const title = document.getElementById("title").value;
       const author = document.getElementById("author").value;
       const year = document.getElementById("year").value;
       const isFinished = document.getElementById("isFinished").checked;
       const box = document.getElementById(isFinished ? FINISH_READING : UNFINISH_READING );
       let btnSubmit = document.getElementById("btnSubmit");

       const listData = createData(title, author, year, isFinished);

       if(isEdit){
              editArray.title = title;
              editArray.author = author;
              editArray.year = year;
              editArray.isComplete = isFinished;
              listData[ITEM_ID] = editArray.id;
              editElement.remove();

              const btnCancel = document.getElementsByClassName("btn-cancel")[0].remove();
              isEdit = false;
              btnSubmit.innerText = "Tambah Buku";

       }else{
              const listDataObject = createObject(title, author, year, isFinished);
              listData[ITEM_ID] = listDataObject.id;
              books.push(listDataObject);
       }
       box.append(listData);

      
       updateDataStorage();
       checkEmptyData();

}

function createData(title,author,year,isFinished){

     //inside div header
     const titleText = document.createElement("h4");
     titleText.classList.add("book-judul");
     titleText.innerText = `${title} - ${year}`;


     const editBtn = document.createElement("i");
     editBtn.classList.add("bi","bi-pencil-fill","editBtn");
     editBtn.addEventListener("click", function(e) {
            isEdit = true;
            let btnSubmit = document.getElementById("btnSubmit");
            btnSubmit.innerText = "Edit";
            editTask(e.target.parentElement.parentElement);
     });

     const headerDiv = document.createElement("div");
     headerDiv.classList.add("header");
     headerDiv.append(titleText, editBtn);

     //author inside card div
     const authorText = document.createElement("p");
     authorText.classList.add("book-penulis");
     authorText.innerText = author;

     //inside div button
     const buttonDiv = document.createElement("div");
     buttonDiv.classList.add("button");

     if (isFinished) {
          buttonDiv.append(createUnCheckButton(), createDeleteButton());
     } else {
          buttonDiv.append(createCheckButton(), createDeleteButton());
     }

     //create div card outer div
     const card = document.createElement("div");
     card.classList.add("card");
     card.append(headerDiv, authorText, buttonDiv);

     return card;
}


function createCheckButton(){
       return createButton("checkBtn",function(e) {
              moveTask(e.target.parentElement.parentElement,"moveToComplete");
       })
}

function createUnCheckButton() {
     return createButton("unCheckBtn", function (e) {
              moveTask(e.target.parentElement.parentElement, "moveToUnComplete");
     });
}

function createDeleteButton() {
     return createButton("deleteBtn", function (e) {
            deleteTask(e.target.parentElement.parentElement);
     });
}

function createCancelButton(){
       const checkCancelBtn = document.getElementsByClassName("btn-cancel")[0];

       if (isEdit && !checkCancelBtn) {
              const submitForm = document.getElementById("form")

            const cancelBtn = document.createElement("button");
            cancelBtn.classList.add("btn", "btn-cancel");
            cancelBtn.setAttribute("type","reset");
            cancelBtn.innerText = "Batal";

              cancelBtn.addEventListener("click", function (event) {
                     isEdit = false;
                   let btnSubmit = document.getElementById("btnSubmit");
                   btnSubmit.innerText = "Tambah Buku";
                   submitForm.reset();
                   this.remove();
              });

            const formbtnDiv = document.getElementById("form-button");
            formbtnDiv.insertBefore(cancelBtn, formbtnDiv.firstChild);
            
       }

}

function removeCancelButton(){
       isEdit = false;
       const cancelBtn = document.getElementsByClassName("btn-cancel")[0];
       cancelBtn.remove();
       const submitForm = document.getElementById("form")
       submitForm.reset();
       let btnSubmit = document.getElementById("btnSubmit");
       btnSubmit.innerText = "Tambah Buku";
}

function createButton(btnClass , e){
       const btn = document.createElement("button");
       btn.classList.add(btnClass,"btn");

       if(btnClass == "checkBtn" || btnClass == "unCheckBtn"){
              btn.classList.add("btn-primary");
              btn.innerText = (btnClass == "checkBtn") ? "Selesai Baca" : "Belum Selesai Baca";
       }else{
              btn.classList.add("btn-danger");
              btn.innerText = "Hapus"
       }

       btn.addEventListener("click",function(event){
              if(isEdit){
                     removeCancelButton();
              }
              e(event);
              event.stopPropagation();
       })

       return btn;
}



function moveTask(task,destination){

       let div,isComplete;
       const book = findBook(task[ITEM_ID]);

       if(destination == "moveToComplete"){
              div = document.getElementById(FINISH_READING);
              isComplete = true;
       }else if(destination == "moveToUnComplete"){
              div = document.getElementById(UNFINISH_READING);
              isComplete = false;
       }

       const newBook = createData(book.title, book.author, book.year, isComplete);

       book.isComplete = isComplete;
       newBook[ITEM_ID] = book.id;

       div.append(newBook);
       task.remove();

       updateDataStorage();
       checkEmptyData();
}

function editTask(task){
       editArray = findBook(task[ITEM_ID]);
       editElement = task;
       const titleText = document.getElementById("title");
       titleText.value = editArray.title;

       const authorText = document.getElementById("author");
       authorText.value = editArray.author;

       const yearText = document.getElementById("year");
       yearText.value = editArray.year;

       const isFinished = document.getElementById("isFinished");
       isFinished.checked = editArray.isComplete;

       createCancelButton();



}



function deleteTask(task){
       const position = findBookIndex(task[ITEM_ID]);
       books.splice(position,1);

       task.remove();
       updateDataStorage();
       checkEmptyData();
}


function searchform(text){
       const finishDiv = document.getElementById(FINISH_READING);
       const unfinishDiv = document.getElementById(UNFINISH_READING);

       finishDiv.innerHTML = "";
       unfinishDiv.innerHTML = "";

       let searching = searchBookByTitle(text);
       
       for(book of searching){
              const searchBook = createData(book.title,book.author,book.year,book.isComplete);
              searchBook[ITEM_ID] = book.id;
              book.isComplete ? finishDiv.append(searchBook) : unfinishDiv.append(searchBook);
       }
       checkEmptyData();

}