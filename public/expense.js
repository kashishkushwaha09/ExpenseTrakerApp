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
async function showExpenseList(){
    const expenseList=document.createElement('ul');
    const expenses=await fetchExpense();
    expenses.forEach((expense) => {
       let listElem=document.createElement('li');
    listElem.innerHTML=`Price: ${expense.price} Description: ${expense.description} category: ${expense.category}`;
    expenseList.appendChild(listElem); 
    });
    document.querySelector('body').appendChild(expenseList);
    console.log(expenses);

}
document.addEventListener('DOMContentLoaded',showExpenseList);
