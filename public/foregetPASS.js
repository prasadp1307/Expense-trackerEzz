async function forgotpassword(e) {
    try{
        e.preventDefault();
        const userDetails = {
            email: event.target.email.value
        }

        console.log('userDetails',userDetails)

        const response = await axios.post('http://localhost:4000/password/forgotpassword',userDetails)
        if(response.status === 202){
            alert('Password Reset link sent successfully!');
            window.location.href = '../login.html';
        } else {
            throw new Error('Something went wrong!!!')
        }
    }catch(err){
        if(err.response==undefined){
        document.body.innerHTML=`<div class="error_box-container"><div class="error_box">${err}</div></div>`+ document.body.innerHTML;
        }else{
        
        document.body.innerHTML=`<div class="error_box-container"><div class="error_box">${err.response.data.message}</div></div>`+ document.body.innerHTML;
        }
        const errbox= document.getElementsByClassName('error_box');
        for(let i=0;i<errbox.length;i++){
        setTimeout(()=>{
            errbox[i].style.display ='none';},3000);
        }
    }
}