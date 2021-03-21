const form = document.getElementById("customerForm");


  form.addEventListener( "submit", function ( event ) {
    

    event.preventDefault();
    new FormData(form);

  //
  } 
  );
  form.addEventListener('formdata', (e) => {
    console.log('formdata fired');
  
    // Get the form data from the event object
    let data = e.formData;
    
    console.log(data);
    for (var value of data.values()) {
      createRequest(value)
    }
  
  });  
async function createRequest(val) { 
    let data = {
      "customer_id": parseInt(val), 
      "user_id":1
    }
    
    const response = await fetch('http://localhost:3000/create_booking', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    
    data = await response.json(); 
    
   
  } 