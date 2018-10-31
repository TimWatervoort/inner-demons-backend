document.addEventListener('DOMContentLoaded', () => {

  // if (!localStorage.getItem('user')) {
  //   location.replace('intro.html')
  // }

  const setHere = document.querySelector('#setHere');
  // const url = 'https://fathomless-chamber-53771.herokuapp.com';
  const theUser = localStorage.getItem('user');
  const attackSorter = document.querySelector('#attackSorter');
  const hpSorter = document.querySelector('#hpSorter');
  const sortButtons = document.querySelector('#sortButtons');

  let currentWeapon;
  let currentEnemy;
  let currentAlly;
  let monstersData;

  axios.get(`/users/verify`)
    .then(result => {
      let userMonsters = result.data.monsters;
      axios.get(`/monsters`)
        .then(result => {
          let theMonsters = result.data;
          let allMons = result.data.map(x => x.id);
          let monsToGen = allMons.filter(y => {
            return !userMonsters.includes(y)
          });
          if (monsToGen.length === 0) {
            setHere.innerHTML = `<h3 class = 'text-center text-white'>No available raid bosses!</h3>`
          } else {
            monstersData = theMonsters.filter(element => {
              return monsToGen.includes(element.id);
            });
            sortByAttack();
          }
        });
    });

  hpSorter.addEventListener('click', sortByHP);
  attackSorter.addEventListener('click', sortByAttack);

  function sortByAttack () {
    monstersData.sort((a, b) => {
      return a.attack - b.attack
    });
    makeMonsterCard(monstersData);
  }

  function sortByHP () {
    monstersData.sort((a, b) => {
      return a.hp - b.hp
    });
    makeMonsterCard(monstersData);
  }

  document.addEventListener('click', event => {
    if (/battle/.test(event.target.id)) {
      startBattle(event.target);
    } else if (/weapon/.test(event.target.id)) {
      chooseWeapon(event.target);
      battlePhaseThree();
    } else if (/monster/.test(event.target.id)) {
      chooseMonster(event.target);
    } else if (/fight/.test(event.target.id)) {
      battlePhaseFour();
    }
  });

});

const theUser = localStorage.getItem('user');

function makeMonsterCard(data) {
  setHere.innerHTML = '';
  data.forEach(x => {
    let col = setHere.appendChild(makeDiv(['col']));
    let item = col.appendChild(makeDiv(['card']));
    item.appendChild(makeImg(x.image));
    item.appendChild(makeDiv(['card-body', 'text-center', 'd-flex', 'flex-column']))
      .innerHTML = `<h5 class = 'text-center mx-auto font-weight-bold'>${x.name}</h5>
  <p class = 'text-center mx-auto'>${x.description}</p>
  <p class = 'text-center mx-auto'>Attack: ${x.attack}</p>
  <p class = 'text-center mx-auto'>HP: ${x.hp}</p>
  <a class='btn btn-dark mx-auto text-center text-white mt-auto' id=battle${x.id}>BATTLE</a>`
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

function addClasses(item, arr) {
  arr.forEach(x => {
    item.classList.add(x);
  });
}

function startBattle(item) {
  sortButtons.setAttribute('hidden', true);
  let id = parseInt(item.id.replace(/battle/, ''));
  setHere.style.opacity = 0;
  setHere.innerHTML = '';
  addClasses(setHere, ['bg-dark', 'text-white', 'p-4'])
  setHere.innerHTML = `<p class = 'text-center mx-auto mt-3'>An enemy has appeared!</p>`
  fadeMeIn(setHere);
  setTimeout(() => fadeMeOut(setHere), 2000);
  setTimeout(() => setHere.innerHTML = '', 4000);
  axios.get(`/monsters/${id}`)
    .then(result => {
      let enemy = result.data;
      currentEnemy = enemy;
      setTimeout(() => battlePhaseTwo(enemy), 4000);
    })
}

function battlePhaseTwo(enemy) {
  setHere.style.opacity = 1;
  setHere.classList.remove('row');
  setHere.innerHTML += `<h5 class = "mx-auto text-center">Choose a weapon!</h5><br>`
  axios.get(`/users/verify`)
    .then(result => {
      let wepsToUse = result.data.weapons;
      if (wepsToUse.length === 0) {
        return setHere.innerHTML = 'You need a weapon to fight! Head to the shop to buy one.';
      }
      Promise.all(wepsToUse.map(x => {
          return axios.get(`/weapons/${x}`)
        }))
        .then(result => {
          let weapons = result.map(y => y.data);
          showWeapons(weapons);
        });
    });
}

function battlePhaseThree() {
  setHere.innerHTML = '';
  setHere.innerHTML = `<h5 class = "mx-auto text-center">Choose an ally!</h5><br>`
  axios.get(`/users/verify`)
    .then(result => {
      let monsToUse = result.data.monsters;
      if (monsToUse.length === 0) {
        monsToUse = [10]
      }
      Promise.all(monsToUse.map(x => {
          return axios.get(`/monsters/${x}`)
        }))
        .then(result => {
          let monsters = result.map(y => y.data);
          showMonsters(monsters);
        });
    });
}

function battlePhaseFour() {
  axios.get(`/users/verify`)
    .then(result => {
      let thisUser = result.data;
      setHere.innerHTML = `
      <div class = 'row'>
      <div class = 'col-2'>
      <img class = 'small-img' src=${thisUser.image}>
      </div>
      <div class = 'col-1'>
      <img class = 'small-img' src=${currentAlly.image}>
      </div>
      <div class = 'col-1'>
      <img class = 'small-img' src=${currentWeapon.image}>
      </div>
      <div class = 'col-4'>
      <h3 class='mx-auto text-center'>${thisUser.name} versus ${currentEnemy.name}</h3>
      </div>
      <div class = 'col-4'>
      <img class = 'small-img' src=${currentEnemy.image}>
      </div>
      </div>`;
      dukeItOut(currentAlly, currentWeapon, currentEnemy, thisUser);
    });
}

function showMonsters(arr) {
  arr.forEach(monster => {
    setHere.innerHTML += `<button class='btn btn-dark' id=monster${monster.id}>${monster.name} | Attack: ${monster.attack} | HP: ${monster.hp}</button>`
    setHere.innerHTML += '<br>'
  });
}

function showWeapons(arr) {
  arr.forEach(weapon => {
    setHere.innerHTML += `<button class='btn btn-dark' id=weapon${weapon.id}>${weapon.name} | Attack: ${weapon.attack} | Chaos: ${weapon.chaos}</button>`
    setHere.innerHTML += '<br>'
  });
}

function chooseWeapon(item) {
  let weaponId = item.id.replace(/weapon/, '');
  axios.get(`/weapons/${weaponId}`)
    .then(result => {
      currentWeapon = result.data;
    });
}

function chooseMonster(item) {
  let monsterId = item.id.replace(/monster/, '');
  axios.get(`/monsters/${monsterId}`)
    .then(result => {
      currentAlly = result.data;
      makeFightButton();
    });
}

function makeFightButton() {
  addClasses(setHere, ['mx-auto', 'text-center'])
  setHere.innerHTML = `<h3 class='btn btn-danger mx-auto text-center' id='fight'>FIGHT!</h3>`
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
