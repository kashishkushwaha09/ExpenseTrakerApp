function handleSubmit(event){
    event.preventDefault(); // Prevent the default form submission behavior
    console.log(event.target.name.value);
    console.log(event.target.email.value);
    console.log(event.target.password.value);
}