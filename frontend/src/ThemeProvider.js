import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  status: {},
});

const CustomStyles = () => (
    <ThemeProvider theme={theme}>
    </ThemeProvider>
  )

export default CustomStyles;