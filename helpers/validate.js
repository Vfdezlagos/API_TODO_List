import validator from "validator";

const validateEmptyAlphanum = (...text) => {

    for(let ele in text){
        if(validator.isEmpty(ele)){
            console.log('El campo esta vacio');
            return false;
        }

        if(!validator.isAlphanumeric(ele)){
            console.log('El campo no es alfanumerico');
            return false;
        }
    }

    return true;
}

const validarPass = (text) => {

    if(validator.isEmpty(text)){
        console.log('El campo esta vacio');
        return false;
    }

    return true;
}

const validarEmail = (text) => {

    if(validator.isEmpty(text)){
        console.log('El campo email esta vacio');
        return false;
    }

    if(!validator.isEmail(text)){
        console.log('El campo email no corresponde al formato de email');
        return false;
    }

    return true;
}

const validate = {
    User: (user) => {

        // validar username
        if(!validateEmptyAlphanum(user.username)) return false;

        // validar email
        if(!validarEmail(user.email)) return false;

        // validar password
        if(!validarPass(user.password)) return false;

        return true;
    },
    Task: (task) => {
        if(!task.title || !task.type) return false;

        if(validator.isEmpty(task.title) || validator.isEmpty(task.type)) return false;

        return true;
    }
}

export default validate;