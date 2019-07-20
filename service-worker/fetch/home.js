var d = 100
document.getElementsByTagName("div")[0].innerHTML = `
<div>${100}</div>
 <h3>${new Date()}</h3>
`;

const ul = document.getElementById('authors'); // Get the list where we will place our authors
const url = 'https://randomuser.me/api/?results=10'; // Get 10 random users

fetch(url)
  .then((resp) => resp.json()) // Transform the data into json
  .then(function(data) {
    func(data);
    });

    function func(data) {
        let total = ''
        for ( i of data.results) {
          // console.log(i.email)
           total += "<p>" + i.email + "</p>";
        }
        document.getElementById('dataId').innerHTML = total;
    }