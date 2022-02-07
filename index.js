const express = require('express');
const mongoose = require('mongoose'); 

mongoose.connect('mongodb+srv://dbUser:dbUserPass123@cluster0.abel8.mongodb.net/my_database', {useNewUrlParser: 
true});

const app = new express();
const ejs = require('ejs');
const { resourceUsage } = require('process');

const fileUpload = require('express-fileupload');  
const validateMiddleWare = require('./middleware/validateMiddleware');
const expressSession = require('express-session');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const flash = require('connect-flash');

app.set('view engine', 'ejs');

global.loggedIn = null;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(fileUpload());
app.use('/posts/store', validateMiddleWare);//The first argument ensures this only applies to the request to create posts. If we omitted this, then validateMiddleWare would be executed for all requests.
app.use(expressSession({
  secret: 'keyboard cat'
}));
app.use(flash());
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

let port = process.env.PORT;
if (port == null || port==""){
  port = 4000;
}

app.listen(port, () => {
  console.log('App listening...');
});

const homePageController = require('./controllers/homePage');
const aboutPageController = require('./controllers/aboutPage');
const contactPageController = require('./controllers/contactPage');
const newPostController = require('./controllers/newPost');
const storeNewPostController = require('./controllers/storeNewPost');
const displayPostController = require('./controllers/displayPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginPageController = require('./controllers/loginPage');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');



app.get('/', homePageController);
app.get('/about', aboutPageController);
app.get('/contact', contactPageController);
app.get('/posts/new', authMiddleware, newPostController);
app.post('/posts/store', authMiddleware, storeNewPostController);
app.get('/post/:id', displayPostController);
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginPageController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);
app.get('/auth/logout', logoutController)

app.use((req, res) => res.render('notfound'));