function productsServices() {
  //DS product
  this.getProductsList = function () {
    //pending
    //return - tra ket qua len main
    return axios({
      method: "get",
      url: "https://640d37241a18a5db8372cf66.mockapi.io/api/v1/PhoneJS"
    })
    
  }
  //addProduct
  this.addProductSer = function (products) {
    return axios({
      method: 'post',
      url: "https://640d37241a18a5db8372cf66.mockapi.io/api/v1/PhoneJS" ,
      data: products
  })
}
  //DeleteProduct
  this.deleteProductSer = function (id) {
    return axios({
      method: 'delete',
      url: `https://640d37241a18a5db8372cf66.mockapi.io/api/v1/PhoneJS/${id}`,
  })
}
  //GET
this.getProductItem = function (id) {
  return axios({
    method: 'get',
    url: `https://640d37241a18a5db8372cf66.mockapi.io/api/v1/PhoneJS/${id}`,
  })
}
 //PUT
 this.updateProductSer = function (productUpdate,id) {
  return axios({
    method: 'put',
    url: `https://640d37241a18a5db8372cf66.mockapi.io/api/v1/PhoneJS/${id}`,
    data: productUpdate
  })
}
}
