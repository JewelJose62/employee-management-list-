

let globalEmployeeArray = [];
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
        deleteButton.addEventListener('click', function() {
            deleteEmployee(employee.id);
        });

        // Set the edit event handler programmatically
        const editButton = document.getElementById(`editBtn${employee.id}`);
        editButton.addEventListener('click', function() {
             editEmployeeFormData(employee.id)
        });

        // set the view event handler progra,atically
        const viewDetailsBtn = document.getElementById(`viewDetails${employee.id}`);
        viewDetailsBtn.addEventListener('click', function() {
             viewEmployeeDetails(employee.id);
        });

    });


    
  // handle search input
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("keyup", () => {
    const query = searchInput.value.toLowerCase();
    if(!query){
      
        displayEmployees(globalEmployeeArray)
    }
    else{
        const filteredEmployeeAray= globalEmployeeArray.filter(employee =>
            employee.firstName.toLowerCase().includes(query) ||
            employee.lastName.toLowerCase().includes(query) ||
            employee.email.toLowerCase().includes(query) ||
            employee.phone.includes(query)
          );

         displayEmployees(filteredEmployeeAray)
    }
    
  });
}


// get employees from databae and list it on the table
async function fetchEmployees() {
    
    try {
      const response = await fetch(`http://localhost:3000/employees`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const employees = await response.json();
     
      globalEmployeeArray = employees
      displayEmployees(employees);

    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
}
  
  
fetchEmployees()




// add employee button 
let empAddBtn = document.getElementById("empAddBtn")
let addEmployeeModal = document.getElementById("addEmployeeModal")


function openAddEmployeeModal(){
    addEmployeeModal.style.display="block";

}

function closeAddEmployeeModal(){
    addEmployeeModal.style.display="none";
}



function getAddFormData (){
   
 
let salutationAddInp = document.getElementById("salutationAddInp").value
let firstNameAddInp = document.getElementById("firstNameAddInp").value
let lastNameAddInp = document.getElementById("lastNameAddInp").value
let emailAddInp = document.getElementById("emailAddInp").value
let mobileAddInp = document.getElementById("mobileAddInp").value
let dobAddInp = document.getElementById("dobAddInp").value
let maleAddInp = document.getElementById("maleAddInp")
let femaleAddInp = document.getElementById("femaleAddInp")
let qualificationAddInp= document.getElementById("qualificationAddInp").value
let addressAddInp = document.getElementById("addressAddInp").value
let countryAddInp = document.getElementById("countryAddInp").value
let stateAddInp = document.getElementById("stateAddInp").value
let cityAddInp = document.getElementById("cityAddInp").value
let pinAddInp = document.getElementById("pinAddInp").value
let usernameAddInp = document.getElementById("usernameAddInp").value
let passwordAddInp = document.getElementById("passwordAddInp").value


let gender;
if (maleAddInp.checked == true){
    gender="male"
    }
       
    if(femaleAddInp.checked == true){
         gender="female"
    }

   
    let file = null;
    const fileInput = document.getElementById("addEmployeeImage");
     file = fileInput.files[0]; 
     console.log(file);

let addFormData = {
    salutation: salutationAddInp,
    firstName: firstNameAddInp,
    lastName: lastNameAddInp,
    email: emailAddInp,
    phone : mobileAddInp,
    dob: dobAddInp.split('-').reverse().join('-'),
    gender: gender,
    qualifications: qualificationAddInp,
    address: addressAddInp,
    country: countryAddInp,
    state: stateAddInp,
    city: cityAddInp,
    pin: pinAddInp,
    username: usernameAddInp,
    password: passwordAddInp,
    image:file
}
formValidationData(addFormData)

}

//form submitting
async function submitFormData({image,...dataObj}) {

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
    //  when data is submted
      
       
       uploadImage(data.id,image)
       closeAddEmployeeModal();
      dataObj.id = data.id
      globalEmployeeArray.push(dataObj)
      displayEmployees(globalEmployeeArray)
   }
     
  } catch(error){
    console.log(error);
    
          
    }
  }
  


