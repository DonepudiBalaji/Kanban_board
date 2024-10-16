let add_btn = document.querySelector('.add-btn')
let modal_cont = document.querySelector('.modal-cont')
let main_cont = document.querySelector('.main-cont')
let remove_btn = document.querySelector('.remove-btn')

let textAreaCont = document.querySelector('.textarea-cont')
let allPriorityColors = document.querySelectorAll('.priority-color')
//console.log(allPriorityColors)
let toolboxColors = document.querySelectorAll('.color-box')
let ticketsArr = []

let colors = ['lightpink', 'lightgreen', 'lightblue', 'black']

let modalPriorityColor = 'lightpink'
let lockClass = 'fa-lock'
let unlockClass = 'fa-lock-open'

let removeTaskFlag = false;
//Add Button Functionality
let addTaskFlag = false

add_btn.addEventListener('click', function () {
    //flag
    addTaskFlag = !addTaskFlag
    //console.log(addTaskFlag)
    if (addTaskFlag === true) {
        modal_cont.style.display = 'flex'
    }
    else {
        modal_cont.style.display = "none"
    }
})

//Modal Container functionality
modal_cont.addEventListener('keydown', function (e) {
    let key = e.key
    //console.log(key)
    if (key == 'Shift') {
        //console.log('Shift key clicked')
        createTicket(textAreaCont.value, modalPriorityColor)
        modal_cont.style.display = "none"
        textAreaCont.value=''
    }
})

function createTicket(textarea, textColorClass, ticketId) {
    let id = ticketId || shortid()  //generating the random id's
    //console.log(id)
    let ticketCont = document.createElement('div')
    ticketCont.setAttribute('class', 'tickets-cont')
    ticketCont.innerHTML = `
            <div class="ticket-color ${textColorClass}">
            </div>
            <div class="ticket-id">
                ${id}
            </div>
            <div class="ticket-task">
                ${textarea}
            </div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>`
    main_cont.appendChild(ticketCont)
    handleLock(ticketCont,id)
    hadnleRemoval(ticketCont,id)
    handleColorBand(ticketCont ,id)
    if (!ticketId) {
        ticketsArr.push({ textarea, textColorClass, ticketId: id })
        //setting the data in a local storage
        localStorage.setItem('tickets', JSON.stringify(ticketsArr))
    }
    console.log(ticketsArr)
}

//get items from the localStorage
if(localStorage.getItem('tickets')){
    ticketsArr = JSON.parse(localStorage.getItem('tickets'))
    ticketsArr.forEach(function(ticket){
        createTicket(ticket.textarea , ticket.textColorClass , ticket.ticketId)
    })
}

//get index function
function getTicketIndex(id){
    let ticketIndex = ticketsArr.findIndex(function(ticketObj){
        return ticketObj.ticketId = id
    })
    return ticketIndex
}

//Selecting the color
allPriorityColors.forEach(function (colorElem) {
    colorElem.addEventListener('click', function () {
        allPriorityColors.forEach(function (priorityColorElem) {
            priorityColorElem.classList.remove('active')
        })
        colorElem.classList.add('active')
        modalPriorityColor = colorElem.classList[0]
        //console.log(modalPriorityColor)
    })
})

//handle Lock 
function handleLock(ticket , id) {
    let ticketElem = ticket.querySelector(".ticket-lock")
    let ticketLockIcon = ticketElem.children[0]
    let taskArea = ticket.querySelector('.ticket-task')

    ticketLockIcon.addEventListener('click', function () {
        let ticketIndex = getTicketIndex(id)
        if (ticketLockIcon.classList.contains(lockClass)) {
            ticketLockIcon.classList.remove(lockClass)
            ticketLockIcon.classList.add(unlockClass)
            taskArea.setAttribute('contenteditable', 'true')
        }
        else {
            ticketLockIcon.classList.remove(unlockClass)
            ticketLockIcon.classList.add(lockClass)
            taskArea.setAttribute('contenteditable', 'false')
        }
        ticketsArr[ticketIndex].textarea = taskArea.innerText
        localStorage.setItem('tickets', JSON.stringify(ticketsArr))
    })
}

//Delete the ticket
remove_btn.addEventListener('click', function () {
    removeTaskFlag = !removeTaskFlag
    if (removeTaskFlag === true) {
        alert("Delete button Activated")
        modal_cont.style.display = "none"
        remove_btn.style.color = 'red'
    }
    else {
        alert("Delete button Deactivated")
        remove_btn.style.color = 'white'
    }
})
function hadnleRemoval(ticket,id) {
    ticket.addEventListener('click', function () {
        let index = getTicketIndex(id)
        if (!removeTaskFlag) return
        ticket.remove()
        ticketsArr.splice(index,1)
        localStorage.setItem('tickets', JSON.stringify(ticketsArr))
    })
}

//Changing the color band
function handleColorBand(ticket,id) {
    let ticketColorBand = ticket.querySelector('.ticket-color')
    ticketColorBand.addEventListener('click', function () {
        let colorIndex = getTicketIndex(id)
        let currentColor = ticketColorBand.classList[1]
        //console.log(currentColor)
        //finding the color index
        let currentColorIndex = colors.findIndex(function (color) {
            return currentColor === color
        })
        //console.log(currentColorIndex)
        currentColorIndex++;

        let newColorIndex = currentColorIndex % colors.length
        let newColorValue = colors[newColorIndex]

        ticketColorBand.classList.remove(currentColor)
        ticketColorBand.classList.add(newColorValue)

        ticketsArr[colorIndex].textColorClass = newColorValue
        localStorage.setItem('tickets', JSON.stringify(ticketsArr))
    })
}

//Making task visible based on colors
for (let i = 0; i < toolboxColors.length; i++) {
    toolboxColors[i].addEventListener('click', function () {
        let selectedColorBox = toolboxColors[i].classList[0]
        //console.log(selectedColorBox)
        let allTickets = document.querySelectorAll('.tickets-cont')
        for (let i = 0; i < allTickets.length; i++) {
            allTickets[i].remove()
            console.log(allTickets[i].remove())
        }
        let filteredTicketColor = ticketsArr.filter(function (ticket) {
            return selectedColorBox === ticket.textColorClass
        })
        console.log(filteredTicketColor)

        filteredTicketColor.forEach(function (filteredTicket) {
            createTicket(filteredTicket.textarea, filteredTicket.textColorClass, filteredTicket.ticketId)
        })
    })
}
