document.addEventListener('DOMContentLoaded', () => {

  if (!localStorage.getItem('user')) {
    location.replace('intro.html')
  }

  const setHere = document.querySelector('#setHere');
  const goldCounter = document.querySelector('#goldCounter');

  let setError = document.querySelector('#errorMsg');
  setError.style.opacity = 0;
  setError.innerHTML = `<p class = 'text-center mx-auto pt-3'>Not enough gold, bucko!<p>`;

  document.addEventListener('click', event => {
    if (/buy/.test(event.target.id)) {
      buyItem(event.target);
    }
  })
});

// const url = 'https://fathomless-chamber-53771.herokuapp.com';
const theUser = localStorage.getItem('user');

setTimeout(setUp, 500);

function setUp() {
  axios.get(`/users/${theUser}`)
    .then(result => {
      let userWeapons = result.data.weapons;
      goldCounter.innerText = `Your Gold: ${result.data.gold}`
      axios.get(`/weapons`)
        .then(result => {
          let allWeaps = result.data.map(x => x.id);
          let weapsToGen = allWeaps.filter(y => {
            return !userWeapons.includes(y)
          });
          if (weapsToGen.length === 0) {
            setHere.innerHTML = `<h3 class = 'text-center text-white'>No available weapons to buy!</h3>`
          } else {
            Promise.all(weapsToGen.map(z => {
                return axios.get(`/weapons/${z}`)
              }))
              .then(result => {
                let weaponsData = result.map(i => i.data)
                makeWeaponsCard(weaponsData);
              });
          }
        });
    });
}

function makeWeaponsCard(data) {
  data.forEach(x => {
    let col = setHere.appendChild(makeDiv(['col']));
    let item = col.appendChild(makeDiv(['card']));
    item.appendChild(makeImg(x.image));
    item.appendChild(makeDiv(['card-body', 'text-center']))
      .innerHTML = `<h5 class = 'text-center mx-auto'>${x.name}</h5>
  <p class = 'text-center mx-auto'>${x.description}</p>
  <p class = 'text-center mx-auto'>Attack: ${x.attack}</p>
  <p class = 'text-center mx-auto'>Chaos: ${x.chaos}</p>
  <p class = 'text-center mx-auto'>Cost: ${x.cost} Gold</p>
  <a class='btn btn-dark mx-auto text-center text-white' id=buy${x.id}cost${x.cost}>BUY</a>`
  });
}

function makeDiv(cl) { // make a div with a given class list array
  let div = document.createElement('div');
  cl.forEach(x => {
    div.classList.add(x)
  });
  return div;
}

function makeImg(src) { // make an image
  let image = document.createElement('img');
  image.classList.add('card-img-top');
  image.setAttribute('src', src);
  return image;
}

function makeError() {
  let setError = document.querySelector('#errorMsg');
  setError.classList.add('bg-danger');
  fadeMeIn(setError);
  setTimeout(() => fadeMeOut(setError), 2000)
}

function clearError() {
  let setError = document.querySelector('#errorMsg');
  setError.classList.remove('bg-danger');
}

function buyItem(item) { // send request to backend
  clearError();
  let info = item.id.replace(/buy/, '').split('cost');
  let id = parseInt(info[0]);
  let cost = parseInt(info[1]);
  axios.get(`/users/${theUser}`).then(result => {
    console.log(result.data.gold);
    let preGold = result.data.gold;
    if (preGold < cost) makeError();
    else {
      document.getElementById(item.id).innerText = 'BOUGHT'
      document.getElementById(item.id).id = 'x';
      item.classList.remove('btn-dark');
      item.classList.add('btn-primary');
      let newGold = preGold - cost;
      goldCounter.innerText = `Your Gold: ${newGold}`
      axios.patch(`/users/${theUser}`, {
        gold: newGold
      });
      axios.post(`/weapons_users`, {
          user_id: theUser,
          weapon_id: id
        })
        .then(result => {
          console.log(result);
        });
    }
  })
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
  }, 1000);
}
