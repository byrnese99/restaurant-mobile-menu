import { menuItems } from "/data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const main = document.querySelector('main');
const checkoutSection = document.querySelector(['.checkout-section'])
const orderedItems = document.querySelector(['.ordered-items'])
const paymentModal = document.querySelector(['.payment-modal'])
const totalPrice = document.querySelector(['.total-price'])
const paymentMessage = document.querySelector(['.payment-message'])
let isOrdered = false
let orderedItemsHTML = [];
let checkoutItems = []
let cost = 0

function getMenuItems(){
    let mainHTML = ''
    menuItems.forEach(function(item){
        mainHTML += `
        <section class="menu-item">
            <p class="item-img">${item.image}</p>
            <div class="item-text-wrap">
                <h2 class="item-text title" id="${item.id}">${item.name}</h2>
                <p class="item-text ingredients">${item.ingredients}</p>
                <p class="item-text price" id="${item.id}-price">$${item.price}</p>
            </div>
            <button class="add-btn" data-add='${item.id}'>+</button>
        </section>
        `
    })
    return mainHTML
}

function renderMenu(){
    main.innerHTML = getMenuItems()
}

function renderCheckout(){
    if (orderedItemsHTML.length > 0){
        checkoutSection.style.display = 'flex'
    }
    else{
        checkoutSection.style.display = 'none'
    }
}

function addCheckoutItem(item){
    for (let menuItem of menuItems){
        if(menuItem.id === item){
            let id = uuidv4();
            let price = menuItem.price
            checkoutItems.push([id, `<li class='item'><p><button class='remove-btn' id='${id}'>X</button>${menuItem.name}</p><p class="price">$${price}</p></li>`, price])
            orderedItemsHTML.push(`<li class='item'><p><button class='remove-btn' id='${id}'>X</button>${menuItem.name}</p><p class="price">$${price}</p></li>`)
            cost += price
        }
    }
    totalPrice.innerHTML = `$${cost}`
    orderedItems.innerHTML = orderedItemsHTML.join('')
}

function removeCheckoutItem(item){
    for (let arr of checkoutItems){
        if (arr.includes(item)){
            let arrIndex = checkoutItems.indexOf(arr)
            for (let orderedItem of orderedItemsHTML){
                if (orderedItem === arr[1]){
                    let orderedItemIndex = orderedItemsHTML.indexOf(orderedItem)
                    if (orderedItemIndex >= -1){
                        orderedItemsHTML.splice(orderedItemIndex, 1)
                    }
                }
            }
            cost -= Number(arr[2])
            if (arrIndex >= -1){
                checkoutItems.splice(arrIndex, 1)
            }
        }
    }
    totalPrice.innerHTML = `$${cost}`
    orderedItems.innerHTML = orderedItemsHTML.join('')
}


function renderCheckoutModal(){
    paymentModal.style.display = 'flex'
}

function paymentBtnPressed(){
    orderedItemsHTML = []
    checkoutItems  = []
    renderCheckout();
    paymentModal.style.display = 'none'
    paymentMessage.style.display = 'flex'
}

document.addEventListener('click', (e) => {
    e.preventDefault()
    if(e.target.dataset.add){
        addCheckoutItem(e.target.dataset.add);
    }
    else if (e.target.className === 'remove-btn'){
        console.log(e.target.id)
        removeCheckoutItem(e.target.id)
    }
    else if(e.target.id === 'complete-order-btn'){
        renderCheckoutModal()
    }
    else if(e.target.id === 'pay-btn'){
        if(document.querySelector([".payment-inputs"]).reportValidity()){
            paymentBtnPressed();
        }
    }
    renderCheckout();
})

renderMenu();