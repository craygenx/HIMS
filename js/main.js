const form = document.getElementById('accountForm');

document.addEventListener('DOMContentLoaded', ()=>{});
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
                    alertMessage(`Hello ${username}, logIn succeful!`, 'green');
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
        .then(() => alertMessage(`user ${username} added succesfully!`, 'green'))
        .catch(err => alertMessage(`Error ${err}: ${err.message}`, 'red'));
    }
});
function alertMessage(message, color){
    const alertModal = document.getElementById('alertmsg');
    alertModal.textContent = message;
    alertModal.style.display = 'flex';
    alertModal.style.backgroundColor = color;
    setTimeout(()=>{
        alertModal.style.display = 'none';
    }, 3000)
}