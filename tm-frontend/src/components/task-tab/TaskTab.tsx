import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Task } from "../../models/task.model";

const GET_TASK_URL = "/tasks/"

function TaskTab() {
    const {taskId} = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [task, setTask] = useState<Task>();

    useEffect(()=> {
      ;(async () =>{
        try {
          const response = await axiosPrivate.get(GET_TASK_URL + taskId);
          setTask(response.data.data)
        } catch (error) {
          console.error(error);
          
        }
      }
        
      )()
    }, [])

    const handleMoveStatus = async()=>{
      let status = 'In-progress'
      if (task?.status === 'Completed') {
        return
      }else if(task?.status === 'In-progress'){
        status = 'Completed'
      }

      const response = await axiosPrivate.patch(GET_TASK_URL + task?._id, {status});
      const updatedTask = response?.data?.data;
      setTask(updatedTask) 
    }
  return (
    <div className="text-center flex flex-col gap-6 items-center">
      <h1 className="text-center display1 mt-4">{task?.title}</h1>
      <p className="caption text-center">{task?.description}</p>
      <p className="text-center">Time Left: <span>{timeLeft(task?.duedate.toString())}</span></p>
      <p>Priority: <span>{task?.priority}</span></p>
      <p>Status: <span>{task?.status}</span></p>

      <button className="auth-btn w-1/12" onClick={handleMoveStatus}>Move Status</button>
    </div>
  )
}

const timeLeft = (dateString: string | undefined) => {
  const now = new Date();
  const date = new Date(dateString as string)
  if(!date) return;

  const years = Math.abs(date?.getFullYear() - now.getFullYear());
  const months = Math.abs(date?.getMonth() - now.getMonth());
  const days = Math.abs(date.getDate() - now.getDate());
  const hours = Math.abs(date.getHours() - now.getHours());

  return `${years} Years, ${months} Months, ${days} Days, ${hours} Hours`
}

export default TaskTab