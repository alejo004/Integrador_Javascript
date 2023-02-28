const productos = document.querySelector(".card-zapas__contenedor") // contenedor de las cards
const btnLoad = document.querySelector(".btn-load") // botón ver más debajo de productos
const marcas = document.querySelector(".marcas__container") // contenedor de las marcas
const marcasList = document.querySelectorAll(".marca") // botones para filtrar marcas
const barsBtn = document.querySelector(".menu-label") // toggle del menu
const barsMenu = document.querySelector(".navbar-list") // menu hamburguesa
const cartMenu = document.querySelector(".cart") // carrito
const overlay = document.querySelector(".overlay") // blur de fondo al abrir el carrito
const cartBtn = document.querySelector(".cart-label")
const productsCart = document.querySelector(".cart-container") //contenedor de productos del carrito
const total = document.querySelector(".total") //precio total en el carrito
const cartBubble = document.querySelector(".cart-bubble") // burbuja del carrito
const deleteBtn = document.querySelector(".btn-delete") //btn vaciar carrito
const buyBtn = document.querySelector(".btn-buy") // btn comprar
const trashBtn = document.querySelector(".trashBtn") // btn tachito de basura 
const successModal = document.querySelector(".add-modal") // mensaje user friendly
const packs = document.querySelector("#packs") // seccion packs
const verMasBtns = document.querySelector(".card-zapas__btn") // botones Ver Más
const firstBtn = document.querySelector(".firstBtn")
const secondBtn = document.querySelector(".secondBtn")
const thirdBtn = document.querySelector(".thirdBtn")
const firstImgContainer = document.querySelector(".firstImgContainer")
const secondImgContainer = document.querySelector(".secondImgContainer")
const thirdImgContainer = document.querySelector(".thirdImgContainer")

let cart = JSON.parse(localStorage.getItem("cart")) || []

const saveLocalStorage = (cartList) => {
	localStorage.setItem("cart", JSON.stringify(cartList))
}

const renderProduct = (product) => {
	const {id, nombre, precio, img} = product
	return `<div class="card-zapas">
                <div class="card-zapas__front">
                    <img class="card-zapas__img" src="${img}" alt="superstar">
                    <p class="card-zapas__p-envio">Envío gratis</p>
                </div>
                <div class="card-zapas__info">
                    <p class="card-zapas__p">${nombre}</p>
                    <span class="card-zapas__span">$${precio}</span>
                    <p class="card-zapas__p-cuotas">6 cuotas de $${precio}</p>
                </div>
                <button class="card-zapas__btn btn-add" 
                	data-id="${id}"
                	data-nombre="${nombre}"
                	data-precio="${precio}"
                	data-img="${img}">
                    <i class="fa-solid fa-cart-plus"></i>
                    Agregar al carrito
                </button>
            </div>`
}

 
const renderDividedProducts = (index = 0) => {
	productos.innerHTML += productsController.dividedProducts[index].map(renderProduct).join("")
}

const renderFilteredProducts = (marca) => {
	const productsList = productsData.filter((producto) => {
		return producto.marca === marca
	})
	productos.innerHTML = productsList.map(renderProduct).join("")
}

const renderProducts = (index = 0, marca = undefined) => {
	if(!marca) {
		renderDividedProducts(index)
		return
	}
	renderFilteredProducts(marca)
}
 
const changeShowMoreBtnState = (marca) => {
	if(!marca) {
		btnLoad.classList.remove("hidden")
		return
	}
	btnLoad.classList.add("hidden")
}

const changeBtnActiveState = (selectedMarca) => {
	const marcas = [...marcasList]
	marcas.forEach((marcaBtn) => {
		if(marcaBtn.dataset.marca !== selectedMarca) {
			marcaBtn.classList.remove("active")
			return
		}
		marcaBtn.classList.add("active")
	})
}

const changeFilterState = (e) => {
	const selectedMarca = e.target.dataset.marca
	changeShowMoreBtnState(selectedMarca)
	changeBtnActiveState(selectedMarca)
}

