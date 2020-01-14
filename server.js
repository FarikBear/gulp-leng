/**
 * Simple blog server
 * After start API will available on url http://127.0.0.1:3030/some/route/here
 */

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {resolve, join} = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(cors());

const users = new Map();
const posts = new Map();
const salt = 'FOOBARBAZ';

const hash = (text) => {
  return crypto.createHash('sha256')
    .update(text)
    .digest('hex');
};


/**
 * Request
 * {
 *   "login": "test",
 *   "password": "test"
 * }
 *
 * Response (success: 200)
 * {
 *   "user": {
 *     "id": 1,
 *     "username": "John Doe",
 *     "login": "test",
 *   },
 *   "token": "blablabla"
 * }
 *
 * Response (error: 404)
 * {
 *   "errors": [
 *     "Error message"
 *   ]
 * }
 *
 *
 * @param  {[type]} '/login'  url for login
 * @param  {[type]} (request, response)     [description]
 * @return {[type]}           [description]
 */
app.post('/login', (request, response) => {
  let {login, password} = request.body;

  login = login.trim();
  password = hash(password.trim());

  let user = [...users.values()].find((entry) => {
    return entry.login === login && entry.password === password;
  });

  if (!user) {
    return response.status(404).json({
      errors: [
        'User not found'
      ]
    });
  }

  response.json({
    user: {
      ...user,
      password: null
    },
    token: jwt.sign({
      id: user.id,
      login: user.login,
    }, salt),
  });
});

/**
 * Request
 * {
 *   "login": "test",
 *   "password": "test",
 *   "username": "John Doe"
 * }
 *
 * Response (success: 200)
 * {
 *   "user": {
 *     "id": 1,
 *     "username": "John Doe",
 *     "login": "test",
 *   }
 * }
 *
 * Response (error: 400)
 * {
 *   "errors": {
 *     "login": "Login can not be empty"
 *   }
 * }
 *
 *
 * @param  {[type]} '/register'  url for register
 * @param  {[type]} (request, response)     [description]
 * @return {[type]}           [description]
 */
app.post('/register', (request, response) => {
  let {
    login = '',
    password = '',
    username = ''
  } = request.body;

  login = login.trim();
  password = password.trim();
  username = username.trim();

  let user = [...users.values()].find((entry) => {
    return entry.login === login;
  });

  if (user) {
    return response.status(400).json({
      errors: {
        username: 'User already exists',
      }
    });
  } else if (login.length < 1) {
    return response.status(400).json({
      errors: {
        login: 'Login can not be empty',
      }
    });
  } else if (password.length < 1) {
    return response.status(400).json({
      errors: {
        password: 'Password can not be empty',
      }
    });
  } else if (username.length < 1) {
    return response.status(400).json({
      errors: {
        username: 'Username can not be empty',
      }
    });
  }

  user = {
    id: users.size,
    login,
    username,
    password: hash(password),
  };

  users.set(user.id, user);

  response.json({
    user: {
      ...user,
      password: null
    }
  });
});

app.get('/posts', (request, response) => {

});

app.get('/posts/:id', (request, response) => {

});

app.post('/posts/create', (request, response) => {
  jwt.verify('token', salt, function(err, decoded) {
    console.log(decoded);
  });
});

app.delete('/posts/:id', (request, response) => {

});

app.patch('/posts/:id', (request, response) => {

});

app.listen(3030);
