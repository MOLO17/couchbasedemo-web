import React, { useState, useEffect, useReducer } from 'react';
import ContactList from './components/ContactList'
import ContactsAppBar from './components/ContactsAppBar';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import NewContactDialog from './components/NewContactDialog';
import uuidv4 from 'uuid/v4';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONTACTS_SET':
      return action.contacts;
    case 'CONTACT_EDITED':
      return state.find(({ id }) => id === action.contact.id)
        ? state.map(
            contact => contact.id === action.contact.id
              ? { ...contact, ...action.contact }
              : contact,
          )
        : [...state, action.contact];
    case 'CONTACT_DELETED':
      return state.filter(({ id }) => id !== action.contact);
    default:
      return state;
  }
};

const App = ({ dataSource }) => {
  const [state, dispatch] = useReducer(reducer, []);
  const [addContactDialogShown, toggleAddContactDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const addContact = data => {
    const contact = data.id ? data : {
      id: uuidv4(),
      ...data,
    };
    dataSource.addContact(contact);
    dispatch({ type: 'CONTACT_EDITED', contact });
    toggleAddContactDialog(false);
    setEditingContact(null);
  };

  const deleteContact = contact => {
    dataSource.deleteContact(contact);
    dispatch({ type: 'CONTACT_DELETED', contact });
  };

  const editContact = contact => {
    dataSource.editContact(contact);
    dispatch({ type: 'CONTACT_EDITED', contact });
    toggleAddContactDialog(false);
    setEditingContact(null);
  };

  useEffect(() => {
    dataSource.contactsActions$.subscribe(contactsAction => dispatch(contactsAction));
    return dataSource.contactsActions$.unsubscribe;
  }, [dataSource])

  return (
    <div className="App">
      <ContactsAppBar />
      <div>
        <NewContactDialog
          onSubmit={editingContact ? editContact : addContact}
          open={addContactDialogShown}
          onClose={() => toggleAddContactDialog(false)}
          contact={editingContact}
        />
        <ContactList
          contacts={state}
          onContactEditClick={contact => {
            setEditingContact(state.find(({ id }) => id === contact));
            toggleAddContactDialog(true);
          }}
          onContactDeleteClick={contact => deleteContact(contact)}
        />
        <Fab style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }} onClick={() => {
          setEditingContact(null);
          toggleAddContactDialog(true);
        }}><AddIcon /></Fab>
      </div>
    </div>
  )
};

export default App;