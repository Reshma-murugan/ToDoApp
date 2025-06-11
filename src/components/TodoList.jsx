import { List, Paper, Typography, Box } from '@mui/material'
import TodoItem from './TodoItem'

function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography color="text.secondary">
          No todos to display
        </Typography>
      </Box>
    )
  }

  return (
    <Paper elevation={2}>
      <List>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </List>
    </Paper>
  )
}

export default TodoList
