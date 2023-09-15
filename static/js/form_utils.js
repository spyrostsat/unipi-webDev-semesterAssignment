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
