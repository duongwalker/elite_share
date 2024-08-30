import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import { Dispatch, SetStateAction, useState } from 'react';


interface GroupMember {
  name: string;
  group_name: string;
  user_id: number
}

interface CheckboxListProps {
  members: GroupMember[];
  setShareMemberIds: Dispatch<SetStateAction<number[]>>
}


export const CheckboxList: React.FC<CheckboxListProps> = ({ members, setShareMemberIds }) => {
  const [checked, setChecked] = useState<number[]>([]);


  const handleToggle = (member: GroupMember) => () => {
    if (checked) {
      const currentIndex = checked.indexOf(member.user_id);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(member.user_id);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
      setShareMemberIds(newChecked)
    }
    console.log("checked")
    console.log(checked)
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {members.map((member, index) => {
        const member_name = member.name
        const labelId = `checkbox-list-label-${member_name}`;
        console.log('member')
        console.log(member)

        return (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                <CommentIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(member)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(member.user_id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>

              <ListItemText id={labelId} primary={member_name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