function formValidationData(data){
    let isValid = true;
 

 

// salutation validation
const salutationRegex = /^(Mr|Mrs|Ms|Dr|Prof|Mx)$/
if(!salutationRegex.test(data.salutation)){
validationerror(salutationAddInp,"please enter your salutation")
    isValid=false
}else{
 validationsuccess(salutationAddInp,"success")
}


// firstname validation
const firstNameRegex = /^[a-zA-Z]{2,50}$/;
if (!firstNameRegex.test(data.firstName)) {
    validationerror(firstNameAddInp, "please enter your first name")
    isValid = false
}
else {
    validationsuccess(firstNameAddInp, "success")
  }


//   lastName validation 
const lastNameRegex = /^[a-zA-Z]{1,50}$/;
if(!lastNameRegex.test(data.lastName)){
    validationerror(lastNameAddInp,"please enter your last name")
    isValid = false
}else{
    validationsuccess(lastNameAddInp,"success")
}


// email validation 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailRegex.test(data.email)){
    validationerror(emailAddInp,"please enter your email")
    isValid = false
}else{
    validationsuccess(emailAddInp,"success")
}


// phone validation
const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
if(!phoneRegex.test(data.phone)){
    validationerror(mobileAddInp,"please enter your phone number")
    isValid=false
}else{
    validationsuccess(mobileAddInp,"success")
}

