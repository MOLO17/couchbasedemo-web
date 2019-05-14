import React from 'react';

import { List, ListItem, ListItemText } from '@material-ui/core';

const ContactList = ({ contacts }) => (
  <List>
    {
      contacts.map(({ id, name, surname, phoneNumber }) => (
        <ListItem alignItems="flex-start" key={id}>
          <ListItemText
            primary={`${name} ${surname}`}
            secondary={phoneNumber ? phoneNumber : 'No phone number'}
          />
        </ListItem>
      ))
    }
  </List>
);

export default ContactList;