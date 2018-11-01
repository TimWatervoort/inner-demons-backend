document.addEventListener('DOMContentLoaded', () => {

  const key1 = document.querySelector('#key1');
  const key2 = document.querySelector('#key2');
  const awfulButton = document.querySelector('#awfulButton');

  key1.addEventListener('click', () => {
    fadeInAndSpin(key1);
  });
  key2.addEventListener('click', () => {
    fadeInAndSpin(key2);
  });
  awfulButton.addEventListener('click', checkOpacity);
})

const body = document.querySelector('body');
const userBio = document.querySelector('#userBio');
const userImg = document.querySelector('#userImg');
const userName = document.querySelector('#userName');

function checkOpacity() {
  if (awfulButton.style.opacity == 0) {
    return;
  } else {
    activate();
  }
}

function activate() {
  body.style['background-color'] = 'yellow';
  userBio.classList.add('spinnyBoi');
  document.addEventListener('mouseover', function(event) {
    event.target.style['font-size'] = '30px';
  });
  document.addEventListener('mouseout', function(event) {
    event.target.style['font-size'] = '';
  });
  document.addEventListener('click', function(event) {
    let item = event.target;
    if (item.id === 'awfulButton') {
      return;
    } else {
      fadeMeOut(item);
    }
  });
  userImg.setAttribute('src', 'https://m.media-amazon.com/images/M/MV5BMTQ2NjM5NjE5NF5BMl5BanBnXkFtZTYwNTk3MjUz._V1_UY317_CR0,0,214,317_AL_.jpg');
  userName.innerText = 'Gary Busey';
  changeButton();
}

function deactivate() {
  location.reload();
}

function showButton() {
  if (key1.style.opacity > 0 && key2.style.opacity > 0) {
    fadeMeIn(awfulButton);
  } else {
    return;
  }
}

function changeButton() {
  awfulButton.innerText = 'RESUME NORMALITY';
  awfulButton.removeEventListener('click', checkOpacity);
  awfulButton.addEventListener('click', deactivate);
}

function fadeInAndSpin(item) {
  fadeMeIn(item);
  item.classList.add('spinnyBoi');
  setTimeout(() => {
    item.classList.remove('spinnyBoi');
  }, 4000);
  setTimeout(showButton, 500);
}

//Fade-in function
function fadeMeIn(item) {
  let op = 0.01;
  let fadeIn = setInterval(function() {
    item.style.opacity = op;
    op += 0.02;
  }, 25);
  setTimeout(() => {
    item.style.opacity = 1;
    clearInterval(fadeIn);
  }, 1000);
}

//Fade-out function
function fadeMeOut(item) {
  let op = 1;
  item.style.opacity = 1;
  let fadeOut = setInterval(function() {
    item.style.opacity = op;
    op -= 0.02;
  }, 25);
  setTimeout(() => {
    item.style.opacity = 0;
    clearInterval(fadeOut)
  }, 2000);
}
