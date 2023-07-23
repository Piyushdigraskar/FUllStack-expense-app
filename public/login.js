async function saveToLocal(event) {
    try {
        event.preventDefault();

        const loginDetails = {
            email: event.target.email.value,
            password: event.target.password.value
        }

        console.log(loginDetails);

        const response = await axios.post("http://3.26.185.160:3000/user/login", loginDetails)
        if (response.status === 200) {
            window.location.href = './expense.html';
            localStorage.setItem('token', response.data.token);
            alert(response.data.message);

        }
        else {
            console.log(response.data.message);
        }
    }
    catch (err) {
        document.body.innerHTML = document.body.innerHTML + "<h3>Something went wrong</h3>";
        console.log(err);

    }

}
async function forgotpassword() {
    //window.location.href = './forgotpassword.html';
    const email = prompt('enter your email?')
    await axios.post('http://3.26.185.160:3000/password/forgotpassword',{email})
    if(email){
        alert('password reset link sent to email')
    }
    else{
        alert('please enter email')
    }
    
}

