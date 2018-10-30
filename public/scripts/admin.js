document.addEventListener('DOMContentLoaded', () => {

console.log('DOM WORKING')

getWeapons()
getMonsters()
addMonster()
addWeapon()
})

function addWeapon() {

  let submitWeapon = document.getElementById('create-weapon')

  submitWeapon.addEventListener('submit', (ev) => {
    ev.preventDefault()

    let weaponData = {}

    let formElements = ev.target.elements

    for (let i = 0; i < formElements.length; i++) {
      let inputElements = formElements[i].name
      if (inputElements) {
        weaponData[inputElements] = formElements[i].value
      }
    }
    console.log('Weapon Data >>>> ', weaponData);

    axios.post('/weapons', weaponData)
      .then((response) => {
        location.reload()
      })
      .catch((error) => {
        console.log(error);
      })

  })
}

function addMonster() {

  let submitMonster = document.getElementById('create-monster')

  submitMonster.addEventListener('submit', (ev) => {
    ev.preventDefault()

    let monsterData = {}

    let formElements = ev.target.elements

    for (let i = 0; i < formElements.length; i++) {
      let inputElements = formElements[i].name
      if (inputElements) {
        monsterData[inputElements] = formElements[i].value
      }
    }
    console.log('Monster Data >>>>', monsterData);

    axios.post('/monsters', monsterData)
      .then((response) => {
        location.reload()
      })
      .catch((error) => {
        console.log(error);
      })

  })
}

function getWeapons() {
  axios.get('/weapons')
    .then((response) => {
      let update_weapon = document.getElementById('edit-weapon')
      update_weapon.style.display = "none"
      console.log(response.data)

      let tbody = document.querySelector('#weapons-table tbody')

      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild)
      }

      // DOM Manipulation, need to create TRs, TDs
      response.data.forEach((weapon) => {
        let tr = document.createElement('tr')
        let name = document.createElement('tr')
        let description = document.createElement('td')
        let attack = document.createElement('td')
        let chaos = document.createElement('td')
        let image = document.createElement('td')
        let cost = document.createElement('td')
        let edit_td = document.createElement('td')
        let edit_button = document.createElement('button')
        let del_td = document.createElement('td')
        let del_button = document.createElement('button')

        name.innerText = weapon.name
        description.innerText = weapon.description
        attack.innerText = weapon.attack
        chaos.innerText = weapon.chaos
        image.innerText = weapon.image
        cost.innerText = weapon.cost

        edit_button.innerText = "Edit Weapon"
        edit_button.setAttribute('weapon-edit-id', weapon.id)
        edit_button.addEventListener('click', (ev) => {
          ev.preventDefault()
          let weaponEditId = ev.target.getAttribute('weapon-edit-id')

          let createWeapon = document.getElementById('create-weapon')

          update_weapon.style.display = "block"
          createWeapon.style.display = "none"

          //target all text areas in update form
          let name = document.getElementById('edit-weapon-name')
          let description = document.getElementById('edit-weapon-description')
          let attack = document.getElementById('edit-weapon-attack')
          let chaos = document.getElementById('edit-weapon-chaos')
          let image = document.getElementById('edit-weapon-image')
          let cost = document.getElementById('edit-weapon-cost')


          //fill all text areas with the value of each key from the table when update is clicked
          name.value = weapon.name
          description.value = weapon.description
          attack.value = weapon.attack
          chaos.value = weapon.chaos
          image.value = weapon.image
          cost.value = weapon.cost

          let submit_edit = document.getElementById('submit-edit-weapon')
          //add event listener to update the row on click
          submit_edit.addEventListener('click', (event) => {
            event.preventDefault()
            //make data object to be used with axios put
            let data = {
              name: name.value,
              description: description.value,
              attack: attack.value,
              chaos: chaos.value,
              image: image.value,
              cost: cost.value
            }

            axios.patch(`/weapons/${weaponEditId}`, data)
              .then((response) => {
                location.reload()
              })
              .catch((err) => {
                console.log(err)
              })
          })
        })

        del_button.innerText = "X"
        del_button.setAttribute('data-id', weapon.id)
        del_button.addEventListener('click', (ev) => {
          ev.preventDefault()
          let recordId = ev.target.getAttribute('data-id')
          console.log('id', recordId);

          // DELETE THIS RECORD!
          axios.delete(`/weapons//${recordId}`)
            .then((response) => {
              console.log(response)
              ev.target.parentElement.parentElement.remove()
            })
            .catch((err) => {
              console.log(err)
            })
        })

        // append IMG, to the TD, append TDs to the TR, the TR to the TBODY
        edit_td.appendChild(edit_button)
        del_td.appendChild(del_button)
        tr.appendChild(name)
        tr.appendChild(description)
        tr.appendChild(attack)
        tr.appendChild(chaos)
        tr.appendChild(image)
        tr.appendChild(cost)
        tr.appendChild(edit_td)
        tr.appendChild(del_td)
        tbody.appendChild(tr)
      })

    })
    .catch((error) => {
      console.log(error)
    })
}

