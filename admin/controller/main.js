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
