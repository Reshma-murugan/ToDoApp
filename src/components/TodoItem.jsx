import { useState } from 'react'
import { 
  ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Checkbox, IconButton, Typography, Stack, Chip, Menu,
  MenuItem, Fade
} from '@mui/material'
import { motion } from 'framer-motion'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FlagIcon from '@mui/icons-material/Flag'
import { format, isPast, isToday } from 'date-fns'

const priorityColors = {
  high: '#f44336',
  medium: '#ff9800',
  low: '#4caf50'
};

function TodoItem({ todo, onToggle, onDelete, onPriorityChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getDueStatus = () => {
    if (!todo.dueDate) return null;
    
    const due = new Date(todo.dueDate);
    if (todo.completed) return null;
    
    if (isPast(due) && !isToday(due)) {
      return <Chip label="Overdue" color="error" size="small" />;
    }
    if (isToday(due)) {
      return <Chip label="Due Today" color="warning" size="small" />;
    }
    return null;
  };

  const formatDueDate = (date) => {
    if (!date) return '';
    return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <ListItem
      component={motion.div}
      whileHover={{ scale: 1.01 }}
      secondaryAction={
        <Stack direction="row" spacing={1}>
          {getDueStatus()}
          <IconButton 
            edge="end" 
            aria-label="more"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <IconButton 
            edge="end" 
            aria-label="delete" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(todo.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      }
      disablePadding
    >
      <ListItemButton 
        onClick={() => onToggle(todo.id)} 
        dense
        sx={{
          borderLeft: 4,
          borderColor: priorityColors[todo.priority || 'medium'],
          transition: 'all 0.2s ease'
        }}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={todo.completed}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <Stack sx={{ flex: 1 }}>
          <ListItemText
            primary={
              <Typography
                component={motion.div}
                animate={{
                  color: todo.completed ? 'text.disabled' : 'text.primary',
                  textDecoration: todo.completed ? 'line-through' : 'none'
                }}
              >
                {todo.text}
              </Typography>
            }
          />
          {todo.dueDate && (
            <Typography variant="caption" color="text.secondary">
              Due: {formatDueDate(todo.dueDate)}
            </Typography>
          )}
        </Stack>
      </ListItemButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => {
          onPriorityChange(todo.id, 'high');
          handleClose();
        }}>
          <FlagIcon sx={{ color: priorityColors.high, mr: 1 }} />
          High Priority
        </MenuItem>
        <MenuItem onClick={() => {
          onPriorityChange(todo.id, 'medium');
          handleClose();
        }}>
          <FlagIcon sx={{ color: priorityColors.medium, mr: 1 }} />
          Medium Priority
        </MenuItem>
        <MenuItem onClick={() => {
          onPriorityChange(todo.id, 'low');
          handleClose();
        }}>
          <FlagIcon sx={{ color: priorityColors.low, mr: 1 }} />
          Low Priority
        </MenuItem>
      </Menu>
    </ListItem>
  );
}

export default TodoItem;
