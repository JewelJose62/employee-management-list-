


let viewdata = [];
let userdata = viewdata;
const fetchEmployees = async (employee) => {
  try {
    const response = await fetch(`http://localhost:3000/employees/${employeeid}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch employee data");
    }

    viewdata = await response.json();
    console.log(viewdata);
    viewEmployee(viewdata);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};


fetchEmployees(id); 


async function viewEditEmployee(id) {
  viewEditPopup();

  try {
    const response = await fetch(`http://localhost:3000/employees/${id}`);
    if (!response.ok) {
      throw new Error("failed to fetch employee data for editing");
    }

    const viewdata = await response.json();
document.getElementById("editEmployeeChangeImage").src = `http://localhost:3000/employees/${id}/avatar`
    document.getElementById('pinEditInp').value = viewdata.pin;
    document.getElementById('salutationEditInp').value = viewdata.salutation;
    document.getElementById('firstNameEditInp').value = viewdata.firstName;
    document.getElementById('LastNameEditInp').value = viewdata.lastName;
    document.getElementById('EmailEditInp').value = viewdata.email;
    document.getElementById('mobileEditInp').value = viewdata.phone;
    document.getElementById('dobEditInp').value = viewdata.dob.split("-").reverse().join("-");
    document.getElementById('maleEditInp').checked = viewdata.gender === "male";
    document.getElementById('FemaleEditInp').checked = viewdata.gender === "female";
    document.getElementById('usernameEditInp').value = viewdata.username;
    document.getElementById('passwordEditInp').value = viewdata.password;
    document.getElementById('qualificationEditInp').value = viewdata.qualifications;
    document.getElementById('addressEditInp').value = viewdata.address;
    document.getElementById('countryEditInp').value = viewdata.country;
    document.getElementById('stateEditInp').value = viewdata.state;
    document.getElementById('cityEditInp').value = viewdata.city;

    const viewsubmitbtn = document.getElementById("submitBtnEdit");
    const newsbmitbtn = viewsubmitbtn.cloneNode(true);
    viewsubmitbtn.parentNode.replaceChild(newsbmitbtn, viewsubmitbtn)


  }