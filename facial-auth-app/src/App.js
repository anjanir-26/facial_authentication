
import './App.css';
import { useState } from 'react';
const uuid = require('uuid');
function App() {
  const [image,setImage] = useState('');
  const [uploadResultMessage,setUploadResultMessage] = useState('Please upload an image to authenticate')
  const [visitorName, setVisitorName] = useState('placeholder.jpg')
  const [isAuth, setAuth] = useState(false);
  function sendImage(e){
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid.v4();
    fetch (`https://ps4ykf95v7.execute-api.us-east-1.amazonaws.com/auth/facial-auth-visitor/${visitorImageName}.jpg`, {
      method : 'PUT',
      headers: {
      'Content-Type' : 'image/jpg'

      },
      body : image
      
      }).then(async ()=> {
        const response = await authenticate(visitorImageName);
        if(response.Message === 'Success'){
          setAuth(true);
          setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}. Welcome to work . Hope you have a great day`)
        }
        else{
          setAuth(false);
          setUploadResultMessage(`Authentication failed this person is not an employee`)
        }
      }).catch(error =>{
        setAuth(false);
        setUploadResultMessage(`There's error during authentication process. Please try again`)
        console.error(error);
      })
  }

  async function authenticate(visitorImageName){
    const requestUrl = 'https://ps4ykf95v7.execute-api.us-east-1.amazonaws.com/auth/employee?'+new URLSearchParams({
    objectKey : `${visitorImageName}.jpg`
    });
    return await fetch(requestUrl,{
    method : 'GET',
    headers : {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    }

    }).then(response  => response.json()).then((data)=>{
      return data;
    }).catch(error => console.error(error));
  }
  return (
    <div className="App">
    <h2>Facial Authentication App</h2>
    <form onSubmit = {sendImage}>
      <input type = 'file' name = 'image' onChange={e=> setImage(e.target.files[0])}/>
      <button type = 'submit' >Authenticate</button>

    </form>
    <div className= {isAuth ? 'Success' : 'failure'}>{uploadResultMessage}</div>
    <img src= {require(`./visitors/${visitorName}`)} alt = "visitor" height = {250} width = {250}/>

    </div>
  );
}

export default App;
