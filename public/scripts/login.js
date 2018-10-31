  const logInButton = document.querySelector('#logInButton');

  logInButton.addEventListener('click', logIn);

  function logIn() {
    location.replace('/auth/github');
  }
