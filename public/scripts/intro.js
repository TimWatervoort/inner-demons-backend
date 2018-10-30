document.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('#usernameField');
  const button = document.querySelector('#subBut');
  const fullForm = document.querySelector('#fullForm');

  if (localStorage.getItem('user')) {
    fullForm.setAttribute('hidden', true);
  }

  fullForm.addEventListener('submit', event => {
    event.preventDefault();
    axios.get(`/users`)
      .then(result => {
        let users = result.data.filter(x => {
          return x.name === form.value
        });
        if (users.length > 0) {
          localStorage.setItem('user', users[0].id)
          location.replace('../index.html')
        } else {
          form.value = 'user does not exist';
        }
      });
  });

});