const applyFilter = (e) => {
	if(!e.target.classList.contains("marca")) {
		return
	} else { 
		changeFilterState(e)
	}
	if(!e.target.dataset.marca) {
		productos.innerHTML = ""
		renderProducts()
	} else {
		renderProducts(0, e.target.dataset.marca)
		productsController.nextProductsIndex = 1 
	}
}

const isLastIndexOf = () => {
	 return productsController.nextProductsIndex === productsController.productsLimit
}

const showMoreProducts = () => {
	renderProducts(productsController.nextProductsIndex)
	productsController.nextProductsIndex++
	if(isLastIndexOf()) {
		btnLoad.classList.add("hidden")
	}
}

const toggleCart = () => {
	cartMenu.classList.toggle("open-cart")
	if(barsMenu.classList.contains("open-menu")) {
		barsMenu.classList.remove("open-menu")
		return
	}
	overlay.classList.toggle("show-overlay")
}

const toggleMenu = () => {
  barsMenu.classList.toggle("open-menu")
  if(cartMenu.classList.contains("open-cart")) {
  	cartMenu.classList.remove("open-cart")
  	return
  }
	overlay.classList.toggle("show-overlay")

}

const closeOnOverlayClick = () => {
	barsMenu.classList.remove("open-menu")
	cartMenu.classList.remove("open-cart") 
	overlay.classList.remove("show-overlay")
}

const renderCartProduct = (cartProduct) => {
	const {id, nombre, precio, img, quantity} = cartProduct
	return `
				<div class="cart-item">
                        
                    <img src=${img} class="cart__img" alt="imagen producto">
                        
                    <div class="item-info">
                        <h3 class="item-title">${nombre}</h3>
                        <span class="item-price">$${precio}</span>
                    </div>

                    <div class="handler__container">
                        <div class="quantity-handler down" data-id=${id}>-</div>
                        <div class="item-quantity">${quantity}</div>
                        <div class="quantity-handler up" data-id=${id}>+</div>

                    </div>

                </div>`
}
 
const renderCart = () => {
	if (!cart.length) {
		productsCart.innerHTML = `<p class="empty-msg">No hay productos en el carrito</p>`
		return
	}
	productsCart.innerHTML = cart.map(renderCartProduct).join("")
}

const getCartTotal = () => {
	return cart.reduce( (acc, cur) => {
		return acc + Number(cur.precio) * cur.quantity
	}, 0)
}

const showTotal = () => {
	total.innerHTML = `$${getCartTotal().toFixed(2)}`
}

const renderCartBubble = () => {
	cartBubble.textContent = cart.reduce((acc, cur) => {
		return acc + cur.quantity 
	}, 0)
}

const disableBtn = (btn) => {
	if(!cart.length) {
		btn.classList.add("disabled")
	} else {
		btn.classList.remove("disabled")
	}
}

const checkCartState = () => {
	saveLocalStorage(cart)
	renderCart()
	showTotal()
	disableBtn(buyBtn)
	disableBtn(deleteBtn)
	renderCartBubble()
}

const addProduct = (e) => {
	if(!e.target.classList.contains("btn-add")) {
		return
	}
	const {id, nombre, precio, img} = e.target.dataset

	const product = createProductData(id, nombre, precio, img)

	if(isExistingCartProduct(product)) {
		addUnitToProduct(product)
		showSuccesModal("Se agregó una unidad al producto")
	} else {
		createCartProduct(product)
		showSuccesModal("El producto se ha agregado al carrito")
	}
	checkCartState()
}

const createProductData = (id, nombre, precio, img) => {
	return {id, nombre, precio, img}
} 
 
const isExistingCartProduct = (product) => {
	return cart.find((item) => item.id === product.id)
}

const addUnitToProduct = (product) => {
	cart = cart.map((cartProduct) => {
		return cartProduct.id === product.id ? {...cartProduct, quantity: cartProduct.quantity + 1 } : cartProduct
	})
}

