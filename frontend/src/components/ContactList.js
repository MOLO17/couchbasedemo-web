import React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const ContactList = ({ contacts, onContactEditClick, onContactDeleteClick }) => (
  <List>
    {
      contacts.map(({ id, name, surname, phoneNumber }) => (
        <ListItem alignItems="flex-start" key={id}>
          <ListItemText
            primary={`${name || ''} ${surname || ''}`}
            secondary={phoneNumber || 'No phone number'}
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Edit" onClick={() => onContactEditClick(id)}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="Delete" onClick={() => onContactDeleteClick(id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))
    }
  </List>
);

export default ContactList;