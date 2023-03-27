const productSer = new productsServices();
function showTable(arrayData){
    var content = "";
    data.map(function(product,index){
        content += `
            <tr>
                <td></td>
                <td>${product.name}</td>
                <td>${product.price.toLocaleString()}</td>
                <td>${product.screen}</td>
                <td>${product.backCamera}</td>
                <td>${product.frontCamera}</td>
                <td>${product.img}</td>
                <td>${product.img}</td>
                <td>${product.desc}</td>
                <td>${product.type}</td>
                <td>
                    <button class="btn btn-danger">Edit</button>
                    <button class="btn btn-info">Delete</button>
                </td>
            
            </tr>
        `
    });
    document.querySelector('#tblSanPham').innerHTML = content;

}
//Hien thi danh sach 
function showProductsList(){
    var axiosResult = productSer.getProductsList();
    //resolve
    axiosResult.then(function(result){
        console.log(result.data);
        showTable(result.data)
    })
    //reject
    .catch(function(error){
        console.log(error);
    });
}
showProductsList();

//Lay danh sach thoi diem load web
