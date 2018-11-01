document.addEventListener('DOMContentLoaded', () => {

  if (!localStorage.getItem('user')) {
    location.replace('../index.html')
  }

});
