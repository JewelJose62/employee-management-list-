let globalEmployeeArray = [];

// add employee button
let empAddBtn = document.getElementById("empAddBtn")
let addEmployeeModal = document.getElementById("addEmployeeModal")

// edit employee form
const form = document.getElementById('edit_employee');

// handle search input
const searchInput = document.getElementById("search");


document.addEventListener('DOMContentLoaded', () => {  

  // get employees from database and list it on the table
  async function fetchEmployees() {

    try {
      const response = await fetch(`http://localhost:3000/employees`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const employees = await response.json();
     
      globalEmployeeArray = employees
      totalRows = globalEmployeeArray.length;
      startIndex = (currentPage - 1) * rowsPerPage;
       endIndex = startIndex + rowsPerPage;
      displayPaginationTable(globalEmployeeArray,startIndex,endIndex)


    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  }

  fetchEmployees()


})


// clear form 

const f = document.getElementById("add_employee")
function clearForm (){
    let input = f . querySelectorAll("input");
    input.forEach((x)=>{
     x.style.setProperty("border-color","#b2bab0")
    })

    let span = f.querySelectorAll("span")
    span.forEach((x)=>{
        x.style.display="none";
    })
    const select = document.querySelectorAll("select")
    select.forEach((x)=>{
        x.style.setProperty("border-color","#b2bab0")
    })

}

const addCancelBtn = document.getElementById("addCancelBtn")

addCancelBtn.addEventListener("click",()=>{
    clearForm();
    add_employee.reset();
})

// pagination part
let rowsPerPage = 5;
  let currentPage = 1;
  let totalRows = globalEmployeeArray.length;

// calculate the total number of pages 
  let totalPages = Math.ceil(totalRows/rowsPerPage)

// Calculate the start and end indices
  let startIndex = (currentPage - 1) * rowsPerPage;
  let endIndex = startIndex + rowsPerPage;


  let prevBtn = document.getElementById('prevBtn');
  let nextBtn = document.getElementById('nextBtn');
  let initialRows = document.getElementById('rowsPerPage')
  
console.log();

function displayPaginationTable(employeeArray,start,end) {
   
    displayEmployees(employeeArray.slice(start,end))
}

function updatePaginationBtn(){
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

  // Previous button functionality
  prevBtn.onclick = () => {
    if (currentPage > 1) {  
      currentPage--;
       startIndex = (currentPage - 1) * rowsPerPage;
       endIndex = startIndex + rowsPerPage;
       displayPaginationTable(globalEmployeeArray,startIndex,endIndex)
       updatePaginationBtn();
    }
  };

  // Next button functionality
nextBtn.onclick = () => {
 
     if(currentPage < Math.ceil(totalRows/rowsPerPage)){
       currentPage++;
       startIndex = (currentPage - 1) * rowsPerPage;
       endIndex = startIndex + rowsPerPage;
       displayPaginationTable(globalEmployeeArray,startIndex,endIndex)
       updatePaginationBtn();
     
    }
  };

     
// // Function to handle page changes
function changePage(page) {
   currentPage = page;
  startIndex = (page - 1) * rowsPerPage;
  endIndex = parseInt(startIndex) + parseInt(rowsPerPage);
  console.log(globalEmployeeArray);
  
  displayPaginationTable(globalEmployeeArray,startIndex,endIndex)
  updatePaginationBtn();
 }



function displayPagButtons() {
   
  const paginationContainer = document.getElementById('paglistBtnContainer');
  // let totalButtons = totalRows/ rowsPerPage
  totalPages = Math.ceil(totalRows/rowsPerPage);
  paginationContainer.innerHTML = ''
 
     // Dynamically create buttons using innerHTML
     for (let i = 0; i < totalPages; i++) {
         paginationContainer.innerHTML += `
         <button onclick="changePage(${i + 1})">${i + 1}</button>
     `;
    }
    updatePaginationBtn();
}

// // handle page list entries
function changePageSize() {
   
  rowsPerPage = document.getElementById('rowsPerPage').value;
  let startIndex = (currentPage - 1) * rowsPerPage;
  let endIndex = startIndex + rowsPerPage; 
  totalPages = Math.ceil(totalRows/rowsPerPage);
  rowsPerPage = parseInt(initialRows.value)
  currentPage = 1; 
 
  displayPaginationTable(globalEmployeeArray,startIndex,endIndex)  
  displayPagButtons();
  updatePaginationBtn();

}

displayPaginationTable(globalEmployeeArray,startIndex,endIndex);
displayPagButtons();
updatePaginationBtn();

  //   display employees in table
  function displayEmployees(dataArray) {
 
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    dataArray.forEach((employee, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td scope="row">#${index + 1}</td>
            <input hidden id="userId" value="${employee.id}" />
           
            <td>
            <img src="http://localhost:3000/employees/${employee.id}/avatar" style="border-radius:50%" width="35" height="35" alt="image">
            ${employee.salutation} ${employee.firstName} ${employee.lastName}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>${employee.gender}</td>
            <td>${employee.dob}</td>
            <td>${employee.country}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis text-primary"></i>
                    </button>
                    <ul class="dropdown-menu rounded-4">
                        <li><button class="dropdown-item" type="button" id="viewDetails${employee.id}"><i class="fa-regular px-2 fa-eye"></i> View Details</button></li>
                        <li><button class="dropdown-item" type="button" id="editBtn${employee.id}"><i class="fa-solid px-2 fa-pen"></i> Edit</button></li>
                        <li><button class="dropdown-item" type="button"  id="deleteBtn${employee.id}"><i class="fa-regular px-2 fa-trash-can"></i> Delete</button></li>
                    </ul>
                </div>
            </td>
        `;
      tableBody.appendChild(row);


      // Set the delete event handler programmatically
      const deleteButton = document.getElementById(`deleteBtn${employee.id}`);
      deleteButton.addEventListener('click', function () {
        openDeleteEmployeePopup(employee.id)
      });

      // Set the edit event handler programmatically
      const editButton = document.getElementById(`editBtn${employee.id}`);
      editButton.addEventListener('click', function () {
        displayEditEmployeeData(employee.id)
      });

      // set the view event handler progra,atically
      const viewDetailsBtn = document.getElementById(`viewDetails${employee.id}`);
      viewDetailsBtn.addEventListener('click', function () {
        viewEmployeeDetails(employee.id);
      });

    });

    // call pagination buttons rendering function
    displayPagButtons()
   
}
 


// Handle search input
searchInput.addEventListener("keyup", () => {
  const query = searchInput.value.toLowerCase();
  
  let filteredEmployeeArray = globalEmployeeArray; // Default to the full employee array
  
  // If a query is provided, filter the employee array
  if (query) {
      filteredEmployeeArray = globalEmployeeArray.filter(employee =>
          employee.firstName.toLowerCase().includes(query) ||
          employee.lastName.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query) ||
          employee.phone.includes(query)
      );
  }

  // Update total rows and pages based on filtered data
  totalRows = filteredEmployeeArray.length;
  totalPages = Math.ceil(totalRows / rowsPerPage);
  
  // Reset currentPage to 1 if we're on a page that no longer exists due to filtering
  if (currentPage > totalPages) {
      currentPage = totalPages;
  }

  // Calculate the start and end indices based on the current page
  startIndex = (currentPage - 1) * rowsPerPage;
  endIndex = startIndex + rowsPerPage;

  // Display the filtered employees on the current page
  displayPaginationTable(filteredEmployeeArray, startIndex, endIndex);
  
  // Update pagination buttons to reflect the correct state
  displayPagButtons();
  updatePaginationBtn();
});


function openAddEmployeeModal(){
    addEmployeeModal.style.display="block";
}

function closeAddEmployeeModal(){
    addEmployeeModal.style.display="none";
    clearForm();
}


function getAddFormData (){

let salutationAddInp = document.getElementById("salutationAddInp")
let firstNameAddInp = document.getElementById("firstNameAddInp")
let lastNameAddInp = document.getElementById("lastNameAddInp")
let emailAddInp = document.getElementById("emailAddInp")
let mobileAddInp = document.getElementById("mobileAddInp")
let dobAddInp = document.getElementById("dobAddInp")
let maleAddInp = document.getElementById("maleAddInp")
let femaleAddInp = document.getElementById("femaleAddInp")
let qualificationAddInp= document.getElementById("qualificationAddInp")
let addressAddInp = document.getElementById("addressAddInp")
let countryAddInp = document.getElementById("countryAddInp")
let stateAddInp = document.getElementById("stateAddInp")
let cityAddInp = document.getElementById("cityAddInp")
let pinAddInp = document.getElementById("pinAddInp")
let usernameAddInp = document.getElementById("usernameAddInp")
let passwordAddInp = document.getElementById("passwordAddInp")
let genderAddInp = document.getElementById("gender")
   
    let file = null;
    const fileInput = document.getElementById("addEmployeeImage");
    file = fileInput?.files[0];  
    
  let addFormData = {
    salutationInp: salutationAddInp,
    firstNameInp: firstNameAddInp,
    lastNameInp: lastNameAddInp,
    emailInp: emailAddInp,
    mobileInp : mobileAddInp,
    dobInp: dobAddInp,
    genderInp: genderAddInp,
    maleInp:maleAddInp,
    femaleInp:femaleAddInp,
    qualificationInp: qualificationAddInp,
    addressInp: addressAddInp,
    countryInp: countryAddInp,
    stateInp: stateAddInp,
    cityInp: cityAddInp,
    pinInp: pinAddInp,
    usernameInp: usernameAddInp,
    passwordInp: passwordAddInp,  
  }
  formValidationData(addFormData,file,isAddForm = true)

}

//form submitting
async function submitFormData(dataObj,image) {
 console.log(dataObj);
 
  try{
     
   let response = await  fetch('http://localhost:3000/employees', {
    method: 'POST',
    body: JSON.stringify(dataObj),
     headers: {
        "Content-Type": "application/json"
     }
  })
   let data = await response.json();

   if(data.id){
        let updatedEmployee;
        if (image) {
            uploadImage(data.id, image)
            updatedEmployee = {
              id: data.id,
                image,
              ...dataObj
            }
        } else {
           updatedEmployee = {
             id:data.id,
             ...dataObj
           }
        }
       
       closeAddEmployeeModal();
       globalEmployeeArray.push(updatedEmployee)
       displayPaginationTable(globalEmployeeArray,startIndex,endIndex)
   }
     
  } catch(error){
    console.log(error);
  }
}

// formate and return dob in desired format
function convertDateFormat(date) {

  const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (regex.test(date)) {
    const [, day, month, year] = date.match(regex);
    return `${year}-${month}-${day}`;
  } else {
    return date;
  }
}

function formValidationData(data,image,isAddForm){
    let isValid = true; 
   
  
// salutation validation
const salutationRegex = /^(Mr|Mrs|Ms|Dr|Prof|Mx)$/


if(!salutationRegex.test(data.salutationInp.value)){
   validationerror(data.salutationInp,"please enter your salutation")   
    isValid=false    
}else{
 validationsuccess(data.salutationInp,"success")
}


// firstname validation
const firstNameRegex = /^[a-zA-Z]{2,50}$/;
if (!firstNameRegex.test(data.firstNameInp.value)) {
    validationerror(data.firstNameInp, "please enter your first name")
    isValid = false
}
else {
    validationsuccess(data.firstNameInp, "success")
  }


//   lastName validation
const lastNameRegex = /^[a-zA-Z]{1,50}$/;
if(!lastNameRegex.test(data.lastNameInp.value)){
    validationerror(data.lastNameInp,"please enter your last name")
    isValid = false
}else{
    validationsuccess(data.lastNameInp,"success")
}


// email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailRegex.test(data.emailInp.value)){
    validationerror(data.emailInp,"please enter your email")
    isValid = false
}else{
    validationsuccess(data.emailInp,"success")
}


// phone validation
const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
if(!phoneRegex.test(data.mobileInp.value)){
    validationerror(data.mobileInp,"please enter your phone number")
    isValid=false
}else{
    validationsuccess(data.mobileInp,"success")
}

//address validation
const addressRegex = /^[a-zA-Z0-9\s,.'#-]{5,}$/;
if(!addressRegex.test(data.addressInp.value)){
    validationerror(data.addressInp,"please enter your address")
    isValid=false
}else{
    validationsuccess(data.addressInp,"success")
}

//qualification validation
const qualificationsRegex = /^[a-zA-Z0-9\s,.'-]{2,50}$/;
if(!qualificationsRegex.test(data.qualificationInp.value)){
    validationerror(data.qualificationInp,"please enter your qualification")
    isValid=false
}else{
    validationsuccess(data.qualificationInp,"success")
}

//dob validation
const dobRegex = /^\d{4}-\d{2}-\d{2}$/

if(!dobRegex.test(data.dobInp.value)){
    validationerror(data.dobInp,"please enter your date of birth")
    isValid = false
    // console.log(data.dobInp.value);
    
}

// country validation
if(data.countryInp.value == 0 ){
  validationerror(data.countryInp,"please enter your country")
  isValid=false
  
}else{
  validationsuccess(data.countryInp,"success")
}

// gender validation
var gender;
if(data.femaleInp.checked || data.maleInp.checked){ 
  gender = data.femaleInp.checked ? 'female' : 'male'
  validationsuccess(data.genderInp,'success')
}else{
  validationerror(data.genderInp,"please select your gender")
  isValid = false
}


// state validation
if (data.stateInp.value == 0) {
  validationerror(data.stateInp, "enter your state")
  isValid = false
}
else {
  validationsuccess(data.stateInp, "success")
}

// pin validation
const pinRegex = /^[1-9][0-9]{5}$/;
if(!pinRegex.test(data.pinInp.value)){
    validationerror(data.pinInp,"please enter your pin")
    isValid=false
}else{
    validationsuccess(data.pinInp,"success")
}

//city validation
const cityRegex = /^[A-Za-z\s.'-]+$/;
if(!cityRegex.test(data.cityInp.value)){
    validationerror(data.cityInp,"please enter your city")
    isValid=false
}else{
    validationsuccess(data.cityInp,"success")
}

//username validation
const usernameRegex = /^[a-zA-Z0-9_\.]+$/;
if(!usernameRegex.test(data.usernameInp.value)){
    validationerror(data.usernameInp,"please enter your username")
    isValid=false
}else{
    validationsuccess(data.usernameInp,"success")
}

//password validation
const passwordRegex = /^[A-Za-z0-9]{6,}$/;
if(!passwordRegex.test(data.passwordInp.value)){
    validationerror(data.passwordInp,"please enter your pssword")
    isValid=false
}else{
    validationsuccess(data.passwordInp,"success")
}


if(isValid){

  let addFormData = {
    salutation: data.salutationInp.value,
    firstName: data.firstNameInp.value,
    lastName: data.lastNameInp.value,
    email: data.emailInp.value,
    phone : data.mobileInp.value,
    dob: convertDateFormat(data.dobInp.value).split('-').reverse().join('-'),
    qualifications: data.qualificationInp.value,
    address: data.addressInp.value,
    country: data.countryInp.value,
    state: data.stateInp.value,
    city: data.cityInp.value,
    pin: data.pinInp.value,
    username: data.usernameInp.value,
    password: data.passwordInp.value,  
    gender
  }
    
  if(isAddForm){
    submitFormData(addFormData,image);
  }else{
    let id = data.id
    submitEditEmployeeData(id,addFormData,image)
  }
   
}

}

function validationerror(input, message) {

    const info = input.parentElement
    const span = info.querySelector("span")
    span.innerHTML = message;
    span.style.color = "red";
    input.style.setProperty('border-color', 'red')
    span.style.display = "block";
}
 
function validationsuccess(input, message) {
    // console.log(input, message);

}

// get employee details using employeeId
async function editEmployeeFormData(employeeId) {
   
        try {
          const response = await fetch(`http://localhost:3000/employees/${employeeId}`);
          const data = await response.json();
         
          return data
   
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
}

// close edit employee modal
function closeEditEmployeeModalFunction(){
    let editEmployeeModal = document.getElementById("editEmployeeModal")
    editEmployeeModal.style.display = "none"
}

// display data of edit employee
async function displayEditEmployeeData(id){    
 
  let data = await editEmployeeFormData(id)

 //show edit form
 let editEmployeeModal = document.getElementById("editEmployeeModal")
 let closeEditEmployeeModal = document.getElementById("closeEditEmployeeModal")
 editEmployeeModal.style.display = "block"

//  get male and female gender input
let maleEditInp = document.getElementById("maleEditInp")
  let femaleEditInp = document.getElementById("femaleEditInp")
 
  if (data.gender === 'male') {
    maleEditInp.checked = true
  }
  if (data.gender === 'female') {
    femaleEditInp.checked = true
  }  
    document.getElementById("salutationEditInp").value = data.salutation
    document.getElementById("firstNameEditInp").value = data.firstName
    document.getElementById("lastNameEditInp").value = data.lastName
    document.getElementById("emailEditInp").value = data.email
    document.getElementById("mobileEditInp").value = data.phone
    document.getElementById("dobEditInp").value = convertDateFormat(data.dob)
    document.getElementById("qualificationEditInp").value = data.qualifications
    document.getElementById("addressEditInp").value = data.address
    document.getElementById("countryEditInp").value = data.country
    document.getElementById("stateEditInp").value = data.state
    document.getElementById("cityEditInp").value = data.city
    document.getElementById("pinEditInp").value = data.pin
    document.getElementById("usernameEditInp").value = data.username
    document.getElementById("passwordEditInp").value = data.password
    document.getElementById("employeeIdInp").value  = data.id
}



form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevents the form from refreshing the page
   
    // Now, call your editEmployee function to send the data with fetch
    await editEmployee();
});

async function editEmployee(){
 
 
let salutationEditInp = document.getElementById("salutationEditInp")
let firstNameEditInp = document.getElementById("firstNameEditInp")
let lastNameEditInp = document.getElementById("lastNameEditInp")
let emailEditInp = document.getElementById("emailEditInp")
let mobileEditInp = document.getElementById("mobileEditInp")
let dobEditInp = document.getElementById("dobEditInp")
let maleEditInp = document.getElementById("maleEditInp")
let genderEditInp = document.getElementById("genderEditInp")
let femaleEditInp = document.getElementById("femaleEditInp")
let qualificationEditInp= document.getElementById("qualificationEditInp")
let addressEditInp = document.getElementById("addressEditInp")
let countryEditInp = document.getElementById("countryEditInp")
let stateEditInp = document.getElementById("stateEditInp")
let cityEditInp = document.getElementById("cityEditInp")
let pinEditInp = document.getElementById("pinEditInp")
let usernameEditInp = document.getElementById("usernameEditInp")
let passwordEditInp = document.getElementById("passwordEditInp")
 
  
 let file = null;
 const fileInput = document.getElementById("editEmployeeImage");
 file = fileInput?.files[0];

// hidden input to get employee id
let employeeId = document.getElementById("employeeIdInp").value

const updatedEmployeeData = {
    id: employeeId,
    salutationInp: salutationEditInp,
    firstNameInp: firstNameEditInp,
    lastNameInp: lastNameEditInp,
    emailInp: emailEditInp,
    mobileInp: mobileEditInp,
    dobInp: dobEditInp,
    genderInp: genderEditInp,
    maleInp:maleEditInp,
    femaleInp:femaleEditInp,
    qualificationInp: qualificationEditInp,
    addressInp: addressEditInp,
    countryInp: countryEditInp,
    stateInp: stateEditInp,
    cityInp: cityEditInp,
    pinInp: pinEditInp,
    usernameInp: usernameEditInp,
    passwordInp: passwordEditInp,
 };
   
   
   formValidationData(updatedEmployeeData,file,false)

}

async function submitEditEmployeeData(employeeId,updatedEmployeeData,image){
 
  
    try {
        // Send PUT request to the server
        const response = await fetch(`http://localhost:3000/employees/${employeeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Indicate that you're sending JSON data
            },
            body: JSON.stringify(updatedEmployeeData), // Convert the data object to JSON
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
   
        const data = await response.json();
        if (data) {
            let updatedEmployee;
            if (image) {
                uploadImage(employeeId, image)
                 updatedEmployee = {
                   id:employeeId,
                 ...updatedEmployeeData
                }
              } else {
                updatedEmployee = {
                id:employeeId,
                image,
                ...updatedEmployeeData
               }
             }
           
            closeEditEmployeeModalFunction()
            let newIndex = globalEmployeeArray.findIndex(el=>el.id===employeeId)
            globalEmployeeArray[newIndex] = updatedEmployee
            displayPaginationTable(globalEmployeeArray,startIndex,endIndex)
            displayEmployeeDetails(employeeId)
       }

    
   
    } catch (error) {
        console.error("Error updating employee data:", error);
        // Optionally, show an error message to the user
    }
   
}

// uploading image
async function uploadImage(employeeId, image) {
   
    try {
        const formData = new FormData();
        formData.append("avatar", image)

        const response = await fetch(`http://localhost:3000/employees/${employeeId}/avatar`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
     
   
    } catch (error) {
        console.log(error);
    }
}

// delete employeee data using id
async function deleteEmployee(userId) {    
    try {
      const response = await fetch(`http://localhost:3000/employees/${userId}`,{method:"DELETE"});
      if (!response.ok) {
        throw new Error("HTTP error! status: ${response.status}");
      }
      const data = await response.json();
     
      const filteredArray = globalEmployeeArray.filter(el=>el.id !== userId)
    
        closeDeleteEmployeePopup()
        globalEmployeeArray = filteredArray
        displayPaginationTable(globalEmployeeArray,startIndex,endIndex)

    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
}

// view employee table
function viewEmployeeTable(id) {
   document.getElementById('viewDetailBox').style.display = "none"
   document.getElementById('employeeTableBox').style.display="block"
}


// view details form
function viewEmployeeDetails(id){
   
  document.getElementById('viewDetailBox').style.display = "block"
  document.getElementById('employeeTableBox').style.display="none"
 
  displayEmployeeDetails(id)
 
}

// age calculator using Dob
function calculateAge(dob) {
    const birthDate = new Date(convertDateFormat(dob));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
   
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    return age;
}

// view employee details in form
async function displayEmployeeDetails(id) {

  // fetching employee data from server
  // let data = await editEmployeeFormData(id)
 
  // get employee data from global employee array
  let data = globalEmployeeArray.find(employee => employee.id === id);

   
    // set  is as data attribute for view detail box
    let viewDetailBox = document.getElementById('viewDetailBox')
    viewDetailBox.setAttribute('data-id', data.id)

    // set  is as data attribute for delete popup
    let deleteEmployeePopup = document.getElementById('viewDetailEmployeeDeleteBox')
    deleteEmployeePopup.setAttribute('data-id', data.id)

    document.getElementById("avatarViewInp").src = `http://localhost:3000/employees/${data.id}/avatar`
    document.getElementById("salutationViewInp").textContent = data.salutation
    document.getElementById("nameViewInp").textContent = data.firstName + data.lastName
    document.getElementById("emailViewInp").textContent = data.email
    document.getElementById("mobileViewInp").textContent = data.phone
    document.getElementById("dobViewInp").textContent = convertDateFormat(data.dob)
    document.getElementById("ageViewInp").textContent = calculateAge(data.dob)
    document.getElementById("genderViewInp").textContent =data.gender
    document.getElementById("qualificationViewInp").textContent = data.qualifications
    document.getElementById("addressViewInp").textContent = data.address
    document.getElementById("usernameViewInp").textContent = data.username

 
}

// close delete employee popup
function closeDeleteEmployeePopup() {
  document.getElementById('viewDetailEmployeeDeleteBox').style.display = "none"
  document.getElementById('viewDetailBox').style.display = "none"
  document.getElementById('employeeTableBox').style.display="block"
}

// open delete employee popup
function openDeleteEmployeePopup(id) {
 
    if(id) {
        let deleteEmployeePopup = document.getElementById('viewDetailEmployeeDeleteBox')
        deleteEmployeePopup.setAttribute('data-id', id)
    }
    document.getElementById('viewDetailEmployeeDeleteBox').style.display = "block"
}

// function for delete employee by getting id from data attribute and pass to actual delete function
function deleteEmployeeFromViewDetail() {
    let id = document.getElementById('viewDetailEmployeeDeleteBox').getAttribute('data-id')
    deleteEmployee(id);
   
}

// function for edit employee by getting id from data attribute and pass to actual edit popup function
function openEditEmployeePopup() {
    let id = document.getElementById('viewDetailBox').getAttribute('data-id')
    displayEditEmployeeData(id)
   
}

// Apply to multiple inputs when the dom is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // For the first form
  setupImagePreview(
    document.getElementById('addEmployeeImage'),
    document.getElementById('addImagePreviewBox'),
    document.getElementById('addImagePreview')
  );

  // For the second form
  setupImagePreview(
    document.getElementById('editEmployeeImage'),
    document.getElementById('editImagePreviewBox'),
    document.getElementById('editImagePreview')
  );
});

// function for image preview for both input
function setupImagePreview(imageInput, previewBox, previewImage) {
  imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewBox.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      previewBox.style.display = 'none';
      previewImage.src = '';
    }
  });
}