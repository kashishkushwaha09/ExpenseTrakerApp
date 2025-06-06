

const transactions =[
  { "id": 35, "date": "01-03-2024", "description": "March Salary", "category": "salary", "amount": 20000, "type": "income" },
  { "id": 34, "date": "05-03-2024", "description": "Book Purchase", "category": "education", "amount": 400, "type": "expense" },
  { "id": 33, "date": "10-03-2024", "description": "Concert Tickets", "category": "entertainment", "amount": 2000, "type": "expense" },
  { "id": 32, "date": "15-03-2024", "description": "Gym Membership", "category": "health", "amount": 1500, "type": "expense" },
  { "id": 31, "date": "20-03-2024", "description": "Internet Bill", "category": "bills", "amount": 800, "type": "expense" },
  { "id": 30, "date": "25-03-2024", "description": "Grocery Shopping", "category": "food", "amount": 600, "type": "expense" },
  { "id": 29, "date": "30-03-2024", "description": "Weekend Trip", "category": "travel", "amount": 5000, "type": "expense" },
  { "id": 28, "date": "01-04-2024", "description": "April Salary", "category": "salary", "amount": 21000, "type": "income" },
  { "id": 27, "date": "10-04-2024", "description": "Milk & Snacks", "category": "food", "amount": 280, "type": "expense" },
  { "id": 26, "date": "15-04-2024", "description": "Cinema", "category": "entertainment", "amount": 300, "type": "expense" },
  { "id": 25, "date": "20-04-2024", "description": "Gas Refill", "category": "bills", "amount": 650, "type": "expense" },
  { "id": 24, "date": "22-04-2024", "description": "College Book", "category": "education", "amount": 750, "type": "expense" },
  { "id": 23, "date": "27-04-2024", "description": "Freelance Bonus", "category": "salary", "amount": 5000, "type": "income" },
  { "id": 22, "date": "08-05-2024", "description": "Doctor Visit", "category": "health", "amount": 450, "type": "expense" },
  { "id": 21, "date": "10-05-2024", "description": "T-shirt Shopping", "category": "shopping", "amount": 1200, "type": "expense" },
  { "id": 20, "date": "18-05-2024", "description": "Dining Out", "category": "food", "amount": 850, "type": "expense" },
  { "id": 19, "date": "20-05-2024", "description": "May Salary", "category": "salary", "amount": 22000, "type": "income" },
  { "id": 18, "date": "21-05-2024", "description": "Cab Ride", "category": "transport", "amount": 100, "type": "expense" },
  { "id": 17, "date": "01-04-2025", "description": "Salary (April)", "category": "salary", "amount": 24000, "type": "income" },
  { "id": 16, "date": "02-04-2025", "description": "Stationery", "category": "miscellaneous", "amount": 120, "type": "expense" },
  { "id": 15, "date": "10-04-2025", "description": "Movie", "category": "entertainment", "amount": 300, "type": "expense" },
  { "id": 14, "date": "12-04-2025", "description": "Gas Bill", "category": "bills", "amount": 600, "type": "expense" },
  { "id": 13, "date": "18-04-2025", "description": "Lunch with friends", "category": "food", "amount": 500, "type": "expense" },
  { "id": 12, "date": "20-04-2025", "description": "Online Course", "category": "education", "amount": 2000, "type": "expense" },
  { "id": 11, "date": "26-04-2025", "description": "Bus Pass", "category": "transport", "amount": 350, "type": "expense" },
  { "id": 10, "date": "27-04-2025", "description": "Birthday Party", "category": "party", "amount": 1500, "type": "expense" },
  { "id": 9, "date": "04-05-2025", "description": "Random Bonus", "category": "salary", "amount": 3000, "type": "income" },
  { "id": 8, "date": "05-05-2025", "description": "Tuition Fees", "category": "education", "amount": 3000, "type": "expense" },
  { "id": 7, "date": "12-05-2025", "description": "Movie Night", "category": "entertainment", "amount": 400, "type": "expense" },
  { "id": 6, "date": "14-05-2025", "description": "Electricity Bill", "category": "bills", "amount": 900, "type": "expense" },
  { "id": 5, "date": "18-05-2025", "description": "Rent", "category": "housing", "amount": 8000, "type": "expense" },
  { "id": 4, "date": "20-05-2025", "description": "Doctor Appointment", "category": "health", "amount": 500, "type": "expense" },
  { "id": 3, "date": "23-05-2025", "description": "Groceries", "category": "food", "amount": 700, "type": "expense" },
  { "id": 1, "date": "26-05-2025", "description": "Uber ride", "category": "transport", "amount": 150, "type": "expense" },
  { "id": 2, "date": "26-05-2025", "description": "Salary (May)", "category": "salary", "amount": 25000, "type": "income" }
];

