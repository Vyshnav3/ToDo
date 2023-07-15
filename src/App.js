
import './App.css';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import contractData from'./contractData.json'
function App() {
const [address,setAddress]= useState('')
const [taskName,setTaskName]=useState('')
const [priority,setPriority]=useState('0')
const [array,setArray]=useState('')
const [showTasks, setShowTasks] = useState(true);

useEffect(()=>{
  const storedAddress= localStorage.getItem('connectedAddress')
  if(storedAddress){
    setAddress(storedAddress)
  }
},[])
useEffect(() => {
  const handleAccountsChanged = (newAccounts) => {
    setAddress(newAccounts[0]);
    localStorage.setItem('connectedAddress', newAccounts[0]);
  };

  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  }

  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  };
}, []);
  const connect = async()=>{
    try{
    if(window.ethereum){
   
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const connectedAddress = accounts[0];
      setAddress(connectedAddress);
      localStorage.setItem('connectedAddress', connectedAddress);
      } else {
        console.log('MetaMask not found. Please install MetaMask.');
        alert('PLEASE INSTAL METAMASK')
      }
    } catch (error) {
      console.log('Error connecting to MetaMask:', error.message);
    }
  };
       const add = async(e)=>{
        e.preventDefault();
  try{

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner();
  let contract = new ethers.Contract(contractData.address, contractData.abi, signer)
  

  let transaction= await contract.addtask(taskName,priority)
  setTaskName('');
  setPriority('0')
  

  console.log("hi")}
  catch(e){
    console.log(e.message)
  }
 }


 

 const toggleTasks = () => {
  setShowTasks((prevShowTasks) => !prevShowTasks);
};

useEffect(() => {
  fetchData();
}, [][showTasks]);

const fetchData = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const connectedAddress = await signer.getAddress();
    let contract = new ethers.Contract(contractData.address, contractData.abi, signer);

    let transaction = await contract.getalltasks();

    const updatedTransactions = transaction.map((tx) => {
      const timestamp = tx.timestamp.toString();
      const date = new Date(timestamp * 1000);
      const formattedDate = date.toLocaleDateString("en-US");
      const formattedTime = date.toLocaleTimeString("en-US");
      return { ...tx, timestamp: formattedDate, time: formattedTime };
    });

    if (showTasks) {
      setArray(updatedTransactions);
    } else {
      const filteredTasks = updatedTransactions.filter((task) => !task.done);
      setArray(filteredTasks);
    }
  } catch (e) {
    console.log(e.message);
  }
};


const deleteTask = async(index)=>{
  try {
    const provider= new ethers.providers.Web3Provider(window.ethereum)
    const signer= provider.getSigner()
    let contract=new ethers.Contract(contractData.address,contractData.abi,signer)
    await contract.deletetask(index)
    
  } catch (error) {
    console.log(error)
    
  }

}

const editTask=async(index)=>{
  try {
    const provider=new ethers.providers.Web3Provider(window.ethereum)
    const signer=provider.getSigner()
    let contract=new ethers.Contract(contractData.address,contractData.abi,signer)
    let updateTask = prompt("Update Task", "");
    


    let transaction=await contract.updatetask(index,updateTask)
    console.log(transaction)
  } catch (error) {
    
  }
}

const markTaskAsDone = async (index) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractData.address, contractData.abi, signer);
    await contract.done(index);
  } catch (error) {
    console.log(error);
  }
};


  return (
    <div>
    
   <div className='container'>   
    <button className='connectmeta' onClick={connect}> {address ? address : 'Connect MetaMask'}</button>
    </div>
    <h1 className='title'>TO DO...</h1>
    <form className='form'>
 
    <label>Task Name:</label>
   
    <input value={taskName} onChange={e=>setTaskName(e.target.value)}/>
 
  <br />
 
    <label>Priority:</label>
  
    <select value={priority} onChange={e=> setPriority(e.target.value)}>
      <option value='0'>Low</option>
      <option value='1'>Medium</option>
      <option value='2'>High</option>
    </select>
    <br  />
    <button onClick={add}>Add Task</button>
</form>
<div className='showtasks'>
  <h1>All Tasks</h1>
  <div className='toggle-button'>
      {showTasks ? (
        <button onClick={toggleTasks}>Hide Tasks done</button>
      ) : (
        <button onClick={toggleTasks}>Show Tasks done</button>
      )}

    </div>
<div className='table'>
  <table>
    <thead>
      <tr>
    <th>Time</th>
    <th>Task</th>
    <th>Priority</th>
    <th>Done</th>
    </tr>
    </thead>
    <tbody>
     
        {array && array.map((item,index)=>(
          <tr key={index}>
            <td>{item.timestamp}  {item.time}</td>
            <td className='task-name' style={{textDecoration:item.done && 'line-through' }}>{item.taskname}
          </td>
         
          
          
          <td>{item.priority ===0 &&(<span style={{color: 'yellow'}}>Low</span>)}
          {item.priority ===1 &&(<span style={{color:'green'}}>Medium</span>)}
          {item.priority ===2 &&(<span style={{color:'red'}}>High</span>)}</td>
          <td>
          <input
            type='checkbox'
            checked={item.done}
            onChange={() => markTaskAsDone(index)}
          />
        </td>
          <td>{!item.done &&(
            <>
          <button style={{ marginRight: '10px' } }  onClick={()=>editTask(index)}>Edit</button>
          </>)}
          <button onClick={()=>deleteTask(index)}>Delete</button>
          
          
          </td>
          </tr>
          
        ))}
       
    </tbody>
  </table>
</div>
</div>
   </div>
   
  );
}

export default App;
