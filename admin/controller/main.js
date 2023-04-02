//-------------------- PRODUCT MANAGEMENT--------------
const productSer = new productsServices();
const validation = new Validation();
//Hien thi bang 
function showTable(arrayData) {
    var content = "";
    arrayData.map(function (product, index) {
        content += `
            <tr>
                <td></td>
                <td>${product.name}</td>
                <td>${product.price.toLocaleString()}</td>
                <td>${product.screen}</td>
                <td>${product.backCamera}</td>
                <td>${product.frontCamera}</td>
                <td><img style="width: 100px" src="${product.img}" alt=""></td>
                <td>${product.desc}</td>
                <td>${product.type}</td>
                <td>
                    <button data-toggle="modal" data-target="#myModal" onclick="showProductDetail('${product.id}')" class="btn btn-danger">Edit</button>
                    <button onclick="deleteProduct('${product.id}')" class="btn btn-info">Delete</button>
                </td>
            </tr>
        `
    });
    document.querySelector('#tblDanhSachSP').innerHTML = content;

}
//Hien thi danh sach 
function showProductsList() {
    var axiosResult = productSer.getProductsList();
    //resolve
    axiosResult.then(function (result) {
        console.log(result.data);
        showTable(result.data)
    })
        //reject
        .catch(function (error) {
            console.log(error);
        });
}
//Lay danh sach thoi diem load web
showProductsList();

function Validation() {

    this.checkEmpty = function(valueInput, spanID, message) {
        if (valueInput === '' || valueInput === '0') {
            document.getElementById(spanID).display = "block";
            document.getElementById(spanID).innerHTML = message;
            return false;
        }
        document.getElementById(spanID).display = "none";
        document.getElementById(spanID).innerHTML = '';
        return true;
    }

    this.checkSame = function(valueInput, spanID, message, pattern) {

        if (valueInput.match(pattern)) {
            document.getElementById(spanID).display = "none";
            document.getElementById(spanID).innerHTML = '';
            return true;
        } else {
            document.getElementById(spanID).display = "block";
            document.getElementById(spanID).innerHTML = message;
            return false;
        }
    }
}

function addProduct() {
    // get data
    var name = document.querySelector("#name").value;
    var price = document.querySelector("#price").value;
    var screen = document.querySelector("#screen").value;
    var backCamera = document.querySelector("#backCamera").value;
    var frontCamera = document.querySelector("#frontCamera").value;
    var img = document.querySelector("#img").value;
    var desc = document.querySelector("#desc").value;
    var type = document.querySelector("#type").value;

    var isValid = true;

    isValid &= validation.checkEmpty(name, 'name1', 'Vui lòng nhập tên sản phẩm') && validation.checkSame(name, 'name1', 'Tên sản phẩm chưa đúng định dạng', /^[A-Z a-z]+$/);
    isValid &= validation.checkEmpty(price, 'price1', 'Vui lòng nhập giá tiền') && validation.checkSame(price, 'price1', 'Giá tiền phải là một số', /^[0-9]+$/)
    isValid &= validation.checkEmpty(screen, 'screen1', 'Vui lòng nhập kích thước màn hình');
    isValid &= validation.checkEmpty(backCamera, 'backCamera1', 'Vui lòng nhập độ phân giải camera sau');
    isValid &= validation.checkEmpty(frontCamera, 'frontCamera1', 'Vui lòng nhập độ phân giải camera sau');
    isValid &= validation.checkEmpty(img, 'img1', 'Vui lòng nhập đường dẫn hình ảnh sản phẩm');
    isValid &= validation.checkEmpty(desc, 'desc1', 'Vui lòng nhập mô tả sản phẩm');

    if (isValid) {
        //create object
        var products = new Product(name, price, screen, backCamera, frontCamera, img, desc, type)
        console.log(products);
        //truyen xuong BE
        productSer.addProductSer(products)
            .then(function (result) {
                console.log(result);
                showProductsList();
                alert("Add product successful");
                document.querySelector("#myModal .close").click();
            })
            .catch(function (error) {
                console.log(error)
            })
        //hien thi danh sach san pham
    }

}

document.querySelector("#addProduct").onclick = function () {
    //add button for form
    document.querySelector("#myModal .modal-footer").innerHTML = `
        <button class="btn btn-success" onclick="addProduct()">Add</button>
    `
    document.querySelector("#formProduct").reset();
}

function deleteProduct(id) {
    console.log(id);
    productSer.deleteProductSer(id)
        .then(function (result) {
            console.log(result);
            showProductsList();
        })
        .catch(function (error) {
            console.log(error);
        })
}
//GET DATA
function showProductDetail(id) {
    console.log(id);
    productSer.getProductItem(id)
        .then(function (result) {
            console.log(result.data);
            document.querySelector("#name").value = result.data.name;
            document.querySelector("#price").value = result.data.price;
            document.querySelector("#screen").value = result.data.screen;
            document.querySelector("#backCamera").value = result.data.backCamera;
            document.querySelector("#frontCamera").value = result.data.frontCamera;
            document.querySelector("#img").value = result.data.img;
            document.querySelector("#desc").value = result.data.desc;
            document.querySelector("#type").value = result.data.type;
             //add button update product
             document.querySelector("#myModal .modal-footer").innerHTML = `
             <button class="btn btn-success" onclick="updateProduct('${result.data.id}')">Update Product</button>
            `
        })
        .catch(function (error) {
            console(error);
        })
}
//PUT DATA
function updateProduct(id){
    console.log(id);
    //Lay du lieu tu form
    var name = document.querySelector("#name").value;
    var price = document.querySelector("#price").value;
    var screen = document.querySelector("#screen").value;
    var backCamera = document.querySelector("#backCamera").value;
    var frontCamera = document.querySelector("#frontCamera").value;
    var img = document.querySelector("#img").value;
    var desc = document.querySelector("#desc").value;
    var type = document.querySelector("#type").value;
    //Create object 
    var productUpdate = new Product(name, price, screen, backCamera, frontCamera, img, desc, type)
    console.log(productUpdate);
    //Tuong tac voi BE
    productSer.updateProductSer(productUpdate,id)
    .then(function(result){
        console.log(result.data);
        showProductsList();
        alert("Update successful");
        document.querySelector("#myModal .close").click();
    })
    .catch(function(error){
        console.log(error);
    })
}

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

// Reset Product and render
function resetProduct(name) {
    deleteProducts(name);
    setLocalStorage(Cart)
    renderCart(Cart);
}

// Find index SP
const findIndexSP = function(name) {
    var indexFind = -1;

    indexFind = Cart.findIndex(function(item) {
        return item.name == name;
    });

    return indexFind;
}

// Button Pay
document.getElementById('btn-pay').addEventListener('click', () => {
    emptyCart()
})

// Button empty
function emptyCart2(name) {
    document.getElementById('btn-empty').addEventListener('click', () => {
        resetProduct(name);
    })
}

// Button empty
function emptyCart() {
    document.getElementById('tBodyCart').innerHTML = '';
}

// Delete SP in cart
const deleteProducts = function(name) {
    var index = findIndexSP(name);
    if (index != -1) {
        Cart.splice(index, 1);
    }
}