import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { List, Paper, Box } from '@mui/material';
import TodoItem from './TodoItem';
import { motion, AnimatePresence } from 'framer-motion';

function DraggableTodoList({ todos, onToggle, onDelete, onReorder }) {
  const [enabled, setEnabled] = useState(false);

  // Workaround for hydration issues with SSR
  useState(() => {
    setEnabled(true);
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  if (!enabled) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <Paper elevation={2}>
            <List ref={provided.innerRef} {...provided.droppableProps}>
              <AnimatePresence>
                {todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided, snapshot) => (
                      <Box
                        component={motion.div}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          backgroundColor: snapshot.isDragging ? 'action.hover' : 'transparent',
                          '& > *': { // Target the ListItem
                            transition: 'background-color 0.2s ease',
                          }
                        }}
                      >
                        <TodoItem
                          todo={todo}
                          onToggle={onToggle}
                          onDelete={onDelete}
                        />
                      </Box>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </List>
          </Paper>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableTodoList;
