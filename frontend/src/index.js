import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { from, fromEvent, concat } from 'rxjs';
import { mergeMap, map, concatAll } from 'rxjs/operators';

const BACKEND_HOST = 'localhost';

const socket = new WebSocket(`ws://${BACKEND_HOST}:8081`);
const socketData$ = fromEvent(socket, 'message').pipe(
  map(({ data }) => JSON.parse(data)),
  concatAll(),
);

const dataSource = {
  addContact: (contact) => from(
    fetch(`http://${BACKEND_HOST}:8080/api/contacts`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    }),
  ).pipe(mergeMap(res => res.json())),
  deleteContact: (id) => from(
    fetch(`http://${BACKEND_HOST}:8080/api/contacts/${id}`, {
      method: 'DELETE',
    }),
  ).pipe(mergeMap(res => res.json())),
  editContact: ({ id, ...contact }) => from(
    fetch(`http://${BACKEND_HOST}:8080/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    }),
  ),
  contactsActions$: concat(
    from(
      fetch(`http://${BACKEND_HOST}:8080/api/contacts`)
    ).pipe(
      mergeMap(res => res.json()),
      map(contacts => ({
        type: 'CONTACTS_SET',
        contacts,
      })),
    ),
    socketData$.pipe(
      map(({ contact, deleted }) => deleted ? {
        type: 'CONTACT_DELETED',
        contact: contact.id,
      } : {
        type: 'CONTACT_EDITED',
        contact,
      }),
    ),
  ),
};

ReactDOM.render(<App dataSource={dataSource} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
