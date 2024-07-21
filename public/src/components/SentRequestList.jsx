import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { sentRequestList } from "../utils/routes";
import axios from "axios";

export const SentRequestList = ({ currentUser }) => {
    const [sentRequests, setSentRequests] = useState([]);

    const getSentRequests = () => {
      const url = sentRequestList.replace("{userId}", currentUser._id);
      axios.get(url).then((data) => {
        setSentRequests(data.data);
      });
    }

    useEffect(() => {
      getSentRequests();
    }, []);
  
    return (
      <List>
        {sentRequests.map((friend) => (
          <ListItem
            key={friend._id}
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
