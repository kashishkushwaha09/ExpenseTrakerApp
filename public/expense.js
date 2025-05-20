const url='http://localhost:4000/api';

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
document.addEventListener('DOMContentLoaded',showExpenseList);
