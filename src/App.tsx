import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import AppRouter from './routes/AppRouter';
import store from './redux/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <AppRouter />
    </Provider>
  );
};

export default App;
