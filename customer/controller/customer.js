const productSER = new productsServices();

function showProductsListData() {
    var axiosResult = productSER.getProductsList();
    //resolve
    axiosResult.then(function (result) {
        renderCategory(result.data)
        renderListPhone(result.data)
    })
        //reject
        .catch(function (error) {
            console.log(error);
        });
}
//Lay danh sach thoi diem load web
showProductsListData();

// -----------------------PRODUCT LANDING PAGE AND CART-------------------

const Cart = [];

// Lấy ra danh mục sản phẩm
const getCategories = (products) => {
    const categories = {};

    for (let item of products) {
        
        categories[item.type] = true;
    }

    const rs = Object.keys(categories) 

    return ['All', ...rs]; 

}

let category = 'all';

// set danh mục sản phẩm
const setCategory = (type, products) => {
    category = type;

    renderListPhone(products);
};

// Lấy ra id select
const domCategory = document.getElementById('selectType');

// Hiển thị giao diện danh mục sản phẩm
const renderCategory = (products) => {
    domCategory.addEventListener('change', (e) => {
        setCategory(e.target.value, products);
    })
}

const getListPhoneByCategory = (products, typeCategory) => {
    const newProducts = products.filter((item) => {
        if (typeCategory === 'all') return true;

        return item.type == typeCategory;
    })

    return newProducts;
};


// Hiển thị sản phẩm
const renderListPhone = (products) => {

    const listPhoneCategory = getListPhoneByCategory(products, category);

    const html = listPhoneCategory.map((item) => {
        const {screen, desc, img, type, name, price} = item;

        return `
            <div class="card py-4 col-4 mb-4">
                <div class="card-overlay pl-4">
                <h1 class="animate__animated animate__fadeInDown">More info:</h1>
                <p class="animate__animated animate__fadeInDown">Screen: ${screen}</p>
                <p class="animate__animated animate__fadeInDown">Description: ${desc}</p>
                <button id="CartBtn" class="btn btn--add animate__animated animate__fadeInUp">Add to Cart</button>
                </div>
                <img style="width:100px" src="${img}" id="card-img" class="card-img-top" alt="...">
                <div class="card-body p-2">
                    <span class="card-type">${type}</span>
                    <h5 id="card-name" class="card-name my-2">${name}</h5>
                    <ul class="d-flex mb-3">
                        <li class="mr-1" style="color: rgb(216, 216, 11)"><i class="fa-solid fa-star"></i></li>
                        <li class="mr-1" style="color: rgb(216, 216, 11)"><i class="fa-solid fa-star"></i></li>
                        <li class="mr-1" style="color: rgb(216, 216, 11)"><i class="fa-solid fa-star"></i></li>
                        <li class="mr-1" style="color: rgb(216, 216, 11)"><i class="fa-solid fa-star"></i></li>
                        <li class="mr-1" style="color: rgb(183, 179, 179)"><i class="fa-solid fa-star"></i></li>
                    </ul>
                    <div class="card-bottom d-flex justify-content-between">
                        <span id="card-price" class="card-price">${price.toLocaleString()}</span>
                        <span>In Stock</span>
                    </div>
                </div>
            </div>
        `
    }).join('');

    document.querySelector('#boxProducts').innerHTML = html;



    // ---------- Cart -------------
    
    // Lấy ra thằng cha card item
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    // Hiển thị số lượng sản phẩm
    function renderQuantity(itemInCart) {
        let flag = false;

            Cart.forEach((item) => {
                if (item.name === itemInCart.name) {
                    item.quantity += 1;
                    flag = true;
                    return false;
                }
            })

            if (!flag) {
                Cart.push(itemInCart);
                increaseNumber();
            }
    }

    // Tăng quantity khi click button
    function increaseNumber() {
        let cartQuantity = document.getElementById('cart_quantity').value;
        cartQuantity = isNaN(cartQuantity) ? 0 : cartQuantity;
        cartQuantity++;
        document.getElementById('cart_quantity').value = cartQuantity;
    }

    // Tổng tiền cart
    function cartTotal() {
        const cartItem = document.querySelectorAll("#tBodyCart tr");

        for (var i = 0; i<cartItem.length;i++) {
            let prodQuantity = cartItem[i].querySelector('#quantityCart').value;
            let prodPrice = cartItem[i].querySelector('#priceCart').innerHTML;
            let cartResult = cartItem[i].querySelector('#totalCart');
            cartResult = prodQuantity * prodPrice;
        }
    }
    
    const btnCart = document.querySelectorAll('#CartBtn');

    // Lặp qua từng nút và bắt sự kiện để render
    btnCart.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const btnItem = e.target;
            const item = getParent(btnItem, '.card');
            const name = item.querySelector("#card-name").innerText;
            const price = item.querySelector("#card-price").innerText;
            const img = item.querySelector("#card-img").src;

            const itemInCart = new cartItem(name, price, img);
            itemInCart.calc();

            renderQuantity(itemInCart)

            renderCart(Cart);

            setLocalStorage(Cart);

            cartTotal()

        })
        return Cart;
    })
}


// ----------------------------- Cart ---------------------------------

// Create class
class cartItem {
    constructor(name, price, img) {
        this.name = name;
        this.price = price;
        this.img = img;
        this.quantity = 1;
        this.total = 0;

        // Method
        this.calc = function() {
            this.total = this.price * this.quantity;
        }
    }
}

// render cart
const renderCart = (arrayCart) => {
    var content = '';
    arrayCart.map((item) => {
        const {name, price, img, quantity, total} = item;

        // Empty cart
        emptyCart2(name);

        var trELE = `
        <tr>
            <td></td>
            <td>${name}</td>
            <td id="priceCart">${price}</td>
            <td><img src="${img}"></img></td>
            <td><input style="width:40px" type="number" name="" id="quantityCart" value="${quantity}"></td>
            <td id="totalCart">${total}</td>
            <td class="d-flex">
                <button onclick="resetProduct('${name}')" class="btn--modal btn-primary"><i class="fa-solid fa-xmark"></i></button>
                <button onclick="" class="btn--modal btn-success"><i class="fa-solid fa-eye"></i></button>
            </td>
        </tr>
        `
        content += trELE;
    })
    document.getElementById('tBodyCart').innerHTML = content;
}

// Set localstorage
function setLocalStorage(mang) {
    localStorage.setItem("DSSP", JSON.stringify(mang));
}

// Find index SP
const findIndexSP = function(name) {
    var indexFind = -1;

    indexFind = Cart.findIndex(function(item) {
        return item.name == name;
    });

    return indexFind;
}

// Delete SP in cart
const deleteProducts = function(name) {
    var index = findIndexSP(name);
    if (index != -1) {
        Cart.splice(index, 1);
    }
}

// Reset Product and render
function resetProduct(name) {
    deleteProducts(name);
    setLocalStorage(Cart)
    renderCart(Cart);
}

// Button empty
function emptyCart2(name) {
    document.getElementById('btn-empty').addEventListener('click', () => {
        resetProduct(name);
    })
}

function emptyCart() {
    document.getElementById('tBodyCart').innerHTML = '';
}

// Button Pay
document.getElementById('btn-pay').addEventListener('click', () => {
    emptyCart()
})






