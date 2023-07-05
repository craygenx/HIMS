
const form = document.getElementById('accountForm');
const inventoryForm = document.getElementById('ineventory');
let userData;
let mainAccount;

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
                    addShelfItem();
                    loadAccountData(account, username);
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
                pantry_items : []
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

    const selectedValue = category.value;
    console.log(imageUrl)
    const data = {
        [itemName]:{
            "imageUrl": imageUrl,
            "itemName": itemName,
            "itemQuantity": itemQuantity,
            "itemThreshold": itemThreshold
            }
    }
    handleAddItem(data, mainAccount.username, selectedValue)

})
function openInventoryBoard() {
    const inventoryBoard = document.getElementById('inventoryBoard');
    const homepage = document.getElementById('homepage');
    inventoryBoard.style.display = 'flex';
    homepage.style.opacity = '1';
    homepage.style.backgroundColor = '#ffffff';
}
function handleAddItem(data, username, category){
    userData[username]["pantry_items"][category].push(data);
    fetch(`http://localhost:3000/accounts/${2}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
}
function closeInventory(){
    const inventoryBoard = document.getElementById('inventoryBoard');
    inventoryBoard.style.display = 'none';
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
    const percentage = Math.floor(parseInt(itemQuantity)*0.9);
    itemThreshold.placeholder = percentage;
}
function unWrap(data){
    data.forEach(item => {
        let key = Object.keys(item)[0];
        let { imageUrl, itemName, itemQuantity, itemThreshold } = item[key];
        const shelfItemCont = document.createElement('div');
        const shelvesData = document.getElementById('shelvesData');
        shelfItemCont.className = 'shelfItemCont';
        shelfItemCont.innerHTML = `
            <div class="imageShelfItem">
                <img src=${imageUrl} alt="">
            </div>
            <div class="shelfItemDetails">
                <div class="nameQty">
                    <div>${itemName}</div>
                    <div style="font-style: italic;">${itemQuantity} items</div>
                </div>
                <div class="circCont" style="background-color: beige;">${itemThreshold}</div>
            </div>
        `;
        shelvesData.appendChild(shelfItemCont);
    });
}
function addShelfItem(){
    const cereals = mainAccount['pantry_items']['cereals'];
    const groceries = mainAccount['pantry_items']['grocery'];
    const spices = mainAccount['pantry_items']['spices'];
    const drinks = mainAccount['pantry_items']['drinks'];
    unWrap(cereals);
    unWrap(groceries);
    unWrap(spices);
    unWrap(drinks);
}