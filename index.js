var driver_id;
const params = new URLSearchParams(window.location.search)
if( params.get('id')){
driver_id = params.get('id')
}

console.log(driver_id,'adsadsad')

function openTabs(evt, request_status,type) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  if(type==1){
      if(driver_id<=5){
      getOpenTab1()
      }
  }
  else if(type==2){
    if(driver_id<=5){
      getOpenTab2()
    }
  }
  else if(type==3){
    if(driver_id<=5){
      getOpenTab3()
    }
  }
  document.getElementById(request_status).style.display = "block";
  evt.currentTarget.className += " active";
}



async function getOpenTab1() { 
  let data = {
    "driver_id": driver_id, 
    "user_id":"1",
    "status": "1"
  }
  
  const response = await fetch('http://localhost:3000/get_requests', {
    method: "POST",
    body: JSON.stringify(data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  
  data = await response.json(); 
  if (data.status==501){
    return
  }
  data=data.data.bookings;
  console.log(data);
   
  document.getElementById('firstTab').innerHTML='';
  let dt='';
  for(let i=0;i<data.length;i++){
    let booking = "Request " +data[i].booking_id;
    dt += '<tr><td>'+booking+'</td>'
    dt += '<td><button onclick= "selectBooking(this,'+data[i].booking_id+')">select</button></td></tr>'
  
  }
  document.getElementById("firstTab").innerHTML = dt; 
 
} 

async function getOpenTab3() { 
  let data = {
    "driver_id": driver_id, 
    "user_id":"1",
    "status" : 3
  }
  // url+"/get_completed_requests"
  const response = await fetch('http://localhost:3000/get_requests', {
    method: "POST",
    body: JSON.stringify(data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  
  data = await response.json(); 
  if (data.status==501){
    return
  }
  data=data.data.bookings;
  console.log(data);
   
  document.getElementById('thirdTab').innerHTML='';
  let dt='';
  for(let i=0;i<data.length;i++){
    let booking = "Request " +data[i].booking_id;
    dt += '<tr><td>'+booking+'</td></tr>'
  
  }
  document.getElementById("thirdTab").innerHTML = dt; 
 
} 
 
async function getOpenTab2() { 
  let data = {
    "driver_id": driver_id, 
    "user_id":"1",
    "status" : 2
  }
  
  const response = await fetch('http://localhost:3000/get_requests', {
    method: "POST",
    body: JSON.stringify(data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  
  data = await response.json(); 
  if (data.status==501){
    return
  }
  data=data.data.bookings;
  console.log(data);
   
  document.getElementById('secondTab').innerHTML='';
  let dt='';
  for(let i=0;i<data.length;i++){
    let booking = "Request " +data[i].booking_id;
    dt += '<tr><td>'+booking+'</td></tr>'
  
  }
  document.getElementById("secondTab").innerHTML = dt; 

} 
 
 

async function selectBooking(event,booking_id){
  let data = {
    "driver_id": driver_id, 
    "booking_id": booking_id,
    "user_id":"1"
  }

  const response = await fetch('http://localhost:3000/accept_booking', {
    method: "POST",
    body: JSON.stringify(data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  
  data = await response.json(); 
  if (data.status==501){
    alert(data.message);
  }
  
  if (data.status==200){
    var p=event.parentNode.parentNode;
    p.parentNode.removeChild(p);
  }

}

// async function getOpenTab3() { 
  
//   // Storing response 
//   const response = await fetch('https://reqres.in/api/users?page=1'); 
  
//   // Storing data in form of JSON 
//    data = await response.json(); 
//   show(data.data,'thirdTab'); 
// } 


// function show(data,id) { 
//   console.log(id,'asdsadas')
//   document.getElementById(id).innerHTML='';

//   let dt='';
//   for(let i=0;i<data.length;i++){
//     let booking = "Request " +data.booking_id;
//     <tr>
// // <td>Jill</td>
// // <td><button>select</button></td>
// // </tr>

//   }
//   let dt='';
//   for (let value of datas) { 
//               dt += '<tr><td>'+value.first_name+'</td>'
//               dt += '<td><button onclick= "clickJob('+JSON.stringify(value)+')">fsdfds</button></td></tr>'
//   } 
//   document.getElementById(id).innerHTML = dt; 
//   for (let value of datas) { 
//               dt += '<div class="col-lg-4 col-sm-6 col-md-3  card-new-section" style="width: 23rem;"><div class=" card cards-view">';
//               dt += '<div class="image-view"><img class="image" src="'+value.avatar+'"class="round-img" alt="Card image cap"></div>';
//               dt += '<div class="name-head">'+value.first_name+' '+value.last_name+'</div>';
//               dt += '</div></div>';
//   } 
//   document.getElementById(id).innerHTML = dt; 
// } 