async function fetchExpense(viewMode){
    try {

    const response=await axios.get(`http://localhost:4000/api/expenses/premium/groupExpense`,{
    headers:{
      "Authorization":`Bearer ${localStorage.getItem('token')}`
    },
     params: {
    viewMode: viewMode
  }
  }); 
       console.log("response from fetch expense ",response.data); 
       return response.data.allExpenses;
    } catch (error) {
        console.log(error.response?.data || error.message);
        alert(error.response?.data?.message || error.message)
         return null;
    }
  
}
async function showExpenseList(viewMode='all') {
  const expenseList=document.getElementById('expense-row');
  expenseList.innerHTML='';
 let filteredTransactions=await fetchExpense(viewMode);
 console.log(filteredTransactions);
 let totalExpense=0,totalIncome=0;
  filteredTransactions.forEach((transaction)=>{
     if(transaction.type==='income'){
     totalIncome+=transaction.amount;
    }else{
     totalExpense+=transaction.amount;
    
    }
       const row=document.createElement('tr');
    row.innerHTML=`
     <td>${transaction.date}</td>
      <td>${transaction.description}</td>
      <td>${transaction.category}</td>
      ${transaction.type==='income'?`<td>${transaction.amount}</td>
      <td></td>`:`<td></td>
      <td>${transaction.amount}</td>`}
    `;
    expenseList.appendChild(row);
  })
   const row=document.createElement('tr');
    row.innerHTML=`
      <td colspan="3" style="font-weight:bold;">Total</td>
      <td class="text-success" style="font-weight:bold;">&#8377; ${totalIncome}</td>
      <td class="text-danger" style="font-weight:bold;">&#8377; ${totalExpense}</td>
    `;
    expenseList.appendChild(row);
}

function download(){
  axios.get('http://localhost:4000/api/expenses/premium/download', {
    headers:{
      "Authorization":`Bearer ${localStorage.getItem('token')}`
    }
  }).then((response)=>{
    if(response.status===200){
  
      const a = document.createElement('a');
      a.href = response.data.fileUrl;
      a.download = 'expenses.csv';
      document.body.appendChild(a);
      a.click();

    }else{
      alert('Failed to download the file');
      throw new Error('Failed to download the file');
    }
  }).catch((error)=>{
    console.log(error);
  });
}
function downloadOlderFiles(){
  axios.get('http://localhost:4000/api/expenses/premium/older-files/download', {
    headers:{
      "Authorization":`Bearer ${localStorage.getItem('token')}`
    }
  }).then((response)=>{
    if(response.status===200){
  // <ul class="dropdown-menu">
  //   <li><a class="dropdown-item" href="#">Action</a></li>
  // </ul>
      const olderFiles=response.data.olderFiles;
      const dropdownMenu = document.querySelector('.dropdown-menu');
      dropdownMenu.innerHTML = ''; 
      if(olderFiles?.length===0){
        dropdownMenu.innerHTML='<li><a class="dropdown-item" href="#">No older files available</a></li>';
        return;
      }
      olderFiles.forEach(file => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item" href="${file.filePath}" download="${file.fileName}">${file.fileName}</a>`;
        dropdownMenu.appendChild(li);
      });
    }else{
      alert('Failed to download the file');
      throw new Error('Failed to download the file');
    }
  }).catch((error)=>{
    console.log(error);
  });
}
document.getElementById('view-mode').addEventListener('change',function(){
const selectMode=this.value;
showExpenseList(selectMode); 
});
document.addEventListener('DOMContentLoaded',()=>{
showExpenseList('all'); 
})