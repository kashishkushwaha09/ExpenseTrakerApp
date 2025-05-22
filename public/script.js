
const url='http://localhost:4000/api';
const userAuthDiv=document.getElementById('userAuth');
const authButton=document.getElementById('auth');
 let authStatus=localStorage.getItem("authStatus");
async function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    let userData, response;
   if(authStatus==="login"){
    userData={
        email: event.target.email.value,
        password: event.target.password.value
    }
    // login function
      response= await loginUser(userData);
      alert(response.message || "user Login successfully");
     
    localStorage.setItem("token",response.token);
    localStorage.setItem("isPremium",response.user.isPremium);
      window.location.assign('expense.html');
      userAuthDiv.innerHTML='';
      localStorage.removeItem('authStatus');
   }else{
    userData={
        name: event.target.name.value,
        email: event.target.email.value,
        password: event.target.password.value
    }
    response=await signupUser(userData);
     localStorage.setItem("authStatus","login");
     userAuthDiv.innerHTML='';
     alert(response.message || "user Signup successfully");
   }
    
   
    
    authModule();
}
async function loginUser(userData){
    try {
        const response=await axios.post(`${url}/users/login`,userData);
        
        return response.data;
    } catch (error) {
        console.log(error.response?.data || error.message);
        alert(error.response?.data?.message ||`Something went wrong: ${error.message}`);
        return null;
    }

}
async function signupUser(userData){
    try {
        const response=await axios.post(`${url}/users`,userData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error.response?.data || error.message);
        alert(error.response?.data?.message ||`Something went wrong: ${error.message}`);
        return null;
    }

}
function authModule() {
   authStatus=localStorage.getItem("authStatus");
    const form = document.createElement('form');
    form.className = 'container mt-5';
     const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary';

     const button=document.createElement('button');
    button.type = 'submit';
    button.className = 'btn btn-success align-self-start mt-2';
    button.id="auth";

    if(authStatus==="login"){
   
    form.innerHTML = `
  <div class="d-flex">
  <div class="mb-2">
    <label for="email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email" name="email" required>
  </div>
  <div class="mb-2 mx-2">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" name="password" required>
  </div>
        </div>
`;
submitButton.innerText = `Login`;
button.innerText="Signup"
    }else{
    form.innerHTML = `
        <div class="d-flex">
             <div class="mb-2">
    <label for="name" class="form-label">Name</label>
    <input type="text" class="form-control" id="name" name="name" required>
  </div>
  <div class="mb-2 mx-2">
    <label for="email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email" name="email" required>
  </div>
  <div class="mb-2">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" name="password" required>
  </div>
        </div>
`;
submitButton.innerText = `Signup`;
button.innerText='Login';
    }
   
button.addEventListener('click',()=>{
if(authStatus==='login'){
    localStorage.removeItem('authStatus');
}else{
    localStorage.setItem('authStatus','login');
    
}
userAuthDiv.innerHTML='';
authModule();
});
form.addEventListener('submit',handleSubmit);
form.appendChild(submitButton);
    userAuthDiv.appendChild(form);
    userAuthDiv.appendChild(button)
   
}
document.addEventListener('DOMContentLoaded',()=>{
authModule();
});
