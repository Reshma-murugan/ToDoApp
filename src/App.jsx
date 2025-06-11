import { useState, useEffect, useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { 
  Container, CssBaseline, Typography, Box, Paper, Tabs, Tab, 
  Select, MenuItem, FormControl, InputLabel, SpeedDial, 
  SpeedDialIcon, SpeedDialAction, Drawer, IconButton,
  useMediaQuery,
  Zoom,
  Grow
} from '@mui/material'
import { SnackbarProvider, useSnackbar } from 'notistack'
import DraggableTodoList from './components/DraggableTodoList'
import AddTodo from './components/AddTodo'
import Navigation from './components/Navigation'
import Analytics from './components/Analytics'
import { isPast, isToday } from 'date-fns'
import BarChartIcon from '@mui/icons-material/BarChart'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'
import CloseIcon from '@mui/icons-material/Close'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { useTheme } from './context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { theme } = useTheme();

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, dueDate) => {
    const newTodo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority: 'medium'
    };
    setTodos(prev => [...prev, newTodo]);
    enqueueSnackbar('Task added successfully!', { variant: 'success' });
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const completed = !todo.completed;
        enqueueSnackbar(
          completed ? 'Task completed! 🎉' : 'Task uncompleted',
          { variant: completed ? 'success' : 'info' }
        );
        return { ...todo, completed };
      }
      return todo;
    }));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    enqueueSnackbar('Task deleted', { variant: 'error' });
  };

  const handleReorder = (newTodos) => {
    setTodos(newTodos);
    enqueueSnackbar('Tasks reordered', { variant: 'info' });
  };

  const clearCompletedTodos = () => {
    const completedCount = todos.filter(todo => todo.completed).length;
    setTodos(todos.filter(todo => !todo.completed));
    enqueueSnackbar(`Cleared ${completedCount} completed tasks`, { variant: 'info' });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const sortTodos = (todosToSort) => {
    return [...todosToSort].sort((a, b) => {
      switch(sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
  };

  const filteredTodos = () => {
    let filtered;
    switch(currentTab) {
      case 0: // All
        filtered = todos;
        break;
      case 1: // Active
        filtered = todos.filter(todo => !todo.completed);
        break;
      case 2: // Completed
        filtered = todos.filter(todo => todo.completed);
        break;
      case 3: // Due Today
        filtered = todos.filter(todo => 
          todo.dueDate && isToday(new Date(todo.dueDate)) && !todo.completed
        );
        break;
      case 4: // Overdue
        filtered = todos.filter(todo => 
          todo.dueDate && isPast(new Date(todo.dueDate)) && 
          !isToday(new Date(todo.dueDate)) && !todo.completed
        );
        break;
      default:
        filtered = todos;
    }
    return sortTodos(filtered);
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const overdueTodosCount = todos.filter(todo => 
    todo.dueDate && 
    isPast(new Date(todo.dueDate)) && 
    !isToday(new Date(todo.dueDate)) && 
    !todo.completed
  ).length;
  const dueTodayCount = todos.filter(todo => 
    todo.dueDate && 
    isToday(new Date(todo.dueDate)) && 
    !todo.completed
  ).length;

  const speedDialActions = [
    { icon: <BarChartIcon />, name: 'Analytics', action: () => setDrawerOpen(true) },
    { icon: <DeleteSweepIcon />, name: 'Clear Completed', action: clearCompletedTodos },
  ];

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation 
        todoCount={overdueTodosCount} 
        onCategorySelect={(category) => {
          switch(category) {
            case 'all': setCurrentTab(0); break;
            case 'active': setCurrentTab(1); break;
            case 'completed': setCurrentTab(2); break;
          }
        }}
      />
      <Container maxWidth="md">
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ my: 4, position: 'relative', minHeight: '80vh' }}
        >
          <Grow in={true}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Task Master
            </Typography>
          </Grow>
          
          <Zoom in={true}>
            <Box>
              <AddTodo onAdd={addTodo} />
            </Box>
          </Zoom>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="createdAt">Created Date</MenuItem>
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Paper sx={{ mb: 2 }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label={`All (${todos.length})`} />
                  <Tab label={`Active (${activeTodosCount})`} />
                  <Tab label={`Completed (${todos.length - activeTodosCount})`} />
                  <Tab label={`Due Today (${dueTodayCount})`} />
                  <Tab label={`Overdue (${overdueTodosCount})`} />
                </Tabs>
              </Paper>
              
              <DraggableTodoList 
                todos={filteredTodos()} 
                onToggle={toggleTodo} 
                onDelete={deleteTodo}
                onReorder={handleReorder}
              />
            </motion.div>
          </AnimatePresence>

          <SpeedDial
            ariaLabel="Task actions"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {speedDialActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.action}
              />
            ))}
          </SpeedDial>
        </Box>
      </Container>

      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: isMobile ? 'auto' : 400, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Analytics todos={todos} />
        </Box>
      </Drawer>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <SnackbarProvider 
      maxSnack={3} 
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <TodoApp />
    </SnackbarProvider>
  );
}

export default App
