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
}
