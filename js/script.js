document.addEventListener("DOMContentLoaded",function(){


       if (isStorageExist()) {
            loadDataStorage();
       }

       const submitForm = document.getElementById("form")
       submitForm.addEventListener("submit",function(e) {
              e.preventDefault();
              submitform();
              this.reset();
       });

       
       const searchInput = document.getElementById("searchInput");
       searchInput.addEventListener("input",function(e){
              searchform(e.target.value);
       })
       
});


document.addEventListener("ondataloaded", () => {
       loadDataComponent();
});
