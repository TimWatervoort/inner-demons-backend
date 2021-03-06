document.addEventListener(`DOMContentLoaded`, () => {

  if (!/jwt/.test(document.cookie)) {
    location.replace('/index.html');
  }

  const goalsDropdown = document.querySelector('#goalsDropdown');
  const weaponsDropdown = document.querySelector('#weaponsDropdown');
  const monstersDropdown = document.querySelector('#monstersDropdown');

  const goalsButton = document.querySelector('#goalsButton');
  const weaponsButton = document.querySelector('#weaponsButton');
  const monstersButton = document.querySelector('#monstersButton');

  const userName = document.querySelector('#userName');
  const userLevel = document.querySelector('#userLevel');
  const userXP = document.querySelector('#userXP');
  const userWeapons = document.querySelector('#userWeapons');
  const userMonsters = document.querySelector('#userMonsters');
  const userHP = document.querySelector('#userHP');
  const userGold = document.querySelector('#userGold');
  const userImg = document.querySelector('#userImg');

  const logOutButton = document.querySelector('#logOutButton');
  const imgModal = document.querySelector('#imgModal');

  axios.get(`/users/verify`).then(result => {
    localStorage.setItem('user', result.data.id)
    let user = result.data
    console.log(user.id, user.image);
    if (user.image == null) {
      axios.patch(`/users/${user.id}`, {
          image: '../images/monster/human_new.png'
        })
        .then(() => {
          setUser(user);
        })
    } else {
      setUser(user);
    }
    axios.get(`/weapons`).then(result => {
      let weps = result.data.filter(x => {
        return user.weapons.includes(x.id);
      });
      if (weps.length === 0) {
        makeBlankWeaponCard();
      } else {
        makeWeaponsCard(weps)
      }
      axios.get(`/monsters`).then(result => {
        if (user.monsters.length === 0) {
          axios.post('/monsters_users', {
            user_id: user.id,
            monster_id: 10
          })
          let turtle = result.data.filter(turt => {
            return turt.id == 10;
          });
          makeMonstersCard(turtle);
        } else {
          let mons = result.data.filter(y => {
            return user.monsters.includes(y.id);
          });
          makeMonstersCard(mons);
        }
        if (user.goals.length === 0) {
          makeBlankGoalCard();
        } else {
          Promise.all(user.goals.map(a => axios.get(`/goals/${a}`)))
            .then(result => {
              let theGoals = result.map(b => b.data)
              theGoals.forEach(i => {
                Promise.all(i.tasks.map(x => axios.get(`/tasks/${x}`)))
                  .then(result => {
                    let theTasks = result.map(y => y.data)
                    i.tasks = theTasks
                    makeGoalCard([i])
                  })
              })
            })
        }
      });
    });
  });

  goalsButton.addEventListener('click', () => {
    weaponsDropdown.classList.remove('show');
    monstersDropdown.classList.remove('show');
  });
  weaponsButton.addEventListener('click', () => {
    goalsDropdown.classList.remove('show');
    monstersDropdown.classList.remove('show');
  });
  monstersButton.addEventListener('click', () => {
    weaponsDropdown.classList.remove('show');
    goalsDropdown.classList.remove('show');
  });

  logOutButton.addEventListener('click', logOut);

  imgModal.addEventListener('click', event => {
    if (event.target.hasAttribute('src')) {
      changePicture(event.target);
    }
  })

});

function logOut() {
  localStorage.clear();
  location.replace('/auth/logout');
}

let thisUser = localStorage.getItem('user'); // set the user


function setUser(userData) { // set the data in the user bio card
  userName.innerText += userData.name;
  userLevel.innerHTML += userData.level;
  userXP.innerHTML += userData.xp;
  userHP.innerHTML += userData.hp;
  userGold.innerHTML += userData.gold;
  if (userData.image) {
    userImg.setAttribute('src', userData.image)
  } else {
    userImg.setAttribute('src', '/monster/human_new.png');
  }
  if (userData.monsters.length === 0) {
    userMonsters.innerHTML += '1';
  } else {
    userMonsters.innerHTML += userData.monsters.length;
  }
  userWeapons.innerHTML += userData.weapons.length;
}


function makeBlankGoalCard() {
  goalsDropdown.appendChild(makeDiv(['card', 'card-body'])).innerHTML = '<p>No goals yet! Head over to the <a href="pages/goals.html">ADD GOALS</a> page to add some.</p>'
}