const showSuccesModal = (msg) => {
	successModal.classList.add("active-modal")
	successModal.textContent = msg
	setTimeout(() => {
		successModal.classList.remove("active-modal")
	}, 2000 )
}
 
const createCartProduct = (product) => {
	cart = [ 
		...cart, 
		{
			...product,
			quantity: 1,
		},
	];
}

const handleMinusBtnEvent = (id) => {
	const existingCartProduct = cart.find((item) => item.id === id)

	if (existingCartProduct.quantity === 1) {
		if (window.confirm("Desea eliminar el producto del carrito")) {
			removeProductFromCart(existingCartProduct)
		}
		return
	}
	substractProductUnit(existingCartProduct)
}

const handlePlusBtnEvent = (id) => {
	const existingCartProduct = cart.find((item) => item.id === id)
	addUnitToProduct(existingCartProduct)
}

const removeProductFromCart = (existingProduct) => {
	cart = cart.filter((product) => product.id !== existingProduct.id)
	checkCartState()
}

const substractProductUnit = (existingProduct) => {
	cart = cart.map((product) => {
		return product.id === existingProduct.id 
		? {...product, quantity: Number(product.quantity) - 1} 
		: product
	})
}

const handleQuantity = (e) => {
	if(e.target.classList.contains("down")) {
		handleMinusBtnEvent(e.target.dataset.id)
	} else if (e.target.classList.contains("up")) {
		handlePlusBtnEvent(e.target.dataset.id)
	}
	checkCartState()
}

const resetCartItems = () => {
	cart = []
	checkCartState()
}

const completeCartAction = (confirmMsg, successMsg) => {
	if(!cart.length) return

	if(window.confirm(confirmMsg)) {
		resetCartItems()
		alert(successMsg)
	}
}

const completeBuy = () => completeCartAction("¿Desea completar su compra?", "Gracias por su compra")

const deleteCart = () => completeCartAction("¿Desea eliminar los productos del carrito?", "Productos eliminados")

const showMoreColabs = (e) => {
	if(!e.target.classList.contains("card-zapas__btn")) {
		return
	}
	if (e.target.dataset.name === "verMas__first") {
		firstImgContainer.classList.toggle("ContenedorVisible")
		
		if(firstImgContainer.classList.contains("ContenedorVisible")){
			firstBtn.innerHTML = 'Ver menos'
		} else {
			firstBtn.innerHTML = 'Ver más'
		}
		
	} else if (e.target.dataset.name === "verMas__second") {
		secondImgContainer.classList.toggle("ContenedorVisible")

		if(secondImgContainer.classList.contains('ContenedorVisible')) {
			secondBtn.innerHTML = "Ver menos"
		} else {
			secondBtn.innerHTML = "Ver más"
		}

	} else if(e.target.dataset.name === "verMas__third") {
		thirdImgContainer.classList.toggle("ContenedorVisible")
	}

	if(thirdImgContainer.classList.contains('ContenedorVisible')) {
			thirdBtn.innerHTML = "Ver menos"
		} else {
			thirdBtn.innerHTML = "Ver más"
		}
}

const init = () => {
	renderProducts()
	marcas.addEventListener("click", applyFilter)
	btnLoad.addEventListener("click", showMoreProducts)
	barsBtn.addEventListener("click", toggleMenu)
	cartBtn.addEventListener("click", toggleCart)
	overlay.addEventListener("click", closeOnOverlayClick)
	document.addEventListener("DOMContentLoaded", renderCart)
	document.addEventListener("DOMContentLoaded", showTotal)
	productos.addEventListener("click", addProduct)
	productsCart.addEventListener("click", handleQuantity)
	buyBtn.addEventListener("click", completeBuy)
	deleteBtn.addEventListener("click", deleteCart)
	packs.addEventListener("click", showMoreColabs)
	disableBtn(buyBtn)
	disableBtn(deleteBtn)
	document.addEventListener("DOMContentLoaded", renderCartBubble)
}

init()

