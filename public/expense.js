const url='http://localhost:4000/api';
const token=localStorage.getItem("token");
const premiumStatus=localStorage.getItem("isPremium");
let leaderboard=false;
const select=document.getElementById('item-per-page');
console.log("premium status ", premiumStatus);
console.log("🧪 Latest expense.js loaded");

const cashfree=Cashfree({
    mode:"sandbox"
})
if(token){
    axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
}
(async ()=>{
    try {
        const params=new URLSearchParams(window.location.search);
const orderId=params.get('orderId');
if(orderId){
    const response=await axios.get(`http://localhost:4000/payment/payment-status/${orderId}`);
    console.log("response from payment status ",response.data);
    if(response.data.status==='success'){
     localStorage.setItem("isPremium","true");
     handlePremiumFeature();
    }
    alert(response.data.status);
}
    } catch (error) {
        console.log("Error in payment status ",error);
        alert(error.response?.data?.message || error.message);
    }
})();


async function handleSubmit(event){
    event.preventDefault();
    const amount=event.target.amount.value;
    const description=event.target.description.value;
    const category=event.target.category.value;
    const note=event.target.note.value;
    const expenseData={
        amount:parseInt(amount),description,category,note
    }
    let editId=sessionStorage.getItem('editId');
    
    let data;

    if(editId){
      
         data=await editExpense(parseInt(editId),expenseData);
    }else{
        data=await addExpense(expenseData);
    }
     
    if(data){
         sessionStorage.removeItem('editId');
        document.getElementById('amount').value='';
        document.getElementById('description').value='';
        document.getElementById('note').value='';
        document.getElementById('category').value='';
        const form=document.querySelector('form');
        form.querySelector('button').innerText='Add Expense';
    }
    alert(data?.message);
    showPaginationBtns();
}
async function addExpense(expenseData){
    try {
       const response=await axios.post(`${url}/expenses`,expenseData);  
       return response.data;
    } catch (error) {
        console.log(error.response?.data || error.message);
        alert(error.response?.data?.message || error.message)
         return null;
    }
  
}
async function fetchExpense(page=1,limit=4){
    try {

       const response=await axios.get(`${url}/expenses?page=${page}&limit=${limit}`); 
       console.log("response from fetch expense ",response.data); 
       return response.data.expenses;
    } catch (error) {
        console.log(error.response?.data || error.message);
        alert(error.response?.data?.message || error.message)
         return null;
    }
  
}
async function deleteExpense(expense){
    
    try {
        const response=await axios.delete(`${url}/expenses/${expense.id}`);
         console.log("deleted expense ",response);
        if(response.status===200){
            alert(response.data?.message);
            showPaginationBtns();
            const selectedValue=parseInt(localStorage.getItem("selectedValue")) || 4;
    showExpenseList(1,selectedValue);
            
        }
    } catch (error) {
        console.log(error.response?.data || error.message);
        alert(error.response?.data?.message || error.message);
    }
}
async function editExpense(editId,expenseData){
    try {
         const response=await axios.put(`${url}/expenses/${editId}`,expenseData);
         console.log("edit expense ",response);
         return response.data;
    } catch (error) {
         console.log(error.response?.data || error.message);
         alert("edit expense failed !");
    }
}
async function showExpenseList(page,selectedValue){
    const expenseList=document.getElementById('expense-list');
    expenseList.innerHTML='';
    const data=await fetchExpense(page,selectedValue);
    console.log(data.expenses);
    if(data?.expenses){
      if(data.expenses.length===0){
     select.style.display='none';
       let listElem=document.createElement('li');
    listElem.innerHTML=`<h1>Add items in list</h1>`;
    listElem.style.listStyleType='none';
    expenseList.appendChild(listElem);
    }else{
      select.style.display='block';  
    //   expenseList.innerHTML='';
        data.expenses.forEach((expense) => {
        // console.log(expense);
       let listElem=document.createElement('li');
    listElem.innerHTML=`Amount: ${expense.amount} Description: ${expense.description} category: ${expense.category}`;

    const deleteBtn=document.createElement('button');
    deleteBtn.innerText='delete expense';
    deleteBtn.className='btn mx-2 btn-danger p-1'
    deleteBtn.addEventListener('click',()=>{
     deleteExpense(expense);
    })
    const editBtn=document.createElement('button');
    editBtn.innerText='edit expense';
    editBtn.className='btn btn-success p-1'
    editBtn.addEventListener('click',()=>{
        sessionStorage.setItem('editId',expense.id);
        document.getElementById('amount').value=expense.amount;
        document.getElementById('description').value=expense.description;
        document.getElementById('note').value=expense.note;
        document.getElementById('category').value=expense.category;
        const form=document.querySelector('form');
        form.querySelector('button').innerText='Update Expense';
    })
    expenseList.appendChild(listElem); 
    expenseList.appendChild(deleteBtn);
    expenseList.appendChild(editBtn);
    });
    }
  
    document.querySelector('body').appendChild(expenseList);
    }
  
   

}
async function handlePayment(){
    try {
        // fetch payment session id from backend
        const response=await axios.post(`http://localhost:4000/payment/create-order`,{
            orderId:Math.random().toString(36).substring(2, 15),
            orderAmount:1.00,
            orderCurrency:'INR',
        });
        console.log("payment response ",response);
           const data=await response.data;
           console.log("payment data ",data);
           const paymentSessionId=data.paymentSession_id;

           let checkoutOptions={ 
           paymentSessionId:paymentSessionId,
           redirectTarget:'_self',
        };
        //Start the checkout process
        await cashfree.checkout(checkoutOptions);
    } catch (error) {
        console.log("Error in payment ",error);
        alert(error.response?.data?.message || error.message);
    }
}
function handlePremiumFeature(){    
    const buyPremiumCard=document.querySelector('.card');
    const premiumStatus=localStorage.getItem("isPremium");
    if(premiumStatus==="true"){
        buyPremiumCard.innerHTML='';
        buyPremiumCard.innerHTML=`<h3 class="text-center my-4">You are a premium user</h3>
        <div class="text-center">
            <button class="btn btn-success mb-2" id="show-leaderboard">Show Leaderboard</button>
            <a href='./report.html' class="btn btn-success mb-2" id="show-leaderboard">See Report</a>
        </div> `;
        const showLeaderboardBtn=document.getElementById('show-leaderboard');
        showLeaderboardBtn.addEventListener('click',()=>{
            leaderboard=!leaderboard? true : false;
            showLeaderboard()});
}
}
async function showLeaderboard(){
   if(leaderboard){
    const response=await axios.get(`${url}/expenses/premium/leaderboard`);
   console.log("leaderboard data ",response.data);
   const leaderboardData=response.data.expenses;
   document.getElementById('leaderboard').style.display='block';
   const leaderboardList=document.getElementById('leaderboard-list');
   leaderboardList.innerHTML='';
   leaderboardData.forEach((user) => {
    const listElem=document.createElement('li');
    listElem.innerHTML=`Name: ${user.name} Total Expense: ${user.totalExpense}`;
    leaderboardList.appendChild(listElem);
   
   })

}else{
    document.getElementById('leaderboard').style.display='none';
}
}
async function showPaginationBtns(){
const selectedValue=parseInt(localStorage.getItem("selectedValue")) || 4;
const expenses=await fetchExpense(1,selectedValue);
// console.log("expenses ",expenses) 
let totalPages=expenses.lastPage; //4
//  console.log("Pagination ",expenses);
let buttonList=document.getElementById('pagination-btns');
buttonList.innerHTML='';
for(let i=1; i<=totalPages; i++){
const li=document.createElement('li');
if (i === 1) {      // be active already
    li.classList.add('active'); 
    showExpenseList(1,selectedValue);
  }
li.innerHTML=`
 <button class="page-link">${i}</button>

`;
li.classList.add('page-item');
const pageBtn=li.querySelector('button');
pageBtn.addEventListener('click',()=>{
    const allLis = buttonList.querySelectorAll('li');
    allLis.forEach(li => li.classList.remove('active'));
    li.classList.add('active');
    const selectedValue=parseInt(localStorage.getItem("selectedValue")) || 4;
    showExpenseList(i,selectedValue);
})
buttonList.appendChild(li);
}
}
function handleItemPerPage(){
     const selectedValue = parseInt(this.value); // e.g., 5, 10, 20
 for (let option of select.options) {
  if (option.value === selectedValue) {
    option.selected = true;
    break;
  }
}

  console.log("Selected items per page:", selectedValue);
 localStorage.setItem("selectedValue",selectedValue);
  // Now use selectedValue to fetch or show data
  showPaginationBtns();
 
}
document.addEventListener("DOMContentLoaded",()=>{
    localStorage.removeItem('selectedValue');
    showPaginationBtns()});
document.addEventListener("DOMContentLoaded",handlePremiumFeature)
// document.addEventListener('DOMContentLoaded',()=>{
//     const selectedValue=parseInt(localStorage.getItem("selectedValue")) || 4;
//     for (let option of select.options) {
//   if (option.value ==selectedValue) {
//     option.selected = true;
//     break;
//   }
// }
//     showExpenseList(1,selectedValue);
// });
select.addEventListener('change',handleItemPerPage);
document.getElementById('pay-button').addEventListener('click',handlePayment);
