const form = document.querySelector(".form")
const emailInput = document.querySelector("#email")
const passInput = document.querySelector("#pass")


const checkMail = () => {
	let valid = false 

	const emailValue = emailInput.value.trim()

	if(isEmpty(emailValue)) {
		showError(emailInput, "El mail no es valido")
	} else if(!isEmailValid(emailValue)) {
		showError(emailInput, "El email no es valido")
	} else {
		showSuccess(emailInput)
		valid = true
	}
	return valid
}

const checkPassword = () => {
	let valid = false

	const password = passInput.value.trim()

	if(isEmpty(password)){
		showError(passInput, "La contraseña es obligatoria")
	} else if(!isPassSecure(password)) {
		showError(passInput, "La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un simbolo")
	} else {
		showSuccess(passInput)
		valid = true
	}
	return valid
}

const isEmailValid = (email) => {
	const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
	return re.test(email) 
}

const isEmpty = (value) => value === ""

const showError = (input, msg) => {
	const formField = input.parentElement

	const error = formField.querySelector("small")
	error.textContent = msg
}

const showSuccess = (input) => {
	const formField = input.parentElement

	const error = formField.querySelector("small")
	error.textContent = ""
}

const isPassSecure = (pass) => {
	const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/
	return re.test(pass)
}

const redirectPage = () => {
	const isFormValid = checkMail() && checkPassword()

	if(isFormValid) {
		location.href = "../index.html"
	}
}

form.addEventListener("submit", (e) => {
	e.preventDefault()
	checkMail()
	checkPassword()
	redirectPage()
})