function makeBlankWeaponCard() {
  weaponsDropdown.appendChild(makeDiv(['card', 'card-body'])).innerHTML = '<p>No weapons yet! Head over to the <a href="pages/shop.html">SHOP</a> page to buy some.</p>'
}

function makeBlankMonsterCard() {
  monstersDropdown.appendChild(makeDiv(['card', 'card-body'])).innerHTML = '<p>No monsters yet! Head over to the <a href="pages/battle.html">BATTLE</a> page to fight for some.</p>'
}

function makeGoalCard(data) { //make the cards in the dropdown for goals
  data.forEach(x => {
    let ids = x.tasks.map(y => y.id);
    let item = goalsDropdown.appendChild(makeDiv(['card', 'card-body']))
    let row1 = item.appendChild(makeDiv(['row']));
    let col1 = row1.appendChild(makeDiv(['col']));
    let col2 = row1.appendChild(makeDiv(['col']));
    col1.innerHTML += `Goal: ${x.name}`;
    col2.appendChild(makeButton('complete', x.xp, ids.join('_'))) //set the button's id as the word complete, the experience from the goal, and the tasks associated with the goal.
    let row2 = item.appendChild(makeDiv(['row']));
    let col3 = row2.appendChild(makeDiv(['col']));
    let col4 = row2.appendChild(makeDiv(['col']));
    col3.innerHTML += `\nExperience: ${x.xp}`
    col4.appendChild(makeButton('remove', x.id));
    let row3 = item.appendChild(makeDiv(['row', 'mx-auto', 'text-center']));
    row3.innerHTML += '<strong>Click tasks to complete them.</strong>';
    let row4 = item.appendChild(makeDiv(['row', 'mx-auto', 'text-center']));
    addTasks(x.tasks, row4);
    if (localStorage.getItem(`complete${x.xp}tasks${ids.join('_')}`)) {
      item.classList.add('bg-dark');
    }
  });
}

function addTasks(data, item) {
  data.forEach(x => {
    item.appendChild(makeDiv(['col']))
      .innerHTML = `<a class = 'btn btn-dark text-white' id=${x.id}and${x.gold}>${x.name}</a>`
  });
}

function makeWeaponsCard(data) { //make the cards in the dropdown for weapons
  data.forEach(x => {
    let item = weaponsDropdown.appendChild(makeDiv(['card', 'card-body']));
    let row1 = item.appendChild(makeDiv(['row']));
    let col1 = row1.appendChild(makeDiv(['col']));
    col1.appendChild(makeImg(x.image));
    let col2 = row1.appendChild(makeDiv(['col']));
    col2.innerHTML += `<strong>${x.name}</strong>
    <p>${x.description}</p>
    <p><strong>Attack: </strong>${x.attack}</p>
    <p><strong>Chaos: </strong>${x.chaos}</p>`;
  });
}

function makeMonstersCard(data) { //make the cards in the dropdown for monsters
  data.forEach(x => {
    let item = monstersDropdown.appendChild(makeDiv(['card', 'card-body']));
    let row1 = item.appendChild(makeDiv(['row']));
    let col1 = row1.appendChild(makeDiv(['col']));
    col1.appendChild(makeImg(x.image));
    let col2 = row1.appendChild(makeDiv(['col']));
    col2.innerHTML += `<strong>${x.name}</strong>
    <p>${x.description}</p>
    <p><strong>Attack: </strong>${x.attack}</p>
    <p><strong>HP: </strong>${x.hp}</p>`;
  });
}

function makeImg(src) { // make an image for the weapons and monsters dropdowns
  let image = document.createElement('img');
  image.classList.add('weaponImg');
  image.setAttribute('src', src);
  return image;
}

function makeDiv(cl) { // make a div with a given class list array
  let div = document.createElement('div');
  cl.forEach(x => {
    div.classList.add(x);
  });
  return div;
}

function makeButton(type, id, tasks) { // make a button with given type and id
  let button = document.createElement('button');
  if (tasks) {
    button.id = `${type}${id}tasks${tasks}`
  } else {
    button.id = `${type}${id}`;
  }
  button.classList.add('btn');
  button.classList.add('btn-dark');
  button.classList.add('goalBut');
  button.innerText = type.toUpperCase();
  return button;
}

function changePicture(item) {
  thisUser = localStorage.getItem('user');
  console.log(thisUser);
  let source = item.getAttribute('src').replace('../images', '');
  userImg.setAttribute('src', source);
  axios.patch(`/users/${thisUser}`, {
    image: source
  });
}
