let user = {
  id: 1,
  name: 'TimRemingtonSux',
  level: 4,
  gold: 10,
  hp: 20,
  experience: 0,
  points_toward_pass: 0,
  passes: 0,
  image: ''
}

let ally = {
  id: 1,
  name: 'Dog',
  description: 'Barkus',
  attack: 4,
  hp: 5,
  image: ''
}

let monster = {
  id: 2,
  name: 'Skeleton Minion',
  description: 'Spooky horn-playing skeletal monster',
  attack: 12,
  hp: 15,
  image: ''
}

let weapon = {
  id: 1,
  name: 'broadsword',
  description: 'The look that hurts the most.',
  attack: 6,
  chaos: 20
}


// Generates a random number between 1 and the num value
function randomNum(num) {
  return Math.floor(Math.random() * num) + 1
}

// Gives the amount of damage the user deals
function userAttack(ally, weapon, user) {
  let attackValue = ally.attack + weapon.attack
  let damage = 0

  damage += calcDamage(attackValue)
  damage += criticalWeapon(damage, weapon)
  damage += criticalAlly(damage, ally.attack, user.level)

  console.log("You hit for: ", damage)
  return damage
}

// Gives the amount of damage the monster deals
function monsterAttack(monster) {
  let damage = 0

  damage += calcDamage(monster.attack)
  damage += criticalWeapon(damage, monster.attack)

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
    console.log('The Gods smile upon you, critical hit!')
    return damage
  } else {
    return 0
  }
}

// When an ally crit is scored, add level to damage
function criticalAlly(damage, ally, level) {
  let critChance = ally * .01
  let critSuccess = Math.random().toFixed(2)

  if (critSuccess <= critChance) {
    console.log(`Your ${ally.name} torn into your opponent, scoring a critical hit!`)
    return level
  } else {
    return 0
  }
}

// A back and forth attack function til a winner is determined
function dukeItOut(ally, weapon, monster, user) {
  let userHP = user.hp
  let monsterHP = monster.hp

  while (userHP > 0 && monsterHP > 0) {

    monsterHP -= userAttack(ally, weapon, user)
    console.log("Monster Health: ", monsterHP)
    if (monsterHP <= 0) {
      console.log(`You slayed the monster with a ${weapon.name}!`)
      return `You slayed the monster with a ${weapon.name}!`
    }

    userHP -= monsterAttack(monster)
    console.log("User Health: ", userHP)
    if (userHP <= 0) {
      console.log("You were killed.")
      return "You were killed."
    }
  }



}

dukeItOut (ally, weapon, monster, user)
