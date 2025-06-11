import { useState } from 'react';
import { Paper, Typography, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics({ todos }) {
  const [view, setView] = useState('completion');

  const getCompletionData = () => {
    const completed = todos.filter(todo => todo.completed).length;
    const active = todos.length - completed;
    
    return {
      labels: ['Completed', 'Active'],
      datasets: [{
        data: [completed, active],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1
      }]
    };
  };

  const getTimelineData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const completedByDay = last7Days.map(date => 
      todos.filter(todo => 
        todo.completed && 
        new Date(todo.createdAt).toISOString().split('T')[0] === date
      ).length
    );

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [{
        label: 'Tasks Completed',
        data: completedByDay,
        borderColor: '#1976d2',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(25, 118, 210, 0.1)'
      }]
    };
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Task Analytics
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, newView) => newView && setView(newView)}
          size="small"
        >
          <ToggleButton value="completion">Completion Rate</ToggleButton>
          <ToggleButton value="timeline">7-Day Timeline</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box sx={{ height: 300 }}>
        {view === 'completion' ? (
          <Doughnut 
            data={getCompletionData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        ) : (
          <Line 
            data={getTimelineData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        )}
      </Box>
    </Paper>
  );
}

export default Analytics;
