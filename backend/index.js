require('dotenv').config();

const couchbase = require('couchbase');
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const uuidv4 = require('uuid/v4');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const {
  env: {
    USERNAME_CLUSTER = '',
    PASSWORD_CLUSTER = '',
    CLUSTER_CONNECTION_STRING = 'couchbase://localhost',
    BUCKET = 'couchbase-demo',
    PORT = 8080,
  },
} = process;

const cluster = new couchbase.Cluster(CLUSTER_CONNECTION_STRING);
cluster.authenticate(USERNAME_CLUSTER, PASSWORD_CLUSTER);

const bucket = cluster.openBucket(BUCKET, (err) => {
  if (err) {
    console.error('Error occurred during cluster opening!', err);
    process.exit();
  }
});

app.post('/api/contacts', (req, res) => {
  const {
    id = uuidv4(),
    name = '',
    surname = '',
    email = '',
    phoneNumber = ''
  } = req.body;

  const document = {
    id,
    name,
    surname,
    email,
    phoneNumber,
    type: 'Contact',
  };

  bucket.insert(id, document, {}, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(result);
    }
  })
});

app.put('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    surname,
    email,
    phoneNumber
  } = req.body;

  if (!id) {
    res.status(400).json({ error: 'Invalid contactId' });
  }

  const document = {
    id,
    name,
    surname,
    email,
    phoneNumber,
    type: 'Contact',
  };

  bucket.upsert(id, document, (err, result) => {
    if (err) {
      console.error('Error occurred upsertint contact', err);
      res.status(500).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'Invalid contactId' });
  }

  bucket.remove(id, (err, result) => {
    if (err) {
      console.error('Error occurred removing contact', err);
      res.status(500).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

app.get('/api/contacts', (req, res) => {
  const query = couchbase.N1qlQuery.fromString('SELECT id, name, surname, email, phoneNumber FROM `couchbase-demo` WHERE type = "Contact"');
  bucket.query(query, (err, rows) => {
    if (err) {
      console.error('Error occurred querying contact', err);
      res.status(500).json({ error: err });
    } else {
      res.json(rows);
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} ...`);
});