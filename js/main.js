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
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    if(form.className = 'LOGIN'){
        fetch('')
        .then(res => res.json())
        .then(data => {
            if(data.hasOwnProperty(username)){
                if(username === data.username && password === data.password){
                    return null;
                }
            }else{
                const msg = `Error: User ${username} not Found!`
                setTimeout(alertMessage(msg), 2000);
            }
        }).catch(err => alertMessage(`Error ${err}: ${err.message}`));
    } else if(form.className === 'SIGNUP') {
        const postData =  {
            
            username: username,
            password: password,
            pantry_items: []
        }
        fetch('',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'appliction/json'
            },
            body: JSON.stringify(postData)
        })
        .then()
    }
});
function alertMessage(message){
    const alertModal = document.getElementById('alertmsg');
    alertModal.textContent = message;
    alertModal.style.display = 'flex';
}