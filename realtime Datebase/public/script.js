

var firebaseConfig = {
  apiKey: "AIzaSyAv2BwIRgJzR5XqjEYRriqoCtzrFK1_P8c",
  authDomain: "realtimedatabasesumit.firebaseapp.com",
  databaseURL: "https://realtimedatabasesumit.firebaseio.com",
  storageBucket: "realtimedatabasesumit.appspot.com",
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const preObject = document.getElementById("object")
const ref = firebase.database().ref();

ref.on('value', snap =>  parse(snap.val()))
let length = 0;

function parse(data) {
  length = data.length;
  let table = `<table class="table"><tr><th>City</th><th>Name</th><th>Age</th></tr>`;
  console.log(data)
  let index = 0;
   for (let i of data) {
      if(!i || !i.City || !i.Name || !i.Age) continue;
       data = data.filter(function (el) {
          return el != null;
        });

     table += `<tr><td>${i.City}</td><td>${i.Name}</td><td>${i.Age}</td></tr>`;
    ++index;
   }

   table += `</table>`;
   preObject.innerHTML = table;
}

function addData() {

     console.log("length", length)
    let city, name, age;
    city = document.getElementById("city").value;
    name = document.getElementById("name").value;

    age = document.getElementById("age").value;

    ref.child(length).set({
      "City": city,
      "Name": name,
      "Age": age
    })

}

// function deleteItem(item) {
//   console.log("item", item, ref.child(item));
//   firebase.database().ref().child(item).remove() ;
// }