//address validation
const addressRegex = /^[a-zA-Z0-9\s,.'#-]{5,}$/;
if(!addressRegex.test(data.address)){
    validationerror(addressAddInp,"please enter your address")
    isValid=false
}else{
    validationsuccess(addressAddInp,"success")
}

//qualification validation
const qualificationsRegex = /^[a-zA-Z0-9\s,.'-]{2,50}$/;
if(!qualificationsRegex.test(data.qualifications)){
    validationerror(qualificationAddInp,"please enter your qualification")
    isValid=false
}else{
    validationsuccess(qualificationAddInp,"success")
}

//dob validation
const dobRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d\d$/;
if(!dobRegex.test(data.dob)){
    validationerror(dobAddInp,"please enter your date of birth")
    isValid = false
}


// pin validation
const pinRegex = /^[1-9][0-9]{5}$/;
if(!pinRegex.test(data.pin)){
    validationerror(pinAddInp,"please enter your pin")
    isValid=false
}else{
    validationsuccess(pinAddInp,"success")
}

//city validation
const cityRegex = /^[A-Za-z\s.'-]+$/;
if(!cityRegex.test(data.city)){
    validationerror(cityAddInp,"please enter your city")
    isValid=false
}else{
    validationsuccess(cityAddInp,"success")
}

//username validation
const usernameRegex = /^[a-zA-Z0-9_\.]+$/;
if(!usernameRegex.test(data.username)){
    validationerror(usernameAddInp,"please enter your username")
    isValid=false
}else{
    validationsuccess(usernameAddInp,"success")
}

//password validation
const passwordRegex = /^[A-Za-z0-9]{6,}$/;
if(!passwordRegex.test(data.password)){
    validationerror(passwordAddInp,"please enter your pssword")
    isValid=false
}else{
    validationsuccess(passwordAddInp,"success")
}

console.log(isValid);

if(isValid){
    submitFormData(data);
}

}



function validationerror(input, message) {
    console.log(input, message);
  
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


//  get employee details using employeeId
async function editEmployeeFormData(employeeId) {
    
        try {
          const response = await fetch(`http://localhost:3000/employees/${employeeId}`);
         
          const data = await response.json();
          
          displayEditEmployeeData(data)
    
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

function displayEditEmployeeData(data){    
   
    console.log(data);
    

 //show edit form
 let editEmployeeModal = document.getElementById("editEmployeeModal")
 let closeEditEmployeeModal = document.getElementById("closeEditEmployeeModal")
 editEmployeeModal.style.display = "block"

//  submit button
let submitBtnEdit = document.getElementById('submitBtnEdit')

//  get male and female gender input
let maleEditInp = document.getElementById("maleEditInp")
let femaleEditInp = document.getElementById("femaleEditInp")


    document.getElementById("salutationEditInp").value = data.salutation
    document.getElementById("firstNameEditInp").value = data.firstName
    document.getElementById("lastNameEditInp").value = data.lastName
    document.getElementById("emailEditInp").value = data.email
    document.getElementById("mobileEditInp").value = data.phone
    document.getElementById("dobEditInp").value = data.dob.split('-').reverse().join('-')
    document.getElementById("qualificationEditInp").value = data.qualifications
    document.getElementById("addressEditInp").value = data.address
    document.getElementById("countryEditInp").value = data.country
    document.getElementById("stateEditInp").value = data.state
    document.getElementById("cityEditInp").value = data.city
    document.getElementById("pinEditInp").value = data.pin
    document.getElementById("usernameEditInp").value = data.username
    document.getElementById("passwordEditInp").value = data.password
    document.getElementById("employeeIdInp").value   = data.id


   
}



// edit employee 

const form = document.getElementById('edit_employee');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevents the form from refreshing the page
    
    // Now, call your editEmployee function to send the data with fetch
    await editEmployee();
});


async function editEmployee(){
 
 
let salutationEditInp = document.getElementById("salutationEditInp").value
let firstNameEditInp = document.getElementById("firstNameEditInp").value
let lastNameEditInp = document.getElementById("lastNameEditInp").value
let emailEditInp = document.getElementById("emailEditInp").value
let mobileEditInp = document.getElementById("mobileEditInp").value
let dobEditInp = document.getElementById("dobEditInp").value.split('-').reverse().join('-')
let maleEditInp = document.getElementById("maleEditInp")
let femaleEditInp = document.getElementById("femaleEditInp")
let qualificationEditInp= document.getElementById("qualificationEditInp").value
let addressEditInp = document.getElementById("addressEditInp").value
let countryEditInp = document.getElementById("countryEditInp").value
let stateEditInp = document.getElementById("stateEditInp").value
let cityEditInp = document.getElementById("cityEditInp").value
let pinEditInp = document.getElementById("pinEditInp").value
let usernameEditInp = document.getElementById("usernameEditInp").value
let passwordEditInp = document.getElementById("passwordEditInp").value

let file = null;
const fileInput = document.getElementById("editEmployeeImage");
 file = fileInput.files[0]; 
 console.log(file);


// hidden input to get employee id
let employeeId = document.getElementById("employeeIdInp").value



let gender;
if (maleEditInp.checked == true){
    gender="male"
}
       
if(femaleEditInp.checked == true){
         gender="female"
 }


const updatedEmployeeData = {
    salutation: salutationEditInp,
    firstName: firstNameEditInp,
    lastName: lastNameEditInp,
    email: emailEditInp,
    phone: mobileEditInp,
    dob: dobEditInp,
    gender: gender,
    qualifications: qualificationEditInp,
    address: addressEditInp,
    country: countryEditInp,
    state: stateEditInp,
    city: cityEditInp,
    pin: pinEditInp,
    username: usernameEditInp,
    password: passwordEditInp,
    image:file
};

submitEditEmployeeData(employeeId,updatedEmployeeData)

}

async function submitEditEmployeeData(employeeId,{image,...updatedEmployeeData}){
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
    //    uploadImage(employeeId,image)
        closeEditEmployeeModalFunction()
        let updatedEmployee = {
            id:employeeId,
            image,
            ...updatedEmployeeData
        }

        let newIndex = globalEmployeeArray.findIndex(el=>el.id===employeeId)
        globalEmployeeArray[newIndex] = updatedEmployee
        displayEmployees(globalEmployeeArray)
    
    //    
    
    } catch (error) {
        console.error("Error updating employee data:", error);
        // Optionally, show an error message to the user
    }
   
}



// file coverting


// uploading image

async function uploadImage(employeeId,image) {
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
        console.log(data);
        
    
    } catch (error) {
        console.log(error);
    }
}



// delete employeee data using id
async function deleteEmployee(userId) {
   
    console.log(userId);
    
    try {
      const response = await fetch(`http://localhost:3000/employees/${userId}`,{method:"DELETE"});
      if (!response.ok) {
        throw new Error("HTTP error! status: ${response.status}");
      }
      const data = await response.json();
      
      const filteredArray = globalEmployeeArray.filter(el=>el.id !== userId)
     
        globalEmployeeArray = filteredArray
         displayEmployees(filteredArray);

    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
}


// view details form

function viewEmployeeDetails(id){
    console.log(document.getElementById('viewDetailBox'));
    
  document.getElementById('viewDetailBox').style.display = "block"

  document.getElementById('employeeTableBox').style.display="none"
}