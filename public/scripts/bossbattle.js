const setHere = document.querySelector('#setHere');
// const url = 'https://fathomless-chamber-53771.herokuapp.com';

let attacks = ['assaulted', 'stabbed', 'struck', 'smashed', 'utterly mentally destroyed', 'insulted', 'upset', 'stood near', 'slightly wounded', 'touched', 'laughed at', 'wounded', 'praised'];

// Generates a random number between 1 and the num value
function randomNum(num) {
  return Math.floor(Math.random() * num) + 1
}

// Gives the amount of damage the user deals
function userAttack(ally, weapon, user, enemy) {
  let attackValue = ally.attack + weapon.attack
  let damage = 0

  damage += calcDamage(attackValue)
  damage += criticalWeapon(damage, weapon)
  damage += criticalAlly(damage, ally.attack, user.level, ally.name)
  let x = Math.floor(Math.random() * attacks.length);

  setHere.innerHTML += `<hr>You ${attacks[x]} ${enemy.name} for ${damage} damage!`
  console.log("You hit for: ", damage)
  return damage
}

// Gives the amount of damage the monster deals
function monsterAttack(monster) {
  let damage = 0

  damage += calcDamage(monster.attack)
  damage += criticalWeapon(damage, monster.attack)
  let x = Math.floor(Math.random() * attacks.length);

  setHere.innerHTML += `<br>${monster.name} ${attacks[x]} you for ${damage} damage!`

  console.log("Monster hit for: ", damage)
  return damage
}

// Calculates the damage. Each level has a 50% of adding 1 damage
function calcDamage(attackValue) {
  let damage = 0
  for (let i = 0; i < attackValue; i++) {
    if (50 >= randomNum(100)) {
      damage++
    }
  }
  return damage
}

// When a weapon crit is scored, double the damage
function criticalWeapon(damage, weapon) {
  let critChance = weapon.chaos * .01
  let critSuccess = Math.random().toFixed(2)

  if (critSuccess <= critChance) {
    setHere.innerHTML += `<br>The Gods smile upon you, critical hit!`
    console.log('The Gods smile upon you, critical hit!')
    return damage
  } else {
    return 0
  }
}

// When an ally crit is scored, add level to damage
function criticalAlly(damage, ally, level, name) {
  let critChance = ally * .01
  let critSuccess = Math.random().toFixed(2)

  if (critSuccess <= critChance) {
    setHere.innerHTML += `<br>Your ${name} tore into your opponent, scoring a critical hit!`
    console.log(`Your ${name} tore into your opponent, scoring a critical hit!`)
    return level
  } else {
    return 0
  }
}

// A back and forth attack function til a winner is determined
function dukeItOut(ally, weapon, monster, user) {
  let userHP = user.hp
  let monsterHP = monster.hp

  // while (userHP > 0 && monsterHP > 0) {

  monsterHP -= userAttack(ally, weapon, user, monster)
  console.log("Monster Health: ", monsterHP)
  if (monsterHP <= 0) {
    setHere.innerHTML += `<br>You slayed ${monster.name} with a ${weapon.name}!`
    console.log(`You slayed the monster with a ${weapon.name}!`)
    axios.post(`/monsters_users`, {
        user_id: user.id,
        monster_id: monster.id
      })
      .then(result => {
        setTimeout(() => victoryScreen(monster), 3000)
        console.log(result);
      })
    return `You slayed the monster with a ${weapon.name}!`
  }

  userHP -= monsterAttack(monster)
  console.log("User Health: ", userHP)
  if (userHP <= 0) {
    setHere.innerHTML += `<br>You were killed by ${monster.name}!`
    setTimeout(() => killScreen(monster), 3000)
    console.log("You were killed.")
    return "You were killed."
  }
  monster.hp = monsterHP;
  user.hp = userHP;
  setHere.innerHTML += `<br>Their health: ${monsterHP} | Your health: ${userHP}`

  // }
  if (userHP > 0 && monsterHP > 0) {
    setTimeout(() => {
      dukeItOut(ally, weapon, monster, user);
    }, 2000)
  }
}

function victoryScreen(monster) {
  setHere.innerHTML = '';
  setHere.innerHTML = `<h3 class='text-center text-white'>Congratulations!</h3><hr><img class = 'weaponImg' src=${monster.image} style='margin:auto;'><hr><h5 class = 'text-center text-white'>${monster.name} is now available as an ally.</h5>`
}

function killScreen(monster) {
  setHere.innerHTML = ''
  setHere.innerHTML = `<h3 class='text-center text-white'>You have been slain!</h3><hr><img class = 'weaponImg' src=${monster.image} style='margin:auto;'><hr><h5 class = 'text-center text-white'>${monster.name} was too great a foe.</h5>`
}
