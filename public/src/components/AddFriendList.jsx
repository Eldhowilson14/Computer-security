import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { sendFriendRequest, addFriendsList } from "../utils/routes";
import { useEffect, useState } from "react";

export const AddFriendList = ({ currentUser }) => {
  const [addFriends, setAddFriends] = useState([]);

  const getNewFriendsList = () => {
    const url = addFriendsList.replace("{userId}", currentUser._id);
    axios.get(url).then((data) => {
      setAddFriends(data.data);
    });
  }

  useEffect(() => {
    getNewFriendsList();
  }, []);

  

  const handleSendRequest = async (friendId) => {
    console.log("send request")
  }

  return (
    <List>
      {addFriends.map((friend) => (
        <ListItem
          key={friend._id}
          secondaryAction={
            <IconButton onClick={() => {handleSendRequest(friend._id)}} edge="end">
              <SendIcon />
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
};
