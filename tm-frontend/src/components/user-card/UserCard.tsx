import { Avatar } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { User } from "../../models/user.model";

function UserCard({user}: any) {
  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(()=>{
    setCurrentUser(user)   
  }, [])
  return (
    <div className="p-6 flex justify-center items-start flex-col gap-2">
      <div className="username flex gap-2 items-center justify-start">
        <Avatar sx={{ bgcolor: blue[500] }}>{currentUser?.fullname[0].toUpperCase()}</Avatar>
        <p className="subheading2">{currentUser?.username}</p>
      </div>

      <p className="subheading1 text-center">{currentUser?.fullname}</p>

      <p className="body2">{currentUser?.email}</p>
    </div>
  );
}

export default UserCard;
