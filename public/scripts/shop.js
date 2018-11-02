document.addEventListener('DOMContentLoaded', () => {

  if (!localStorage.getItem('user')) {
    location.replace('../index.html')
  }

  const setHere = document.querySelector('#setHere');
  const goldCounter = document.querySelector('#goldCounter');

  document.addEventListener('click', event => {
    if (/buy/.test(event.target.id)) {
      buyItem(event.target);
    }
  })
});

// const url = 'https://fathomless-chamber-53771.herokuapp.com';
const theUser = localStorage.getItem('user');
const costSorter = document.querySelector('#costSorter');
const chaosSorter = document.querySelector('#chaosSorter');
const attackSorter = document.querySelector('#attackSorter');

let theWeapons;

setUp();

function setUp() {
  axios.get(`/users/verify`)
    .then(result => {
      let userWeapons = result.data.weapons;
      goldCounter.innerText = `Your Gold: ${result.data.gold}`
      axios.get(`/weapons`)
        .then(result => {
          let weaponsToMake = result.data;
          let allWeaps = result.data.map(x => x.id);
          let weapsToGen = allWeaps.filter(y => {
            return !userWeapons.includes(y)
          });
          if (weapsToGen.length === 0) {
            setHere.innerHTML = `<h3 class = 'text-center text-white'>No available weapons to buy!</h3>`
          } else {
            theWeapons = weaponsToMake.filter(wep => {
              return weapsToGen.includes(wep.id);
            });
            sortByCost();
          }
        });
    });

    setTimeout(() => {
      if (theWeapons.length === 0) {
        setUp();
      }
    }, 3000);

}

attackSorter.addEventListener('click', sortByAttack);
chaosSorter.addEventListener('click', sortByChaos);
costSorter.addEventListener('click', sortByCost);




function sortByAttack() {
  theWeapons.sort((a, b) => {
    return a.attack - b.attack
  });
  makeWeaponsCard(theWeapons);
}

function sortByChaos() {
  theWeapons.sort((a, b) => {
    return a.chaos - b.chaos
  });
  makeWeaponsCard(theWeapons);
}

function sortByCost() {
  theWeapons.sort((a, b) => {
    return a.cost - b.cost
  });
  makeWeaponsCard(theWeapons);
}

function makeWeaponsCard(data) {
  setHere.innerHTML = '';
  data.forEach(x => {
    let col = setHere.appendChild(makeDiv(['col']));
    let item = col.appendChild(makeDiv(['card']));
    item.appendChild(makeImg(x.image));
    item.appendChild(makeDiv(['card-body', 'text-center', 'd-flex', 'flex-column']))
      .innerHTML = `<h5 class = 'text-center mx-auto font-weight-bold'>${x.name}</h5>
  <p class = 'text-center mx-auto'>${x.description}</p>
  <p class = 'text-center mx-auto'>Attack: ${x.attack}</p>
  <p class = 'text-center mx-auto'>Chaos: ${x.chaos}</p>
  <p class = 'text-center mx-auto'>Cost: ${x.cost} Gold</p>
  <a class='btn btn-dark mx-auto text-center text-white mt-auto' id=buy${x.id}cost${x.cost}>BUY</a>`
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
  image.classList.add('card-img-top', 'mt-3');
  image.setAttribute('src', src);
  return image;
}

function makeError(item) {
  item.innerText = "CAN'T AFFORD";
  item.classList.remove('btn-dark');
  item.classList.add('btn-danger');
  setTimeout(() => {
    item.innerText = "BUY";
    item.classList.remove('btn-danger');
    item.classList.add('btn-dark');
  }, 2000);
}

function buyItem(item) { // send request to backend
  let info = item.id.replace(/buy/, '').split('cost');
  let id = parseInt(info[0]);
  let cost = parseInt(info[1]);
  axios.get(`/users/verify`).then(result => {
    console.log(result.data.gold);
    let preGold = result.data.gold;
    if (preGold < cost) makeError(document.querySelector(`#${item.id}`));
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
