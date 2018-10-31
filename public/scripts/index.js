document.addEventListener(`DOMContentLoaded`, () => {
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
  const userPasses = document.querySelector('#userPasses');
  const userGold = document.querySelector('#userGold');
  const userImg = document.querySelector('#userImg');

  const logInButton = document.querySelector('#logInButton');
  const imgModal = document.querySelector('#imgModal');

  axios.get(`/users/verify`).then(result => {
    localStorage.setItem('user', result.data.id)
    let user = result.data
    setUser(user);
    axios.get(`/weapons`).then(result => {
      let weps = result.data.filter(x => {
        return user.weapons.includes(x.id);
      });
      makeWeaponsCard(weps)
      axios.get(`/monsters`).then(result => {
        let mons = result.data.filter(y => {
          return user.monsters.includes(y.id);
        });
        makeMonstersCard(mons);
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

  logInButton.addEventListener('click', logIn);

  imgModal.addEventListener('click', event => {
    console.log(event.target);
    if (event.target.hasAttribute('src')){
      changePicture(event.target);
    }
  })

});

function logIn() {
  location.replace('/auth/github');
}

const thisUser = localStorage.getItem('user'); // set the user


function setUser(userData) { // set the data in the user bio card
  userName.innerText += userData.name;
  userLevel.innerHTML += userData.level;
  userXP.innerHTML += userData.xp;
  userHP.innerHTML += userData.hp;
  userGold.innerHTML += userData.gold;
  userPasses.innerHTML += userData.passes;
  userMonsters.innerHTML += userData.monsters.length;
  userWeapons.innerHTML += userData.weapons.length;
  if (userData.image) {
    userImg.setAttribute('src', userData.image)
  }
}


function makeBlankGoalCard() {
  goalsDropdown.appendChild(makeDiv(['card', 'card-body'])).innerText = 'No goals yet! Head over to the ADD GOALS page to add some.'
}

function makeGoalCard(data) { //make the cards in the dropdown for goals
  data.forEach(x => {
    let ids = x.tasks.map(y => y.id);
    let item = goalsDropdown.appendChild(makeDiv(['card', 'card-body']))
    let row1 = item.appendChild(makeDiv(['row']));
    let col1 = row1.appendChild(makeDiv(['col']));
    let col2 = row1.appendChild(makeDiv(['col']));
    col1.innerHTML += `Goal: ${x.name}`;
    col2.appendChild(makeButton('complete', x.xp, ids.join(''))) //set the button's id as the word complete, the experience from the goal, and the tasks associated with the goal.
    let row2 = item.appendChild(makeDiv(['row']));
    let col3 = row2.appendChild(makeDiv(['col']));
    let col4 = row2.appendChild(makeDiv(['col']));
    col3.innerHTML += `\nExperience: ${x.xp}`
    col4.appendChild(makeButton('remove', x.id));
    let row3 = item.appendChild(makeDiv(['row']));
    row3.innerHTML += '<strong>Click tasks to complete them.</strong>'
    addTasks(x.tasks, row3);
    if (localStorage.getItem(`complete${x.xp}tasks${ids.join('')}`)) {
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
  let source = item.getAttribute('src');
  userImg.setAttribute('src', source);
  axios.patch(`user/${thisUser}`, {image: source});
}
