function handleSubmit(event){
    event.preventDefault(); // Prevent the default form submission behavior
    console.log(event.target.name.value);
    console.log(event.target.email.value);
    console.log(event.target.password.value);
    const userData={
        name:event.target.name.value,
        email:event.target.email.value,
        password:event.target.password.value
    }
    axios.post('http://localhost:4000/api/users',userData)
    .then((response)=>{
        console.log(response.data);
        alert("User created successfully");
    })
    .catch((error)=>{
        console.error(error);
        alert("Error creating user");
    });
}