function getMonsters() {
  axios.get('/monsters')
    .then((response) => {
      let update_monster = document.getElementById('edit-monster')
      update_monster.style.display = "none"
      console.log(response.data)

      let tbody = document.querySelector('#monsters-table tbody')

      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild)
      }

      // DOM Manipulation, need to create TRs, TDs
      response.data.forEach((monster) => {
        let tr = document.createElement('tr')
        let name = document.createElement('tr')
        let description = document.createElement('td')
        let attack = document.createElement('td')
        let hp = document.createElement('td')
        let image = document.createElement('td')
        let edit_td = document.createElement('td')
        let edit_button = document.createElement('button')
        let del_td = document.createElement('td')
        let del_button = document.createElement('button')

        name.innerText = monster.name
        description.innerText = monster.description
        attack.innerText = monster.attack
        hp.innerText = monster.hp
        image.innerText = monster.image

        edit_button.innerText = "Edit Monster"
        edit_button.setAttribute('monster-edit-id', monster.id)
        edit_button.addEventListener('click', (ev) => {
          ev.preventDefault()
          let monsterEditId = ev.target.getAttribute('monster-edit-id')

          let createMonster = document.getElementById('create-monster')

          update_monster.style.display = "block"
          createMonster.style.display = "none"

          //target all text areas in update form
          let name = document.getElementById('edit-monster-name')
          let description = document.getElementById('edit-monster-description')
          let attack = document.getElementById('edit-monster-attack')
          let hp = document.getElementById('edit-monster-hp')
          let image = document.getElementById('edit-monster-image')

          //fill all text areas with the value of each key from the table when update is clicked
          name.value = monster.name
          description.value = monster.description
          attack.value = monster.attack
          hp.value = monster.hp
          image.value = monster.image

          let submit_edit = document.getElementById('submit-edit-monster')
          //add event listener to update the row on click
          submit_edit.addEventListener('click', (event) => {
            event.preventDefault()
            //make data object to be used with axios put
            let data = {
              name: name.value,
              description: description.value,
              attack: attack.value,
              hp: hp.value,
              image: image.value
            }

            axios.patch(`/monsters/${monsterEditId}`, data)
              .then((response) => {
                location.reload()
              })
              .catch((err) => {
                console.log(err)
              })
          })
        })

        del_button.innerText = "X"
        del_button.setAttribute('data-id', monster.id)
        del_button.addEventListener('click', (ev) => {
          ev.preventDefault()
          let recordId = ev.target.getAttribute('data-id')
          console.log('id', recordId);

          // DELETE THIS RECORD!
          axios.delete(`/monsters/${recordId}`)
            .then((response) => {
              console.log(response)
              ev.target.parentElement.parentElement.remove()
            })
            .catch((err) => {
              console.log(err)
            })
        })

        // append IMG, to the TD, append TDs to the TR, the TR to the TBODY
        edit_td.appendChild(edit_button)
        del_td.appendChild(del_button)
        tr.appendChild(name)
        tr.appendChild(description)
        tr.appendChild(attack)
        tr.appendChild(hp)
        tr.appendChild(image)
        tr.appendChild(edit_td)
        tr.appendChild(del_td)
        tbody.appendChild(tr)
      })

    })
    .catch((error) => {
      console.log(error)
    })
}
