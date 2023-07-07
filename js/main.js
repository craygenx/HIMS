
const form = document.getElementById('accountForm');
const inventoryForm = document.getElementById('ineventory');
let userData;
let mainAccount;
let clicked = false;

document.addEventListener('DOMContentLoaded', ()=>{});
//control the registration form tabs login/signup
function regFormTabControl(e){
    const submit = document.getElementById('regSubmit');
    const tab = e.target;
    form.className = tab.id;
    if(tab.id === 'LOGIN'){
        tab.style.color = '#e9f358'
        const previousTab = document.getElementById('SIGNUP');
        previousTab.style.color = 'black';
    }else if(tab.id === 'SIGNUP') {
        tab.style.color = '#e9f358'
        const previousTab = document.getElementById('LOGIN');
        previousTab.style.color = 'black';
    }
    submit.textContent = tab.id;
}
//on submit switch between login and signup
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(form.className === 'LOGIN'){
        fetch('http://localhost:3000/accounts')
        .then(res => res.json())
        .then(data => {
            const account = data.find(obj => obj.hasOwnProperty(username));
            if(account){
                if(password === account[username].password){
                    const homepage = document.getElementById('homepage');
                    const accModal = document.getElementById('accModal');
                    alertMessage(`Hello ${username}, logIn succeful!`, 'green');
                    mainAccount = account[username];
                    homepage.style.opacity = '1';
                    homepage.style.backgroundColor = '#ffffff';
                    accModal.style.display = 'none';
                    handleMainTab();
                    addShelfItem();
                    loadAccountData(account, username);
                    createShoppingList();
                    availablePantryItems();
                    form.reset();
                }else{
                    alertMessage(`Error: Incorrect password please try again`, 'red');
                    form.reset();
                }
            }else{
                const msg = `Error: User ${username} not Found!`;
                alertMessage(msg, 'red');
                form.reset();
            }
        }).catch(err => alertMessage(`${err}: ${err.message}`, 'red'));
    } else if(form.className === 'SIGNUP') {
        const postData =  {
            [username] : {
                username: username,
                password: password,
                quotations: [],
                pantry_items : {}
            }
        }
        fetch('http://localhost:3000/accounts',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'appliction/json'
            },
            body: JSON.stringify(postData)
        })
        .then(() => {
            alertMessage(`user ${username} added succesfully!`, 'green');
            homepage.style.opacity = '1';
            homepage.style.backgroundColor = '#ffffff';
            accModal.style.display = 'none';
            handleMainTab();
            addShelfItem();
            loadAccountData(account, username);
            createShoppingList();
            availablePantryItems();
            form.reset();
        })
        .catch(err => alertMessage(`Error ${err}: ${err.message}`, 'red'));
    }
});
//custome alert for different messages
function alertMessage(message, color){
    const alertModal = document.getElementById('alertmsg');
    alertModal.textContent = message;
    alertModal.style.display = 'flex';
    alertModal.style.backgroundColor = color;
    setTimeout(()=>{
        alertModal.style.display = 'none';
    }, 3000)
}
function loadAccountData(account, username){
    userData = account;
    const navName = document.getElementById('navName');
    const salutations = document.getElementById('dashUsername');
    const availableItems = document.getElementById('availableCount');
    navName.textContent = `${account[username].username}`;
    salutations.textContent = `${account[username].username}`;
    availableItems.textContent = `${account[username].pantry_items.length}`;
}
inventoryForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const itemImage = document.getElementById('shelfItemImageSide');
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = document.getElementById('itemQuantity').value;
    const itemThreshold = document.getElementById('threshCount').value || document.getElementById('threshCount').placeholder;
    const category = document.getElementById('setCategory');
    itemImage.alt = category.value;

    const data = {
        [itemName]:{
            "imageUrl": imageUrl,
            "itemName": itemName,
            "itemQuantity": itemQuantity,
            "itemThreshold": itemThreshold,
            "category": category.value
            }
    }
    handleAddItem(data, mainAccount.username, category.value)

})
function openInventoryBoard() {
    const inventoryBoard = document.getElementById('inventoryBoard');
    const homepage = document.getElementById('homepage');
    inventoryBoard.style.display = 'flex';
    homepage.style.opacity = '0.2';
    homepage.style.backgroundColor = '#ffffff';
}
function handleAddItem(data, username, category){
    if(userData[username]["pantry_items"][category]){
        userData[username]["pantry_items"][category].push(data);
        fetch(`http://localhost:3000/accounts/${userData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    }else{
        userData[username]["pantry_items"][`${category}`] = [data]
        fetch(`http://localhost:3000/accounts/${userData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    }
}
function closeInventory(){
    const inventoryBoard = document.getElementById('inventoryBoard');
    inventoryBoard.style.display = 'none';
    const homepage = document.getElementById('homepage');
    homepage.style.opacity = '1';
}
function updateImage() {
    const itemImage = document.getElementById('shelfItemImageSide');
    const nameValue = document.getElementById('itemName').value
    fetch(`http://localhost:3000/images`)
        .then(res => res.json())
        .then(images => {
            console.log(nameValue)
            const account = images.find(obj => obj.hasOwnProperty(nameValue));
            console.log(account)
            if(account){
                itemImage.src = account[nameValue];
                imageUrl = account[nameValue];
            }else{
                const account = images.find(obj => obj.hasOwnProperty('default'));
                itemImage.src = account["default"],
                imageUrl = account["default"];
            }
        })
}
function handleThreshold(){
    const itemQuantity = document.getElementById('itemQuantity').value;
    const itemThreshold = document.getElementById('threshCount');
    const percentage = Math.floor(parseInt(itemQuantity)*0.5);
    itemThreshold.placeholder = percentage;
}
function unWrap(data, divId){
    if(data){
        data.forEach(item => {
            let key = Object.keys(item)[0];
            let { imageUrl, itemName, itemQuantity, itemThreshold, category } = item[key];
            const shelfItemCont = document.createElement('div');
            const shelvesData = document.getElementById(divId);
            shelfItemCont.className = 'shelfItemCont';
            shelfItemCont.id = 'shelfItemCont'
            shelfItemCont.innerHTML = `
                <div class="imageShelfItem" onclick='displayShelfItem(event)'>
                    <img src=${imageUrl} alt="">
                </div>
                <div class="shelfItemDetails">
                    <div class="nameQty">
                        <div>${itemName}</div>
                        <div style="font-style: italic;">${itemQuantity} items</div>
                        <div style='none'>${category}</div>
                    </div>
                    <div class="circCont" style="background-color: beige;">${itemThreshold}</div>
                </div>
            `;
            shelvesData.appendChild(shelfItemCont);
        });
    }//else{
    //     const shelvesData = document.getElementById(divId);
    //     shelvesData.innerHTML=`<img src="./assets/noData.avif" alt="no Data" style="width: 30%; height: 100%">`;
    //     shelvesData.style.display = 'flex';
    //     shelvesData.style.justifyContent = 'center'
    // }
}
function addShelfItem(){
    // if(mainAccount['pantry_items']['cereals']){
    //     const cereals = mainAccount['pantry_items']['cereals'];
    //     const groceries = mainAccount['pantry_items']['grocery'];
    //     const spices = mainAccount['pantry_items']['spices'];
    //     const drinks = mainAccount['pantry_items']['drinks'];
    //     unWrap(cereals, 'shelvesData');
    //     unWrap(groceries, 'shelvesData');
    //     unWrap(spices, 'shelvesData');
    //     unWrap(drinks, 'shelvesData');
    // }
    if(Object.keys(mainAccount['pantry_items']).length !== 0){
        const tabs = Object.keys(mainAccount['pantry_items']);
        tabs.forEach((tab) => {
            const data = mainAccount['pantry_items'][tab];
            unWrap(data, 'shelvesData');
        });

        displayItemsOnMain(tabs[0])
    }
}
function displayShelfItem(e) {
    const image =document.getElementById('shelfItemImageSide')
    const form = document.getElementById('ineventory');
    const itemName =document.getElementById('itemName')
    const itemqty =document.getElementById('itemQuantity')
    const category =document.getElementById('setCategory')
    const thresh =document.getElementById('threshCount')
    const addBtn = document.getElementById('addItemBtn');
    //const catDiv = document.getElementById('catcat');
    const lbl = document.getElementById('lbl');
    const l1 = document.getElementById('lbl1');
    const blaah = e.target.closest('div');
    const detailsDiv = blaah.nextElementSibling;
    const detailsElementList = detailsDiv.children;
    const nameQtyElements = detailsElementList[0].children;
    const threshcount = detailsDiv.lastElementChild;
    itemqty.removeEventListener('change', handleThreshold());
    itemqty.addEventListener('change', handleThreshholdNotification())
    lbl.style.display = 'none';
    l1.style.display = 'none';
    image.src = e.target.src;
    category.value = nameQtyElements[1].nextElementSibling.textContent;
    itemName.placeholder = nameQtyElements[0].textContent;
    itemqty.placeholder = nameQtyElements[1].textContent;
    thresh.placeholder = threshcount.textContent;
    addBtn.textContent = 'Update'
    handleThreshholdNotification();
    addBtn.removeAttribute('type');
    itemqty.removeAttribute('onchange');
    itemqty.setAttribute('onchange', 'handleThreshholdNotification()');
    addBtn.setAttribute('onclick', 'editItem()')
}
function handleMainTab(){
    const dashPantryTabs = document.getElementById('dashPantryTabs');
    if(Object.keys(mainAccount['pantry_items']).length !== 0){
        const tabs = Object.keys(mainAccount['pantry_items']);
        tabs.forEach((tab, index) => {
            const div = document.createElement('div');
            div.setAttribute('onclick', 'mainTab(event)');
            div.id = tab;
            div.innerHTML = `
                ${tab}
            `;
            dashPantryTabs.appendChild(div);
            if(index === 0){
                div.className = 'current'
            }
        });

        displayItemsOnMain(tabs[0])
    }
}
function displayItemsOnMain(tab) {
    const tabTitle = mainAccount['pantry_items'][`${tab}`];
    unWrap(tabTitle, 'pantryData');
}
//edit item
function editItem(){
    const form = document.getElementById('ineventory')
    const image =document.getElementById('shelfItemImageSide');
    const itemName =document.getElementById('itemName').value || document.getElementById('itemName').placeholder
    const itemqty =document.getElementById('itemQuantity').value || document.getElementById('itemQuantity').placeholder
    const category =document.getElementById('setCategory').value
    const thresh =document.getElementById('threshCount').value || document.getElementById('threshCount').placeholder
    const addBtn = document.getElementById('addItemBtn');
    const input = document.getElementById('itemQuantity');
    const index = userData[mainAccount.username]["pantry_items"][`${category}`].findIndex(obj => itemName in obj)
    userData[mainAccount.username]["pantry_items"][`${category}`][parseInt(index)][`${itemName}`].itemName = itemName;
    userData[mainAccount.username]["pantry_items"][`${category}`][parseInt(index)][`${itemName}`].itemQuantity = itemqty;
    userData[mainAccount.username]["pantry_items"][`${category}`][parseInt(index)][`${itemName}`].itemThreshold = thresh;
    userData[mainAccount.username]["pantry_items"][`${category}`][parseInt(index)][`${itemName}`].category = category;
    fetch(`http://localhost:3000/accounts/${2}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(()=>{
        form.reset();
        alertMessage(`${itemName} updated succesfully`, 'green');
    });
    input.removeAttribute('change');
    addBtn.setAttribute('type', 'submit');
    input.setAttribute('change', 'handleThreshold()');
}
function mainTab(e) {
    const current = document.getElementsByClassName('current')[0]
    current.removeAttribute('class')
    e.target.className = 'current';
    const id = e.target.id;
    const shelvesData = document.getElementById('pantryData');
    shelvesData.innerHTML = ``;
    displayItemsOnMain(id);
}
function handleThreshholdNotification(){
    const thresh =document.getElementById('threshCount').placeholder
    const itemqty2 =document.getElementById('itemQuantity')
    const itemName =document.getElementById('itemName').value || document.getElementById('itemName').placeholder
    const change = parseInt(itemqty2.value)

    if(change<=thresh){
        if(mainAccount.quotations.includes(itemName) === false){
            userData[mainAccount.username]["quotations"].push(itemName);
            fetch(`http://localhost:3000/accounts/${userData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        }
    }
}
function createCalendar() {
    const calendar = document.getElementById('calendarCont');
    const currentDate = new Date();

    // Get the current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Create a date object for the first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);

    // Determine the number of days in the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create the calendar grid
    let calendarHTML = '<table>';
    calendarHTML += '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';

    let dateCount = 1;
    for (let week = 0; week < 6; week++) {
        calendarHTML += '<tr>';
        for (let day = 0; day < 7; day++) {
            if ((week === 0 && day < firstDay.getDay()) || dateCount > lastDay) {
                calendarHTML += '<td></td>'; // Empty cell before the first day and after the last day
            } else {
                const isCurrentDate = dateCount === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
                calendarHTML += `<td class="${isCurrentDate ? 'current-date' : ''}">${dateCount}</td>`;
                dateCount++;
            }
        }
        calendarHTML += '</tr>';

        if (dateCount > lastDay) {
            break; // Stop creating rows if all days have been added
        }
    }

    calendarHTML += '</table>';
    calendar.innerHTML = calendarHTML;
}
createCalendar()
function createShoppingList(){
    fetch('http://localhost:3000/shop_yetu')
    .then(res => res.json())
    .then(data => {
        if(mainAccount.quotations.length > 0){
            mainAccount.quotations.forEach(item => {
                const product = data.find(key => key.hasOwnProperty(item));
                if(product){
                    const shoppingList = document.getElementById('shoppingList');
                    const listItem = document.createElement('div');
                    listItem.className = 'listItem';
                    listItem.innerHTML=`
                            <div>${item}</div>
                            <div id="price">${product[item]}</div>
                            <input type="text" placeholder="1" onchange='shoppingItemMultiplier(event)' style="width: 50px; border: none; background-color: transparent;">
                    `;
                    shoppingList.appendChild(listItem);
                }
            });
        }else{
            const shoppingList = document.getElementById('shoppingList');
            shoppingList.innerHTML =`<img src="./assets/noData.avif" alt="no Data" style="width: 100%; height: 100%">`
        }
    })
}
function shoppingItemMultiplier(e){
    const order = e.target.value;
    const price = e.target.previousElementSibling.textContent

    const newPrice = parseInt(order)*parseInt(price)
    e.target.previousElementSibling.textContent = newPrice.toString();
    e.target.placeholder = e.target.value;
    console.log(newPrice)

}
function availablePantryItems(){
    const items = document.getElementById('shelvesData')
    const count = document.getElementById('availableCount')
    const invcount = document.getElementById('quotationsCount')
    count.textContent = items.children.length.toString();
    invcount.textContent = mainAccount['quotations'].length.toString()
}
function displayAccDets(){
    if(clicked === false){
        const name = document.getElementById('nameEdit');
        const pass = document.getElementById('passEdit');
        const accDiv = document.getElementsByClassName('accountsDets')[0];
        const homepage = document.getElementById('mainInterface');
        homepage.style.opacity = '0.1';
        homepage.style.backgroundColor = 'grey';
        accModal.style.display = 'none';
        accDiv.style.display = 'flex';
        name.placeholder = mainAccount.username;
        pass.placeholder = mainAccount.password;
        clicked = true;
    }else{
        const name = document.getElementById('nameEdit');
        const pass = document.getElementById('passEdit');
        const accDiv = document.getElementsByClassName('accountsDets')[0];
        const homepage = document.getElementById('mainInterface');
        homepage.style.opacity = '1';
        homepage.style.backgroundColor = '#ffffff';
        name.style.display='none'
        clicked = false;
    }
}
function closeEditName(e){
    e.preventDefault()
    const name = document.getElementById('nameEdit');
    const pass = document.getElementById('passEdit');
    const cont = document.getElementById('accountsDets');
    const homepage = document.getElementById('mainInterface');
    userData[mainAccount.username].name =  name.value || name.placeholder;
    userData[mainAccount.username].password = pass.value || pass.placeholder;
    homepage.style.opacity = '1';
    homepage.style.backgroundColor = '#ffffff';
    cont.style.display='none'
    clicked = false;
    fetch(`http://localhost:3000/accounts/${userData.id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
});

}
function handleDelete(){
    const form = document.getElementById('ineventory')
    const itemName =document.getElementById('itemName').value || document.getElementById('itemName').placeholder
    const itemqty =document.getElementById('itemQuantity').value || document.getElementById('itemQuantity').placeholder
    const category =document.getElementById('setCategory').value
    const thresh =document.getElementById('threshCount').value || document.getElementById('threshCount').placeholder
    const addBtn = document.getElementById('addItemBtn');
    const input = document.getElementById('itemQuantity');
    const index = userData[mainAccount.username]["pantry_items"][`${category}`].findIndex(obj => itemName in obj)
    userData[mainAccount.username]["pantry_items"][`${category}`].splice(parseInt(index), 1)
    fetch(`http://localhost:3000/accounts/${2}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(()=>{
        form.reset();
        alertMessage(`${itemName} deleted succesfully!`);
    });
}
function displayDate(){
    const day = document.getElementById('dayDate');
    const dayDate = document.getElementById('date');
    const newDate = new Date(2023, 6, 6)
    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }
    const formatttedData = newDate.toLocaleDateString('en-US', options);
    const date = new Date();
    const dayNumber = date.getDay();
    const daysOfWeek=['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayName = daysOfWeek[dayNumber];
    day.textContent = dayName;
    dayDate.textContent = formatttedData;
}
displayDate();
function handleOrders(){
    const shoppingList = document.getElementById('shoppingList');
    userData[mainAccount.username]['quotations'] = [];
    const random = generateRandomString(6);
    fetch(`http://localhost:3000/accounts/${userData.id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
}).then(()=>{
    alertMessage(`order ${random} has been sent out`, 'green')
});
}
function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

