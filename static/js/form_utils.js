function clearFormById(form_id) {
    let form = document.getElementById(form_id);
    
    form.elements['username'].value = "";
    form.elements['email'].value = "";
    form.elements['address'].value = "";
    form.elements['country'].value = "";
    form.elements['zipCode'].value = "";
    form.elements['telephone'].value = "";
    form.elements['creditCard'].value = "";
    form.elements['cardType'].value = "";
}

function printFormById(form_id) {
    let form = document.getElementById(form_id);
    window.print();
}

document.addEventListener("DOMContentLoaded", () => {
    const closeButton = document.getElementById("msg-close");
    if (closeButton)
    {
      const myDiv = document.getElementById("msg-div");
      closeButton.addEventListener("click", () => {
        myDiv.style.display = "none";
      });

      const msg_category = document.getElementById("msg_category").innerText;
      if (msg_category === 'danger') myDiv.style.backgroundColor = "#dc3545";
      else if (msg_category === 'success') myDiv.style.backgroundColor = "#4bb543";

      const msg_text = document.getElementById("msg-text").innerText;
      
      if (msg_text.includes('Username: Only greek characters are allowed.'))
      {
        document.getElementById("username").style.border = "1px solid red";
      }

      if (msg_text.includes('Address: Only greek characters are allowed.'))
      {
        document.getElementById("address").style.border = "1px solid red";
      }

      if (msg_text.includes('Zip code: Only numbers with up to 5 digits are allowed.'))
      {
        document.getElementById("zipCode").style.border = "1px solid red";
      }

      if (msg_text.includes("30210xxxxxxx"))
      {
        document.getElementById("telephone").style.border = "1px solid red";
      }

      if (msg_text.includes("Credit Card: Only numbers with 16 digits are allowed."))
      {
        document.getElementById("creditCard").style.border = "1px solid red";
      }
    }
});
