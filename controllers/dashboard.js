async function getAllJobs() { 
    let data = { 
      "user_id":"1"
    }
    
    const response = await fetch('http://localhost:3000/get_all_requests', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    
    data = await response.json(); 
    data=data.data.bookings;
    console.log(data);
     
    document.getElementById('firstTab').innerHTML='';
    let dt='';
    dt += '<tr><th>Request</th>'
    dt += '<th>Time of Request</th>'
    dt += '<th>Time Elapsed</th>'
    dt += '<th>Request Status</th></tr>'
    
    hm={1:"Waiting", 2: "Pending", 3: "Completed"};
    for(let i=0;i<data.length;i++){
      let booking = "Request " +data[i].booking_id;
      dt += '<tr><td>'+booking+'</td>'
      dt += '<td>'+data[i].created_datetime+'</td>'
      dt += '<td>'+data[i].time_elapsed+'</td>'
      dt += '<td>'+hm[data[i].booking_status]+'</td></tr>'
    
    }
    document.getElementById("firstTab").innerHTML = dt; 
   
  } 
  getAllJobs();