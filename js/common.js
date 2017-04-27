(function() {
    //Global Declaration
    var httpRequest,requestData;
    var categoryList = [];
    var categoryData = [];
    var start = 0;
    var end = 9;
    //HTTP Request Method
    function makeRequest(){
        var promiseObj = new Promise(function(resolve, reject){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", 'https://test-prod-api.herokuapp.com/products', true);
            xhr.send();
            xhr.onreadystatechange = function(){
              if (xhr.readyState === 4 ){
                 if (xhr.status === 200){
                    console.log("xhr done successfully");
                    var resp = xhr.responseText;
                    var respJson = JSON.parse(resp);
                    resolve(respJson);
                 } else {
                    reject(xhr.status);
                    console.log("xhr failed");
                 }
              } else {
                 console.log("xhr processing going on");
              }
           }
           console.log("request sent succesfully");
        });
        return promiseObj;
    }

    //Make HTTP Request
    makeRequest().then(function(data){
       processData(data)
    }).catch(function(err){
       console.log(err);
    });

    //Process Stuffs with data
    function processData(data){
        requestData = data;
        getCategory(requestData.products);
        renderView(data.products,start,end);
    }


    //Get Unique Category List
    function getCategory(array){
        var unique = {};
        for(var i in array ){
           if( typeof(unique[array[i].cat]) == "undefined"){
            categoryList.push(array[i].cat);
           }
           unique[array[i].cat] = 0;
        }

        var options = '<option value="all" />All Category</option>';
        for(var i = 0; i < categoryList.length; i++){
           options += '<option value="'+categoryList[i]+'" />'+categoryList[i]+'</option>';
        }
        document.getElementById('Category').innerHTML = options;
    }

    //Watch
    document.getElementById('ltoh').addEventListener('click', function () {
        applyFilter('lth');
    });
    document.getElementById('htol').addEventListener('click', function () {
        applyFilter('htl');
    });
    document.getElementById('hs').addEventListener('click', function () {
        applyFilter('hs');
    });
    document.getElementById('ls').addEventListener('click', function () {
        applyFilter('ls');
    });
    document.getElementById('Category').addEventListener('change', function () {
        applyCategory(this.value);
    });

    //Apply Category
    function applyCategory(name){
      categoryData = [];
      start = 0;
      end = 9;
      var products = requestData.products;
      if(name == "all"){
        renderView(products,start,end)
      }else{
        for (var i = 0; i < products.length ; i++) {
          if (products[i].cat === name) {
              categoryData.push(products[i]);
          }
        }
        renderView(categoryData,start,end)
      }

    }

    //Apply Filter
    function applyFilter(type){
        var products;
        start = 0;
        end = 9;
        if(categoryData.length == 0){
          products = requestData.products;
        }else{
          products = categoryData;
        }
        if(type == "lth"){
            var data = products.sort(function (a, b) {
                  return a.price - b.price;
            });
            renderView(data,start,end);
        }else if(type == "htl"){
            var data = products.sort(function (a, b) {
                  return b.price - a.price;
            });
            renderView(data,start,end);
        }else if(type == "hs"){
            var data = products.sort(function (a, b) {
                  return a.score - b.score;
            });
            renderView(data,start,end);
        }else if(type == "ls"){
            var data = products.sort(function (a, b) {
                  return b.score - a.score;
            });
            renderView(data,start,end);
        }
    }

    function renderView(data,start,end){
        var section = '';
        for( var i = start; i < end; i++){
            section += '<div class="col-4 product_holder"><div class="thumb"><img src="'+data[i].img+'" alt="'+data[i].name+'"/>',
            section += '<div class="title">'+data[i].name+' <span style="font-size:12px;color:#999">('+data[i].cat+')</span></div><div class="price">$ '+data[i].price+'</div></div></div>'
        }
        document.getElementById('products').innerHTML = section;
    }
    window.addEventListener("scroll", function (event) {
      var data ;
      if(categoryData.length == 0){
        data = requestData.products;
      }else{
        data = categoryData;
      }
      if (document.body.scrollHeight == document.body.scrollTop + window.innerHeight) {
          start = start+9
          end = end+9
          var section = '';
          for( var i = start; i < end; i++){
              section += '<div class="col-4 product_holder"><div class="thumb"><img src="'+data[i].img+'" alt="'+data[i].name+'"/>',
              section += '<div class="title">'+data[i].name+' <span style="font-size:12px;color:#999">('+data[i].cat+')</span></div><div class="price">$ '+data[i].price+'</div></div></div>'
          }
          document.getElementById('products').innerHTML += section;
      }
    });


})();
