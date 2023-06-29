import React from 'react';

import { styles } from './styles';
import { AppBar, Container, Toolbar, Typography } from '@material-ui/core';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={styles.root}>
      <AppBar position="static" style={styles.header}>
        <Toolbar>
          <Typography variant="h6">Doctor Selector</Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" style={styles.content}>
        {children || 'Bad'}
      </Container>
      <footer style={styles.footer}>
        <Typography variant="body2" align="center">
          Vladyslav Tymchuk
        </Typography>
      </footer>
    </div>
  );
};

export default Layout;
