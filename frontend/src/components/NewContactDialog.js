import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@material-ui/core';

const NewContactDialog = ({ onSubmit, contact, ...props }) => {
  const initialFormValues = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  useEffect(() => {
    setFormValues(contact || initialFormValues);
  }, [contact])

  const handleFormValueChange = (formItem) =>
    event => setFormValues({ ...formValues, [formItem]: event.target.value });

  const formItems = [
    {
      id: 'name',
      label: 'Name',
      type: 'string',
      defaultValue: formValues.name,
      autoFocus: true,
      onChange: handleFormValueChange('name'),
    },
    {
      id: 'surname',
      label: 'Surname',
      type: 'string',
      defaultValue: formValues.surname,
      onChange: handleFormValueChange('surname'),
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      defaultValue: formValues.email,
      onChange: handleFormValueChange('email'),
    },
    {
      id: 'phoneNumber',
      label: 'Phone number',
      type: 'number',
      defaultValue: formValues.phoneNumber,
      onChange: handleFormValueChange('phoneNumber'),
    },
  ];

  const addContact = () => {
    setFormValues(initialFormValues);
    return onSubmit(formValues)
  }

  return (
    <Dialog {...props}>
      <DialogTitle id="form-dialog-new-contact">{contact ? 'Edit contact' : 'Create new contact'}</DialogTitle>
      <DialogContent>
        {
          formItems.map((formItem) => (
            <TextField
              {...formItem}
              key={formItem.id}
              margin="dense"
              fullWidth
            />
          ))
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={addContact} color="primary">
          {contact ? 'Edit' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  )};

export default NewContactDialog;