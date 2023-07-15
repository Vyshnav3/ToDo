// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract todo{

    enum Priority {low,mediuum,high}
    struct Tasks{
        string taskname;
        bool done; 
        uint timestamp;
        Priority priority;
    }
    mapping (address=> Tasks[]) private alltasks;


    function addtask(string memory _taskname, Priority _priority) public{
        alltasks[msg.sender].push(Tasks({taskname:_taskname, done:false,timestamp:block.timestamp,priority:_priority}));
    }
  
    function updatetask(uint _index, string memory _taskname) public{
        require (_index<alltasks[msg.sender].length,"Invalid Index");       
        alltasks[msg.sender][_index].taskname = _taskname;
        }

        function updatepriority(uint _index, Priority _priority) public{
        require (_index<alltasks[msg.sender].length,"Invalid Index");
        
        alltasks[msg.sender][_index].priority = _priority;
        }

    function done(uint _index) public{
        require (_index<alltasks[msg.sender].length,"Invalid Index");
        require(alltasks[msg.sender][_index].done==false,"You already finished");
        alltasks[msg.sender][_index].done=true;
    }

    function getalltasks() public view returns(Tasks[] memory)
    {
        return alltasks[msg.sender];
    }

    function deletetask(uint _index) public{
require(_index < alltasks[msg.sender].length, "Invalid task index");
     for (uint i=_index;i<alltasks[msg.sender].length-1;i++){
         alltasks[msg.sender][i]= alltasks[msg.sender][i+1];
         
     }
     alltasks[msg.sender].pop();
    }

}