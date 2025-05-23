const url='http://localhost:4000/api';
const token=localStorage.getItem("token");
const premiumStatus=localStorage.getItem("isPremium");
console.log("premium status ", premiumStatus);
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
    console.log("response from payment status ",response);
    alert(response.data.status);
}
    } catch (error) {
        console.log("Error in payment status ",error);
        alert(error.response?.data?.message || error.message);
    }
})();


async function handleSubmit(event){
    event.preventDefault();
    const price=event.target.price.value;
    const description=event.target.description.value;
    const category=event.target.category.value;
    const expenseData={
        price:parseInt(price),description,category
    }
    const data=await addExpense(expenseData);
    console.log(data);
    alert(data?.message || "something went wrong");
    showExpenseList();
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
async function fetchExpense(){
    try {
       const response=await axios.get(`${url}/expenses`);  
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
            showExpenseList();
        }
    } catch (error) {
        console.log(error.response?.data || error.message);
        alert(error.response?.data?.message || error.message);
    }
}
async function showExpenseList(){
    const expenseList=document.getElementById('expense-list');
    expenseList.innerHTML='';
    const expenses=await fetchExpense();
    expenses.forEach((expense) => {
        console.log(expense);
       let listElem=document.createElement('li');
    listElem.innerHTML=`Price: ${expense.price} Description: ${expense.description} category: ${expense.category}`;

    const deleteBtn=document.createElement('button');
    deleteBtn.innerText='delete expense';
    deleteBtn.addEventListener('click',()=>{
     deleteExpense(expense);
    })
    expenseList.appendChild(listElem); 
    expenseList.appendChild(deleteBtn);
    });
    document.querySelector('body').appendChild(expenseList);
   

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
    if(premiumStatus==="true"){
        buyPremiumCard.innerHTML='';
        buyPremiumCard.innerHTML=`<h3 class="text-center my-4">You are a premium user</h3>
        <div class="text-center">
            <button class="btn btn-success mb-2" id="show-leaderboard">Show Leaderboard</button>
        </div> `;
        const showLeaderboardBtn=document.getElementById('show-leaderboard');
        showLeaderboardBtn.addEventListener('click',showLeaderboard);
}
async function showLeaderboard(){
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

}
}
document.addEventListener("DOMContentLoaded",handlePremiumFeature)
document.addEventListener('DOMContentLoaded',showExpenseList);
document.getElementById('pay-button').addEventListener('click',handlePayment);
