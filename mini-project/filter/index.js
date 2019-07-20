
let data = {};
fetch('./db.json').then(function(response) {
    return response.json();
  }).then(function(myJson) {
    data = myJson;
  }, (err) => {
    console.log("err", err)
  });


  let size = document.getElementsByClassName("size");
  for (let i of size) {
    i.addEventListener("change", callback);
  }

  function callback(){
    let arr = []
    for (let i of size) {
      if (i.checked) {
        arr.push(i.value)
      }
    }
    sizeFilter(arr);
  }

  function sizeFilter(arr) {
    console.log(data);
    console.log(arr);
    let filterData = (data.persons).filter((d) => {
        for (let i of arr) {
          if (i == d.size) {
            return d;
          }
        }
    })

    console.log("filterData", filterData);
    let j = '';
    for (let i of filterData) {
      j += `<div style="display: flex"><lable>name:</lable>  <div>${i.name}</div> || <lable>size:</lable><div>${i.size}</div></div>`
    }

    document.getElementById("datalist").innerHTML = j

  }
