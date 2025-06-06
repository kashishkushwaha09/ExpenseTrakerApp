



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