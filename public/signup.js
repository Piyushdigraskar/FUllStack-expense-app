async function saveToLocal(event) {
    try {
      event.preventDefault();
      console.log(event.target.email.value);
      const signupDetails = {
        name: event.target.name.value,
        email: event.target.email.value,
        password: event.target.password.value
      }

      console.log(signupDetails);

      const response = await axios.post("http://3.26.185.160:3000/user/signup", signupDetails)
      if (response.status === 201) {
        window.location.href = './login.html';
      }
      else{
        console.log("Failed to login");
      }
    }
    catch (err) {
      document.body.innerHTML = document.body.innerHTML + "<h3>Something went wrong</h3>";
      console.log(err);
    }

  }
