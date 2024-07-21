import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DoneIcon from '@mui/icons-material/Done';
import { useEffect, useState } from "react";
import { acceptFriendRequest, incomingRequestList } from "../utils/routes";
import axios from "axios";



export const AcceptRequestList = ({ currentUser, getFriendsList }) => {
    const [incomingRequests, setIncomingRequests] = useState([]);

    const getIncomingRequests = () => {
      const url = incomingRequestList.replace("{userId}", currentUser._id);
      axios.get(url).then((data) => {
        setIncomingRequests(data.data);
      });
    }
    useEffect(() => {
      getIncomingRequests();
    }, []);

    const handleAcceptRequest = async (friendId) => {
      console.log("accept request")
    }
  
    return (
      <List>
        {incomingRequests.map((friend) => (
          <ListItem
            key={friend._id}
            secondaryAction={
              <IconButton onClick={() => {handleAcceptRequest(friend._id)}} edge="end">
                <DoneIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar src={`data:image/svg+xml;base64,${friend.avatarImage}`} />
            </ListItemAvatar>
            <ListItemText primary={friend.username} />
          </ListItem>
        ))}
      </List>
    );
  }
