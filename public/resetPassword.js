// console.log("reset password")
const resetForm=document.getElementById('resetPassword');

resetForm.addEventListener('submit',async(event)=>{
    event.preventDefault();
  console.log("reset password")  
  try {
    const password=event.target.password.value;
 const urlPath=window.location.pathname.split('/');    
 const uuid=urlPath[urlPath.length-1];
 const response=await axios.post('/password/updatePassword',{password,uuid});
const data =await response.data;
alert(data?.message)
  } catch (error) {
    console.log(error);
    alert(error.response?.data?.message || "something went worng ");
  }
  
})