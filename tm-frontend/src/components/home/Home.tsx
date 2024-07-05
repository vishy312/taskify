import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { User } from "../../models/user.model";

const setting = "Logout";

const GET_CURRENT_USER = "/users/current-user"
const LOGOUT_URL = "/users/logout"

function Home() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>();
  const [currentUser, setCurrentUser] = useState<User>();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(()=> {
    ;(async() => {
        try {
          const response = await axiosPrivate.get(GET_CURRENT_USER)
          setCurrentUser(response.data.data)
        } catch (error) {
          console.error(error);
          navigate("/login", {state: {from: location}, replace: true});
        }
    })()
  }, [])

  const handleLogout = async() => {
    try {
      await axiosPrivate.post(LOGOUT_URL);
      navigate("/login")
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="w-full box-border">
      <div className="header w-full bg-[#215ba8] text-white px-4 py-3 text-2xl tracking-widest font-bold flex justify-between items-center box-border">
        <Link to={"/home"}>
          <div className="brand-assests flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined">task_alt</span>
            <p className="">TASKIFY</p>
          </div>
        </Link>

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Expand">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar>{currentUser?.fullname[0].toUpperCase()}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >  
              <MenuItem onClickCapture={handleLogout} key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
          </Menu>
        </Box>
      </div>

      <Outlet />
    </div>
  );
}

export default Home;
