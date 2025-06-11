import { useState } from 'react'
import { Paper, InputBase, IconButton, Stack, TextField, Button } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddIcon from '@mui/icons-material/Add'

function AddTodo({ onAdd }) {
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text, dueDate)
    setText('')
    setDueDate(null)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        component="form"
        sx={{
          p: 2,
          mb: 2
        }}
        onSubmit={handleSubmit}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <InputBase
              sx={{ flex: 1, p: 1 }}
              placeholder="Add a new todo"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button 
              variant="contained" 
              type="submit" 
              startIcon={<AddIcon />}
              size="small"
            >
              Add
            </Button>
          </Stack>
          <DateTimePicker
            label="Due Date (Optional)"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Stack>
      </Paper>
    </LocalizationProvider>
  )
}

export default AddTodo
