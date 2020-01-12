export validateForm = function(e) {
    //TODO: make this more dynamic
    let form = e.target.form;

    for (let el of form) {
        if (el.willValidate && ! el.checkValidity()) {
            el.classList.add('invalid');
        };
    }
    form.reportValidity()
}
    
