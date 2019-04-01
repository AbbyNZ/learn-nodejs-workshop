var marked = require('marked');
var express = require('express');
var server = express();
var formidable = require('express-formidable');

var getAllRecipes = require('./recipesDB.js').getAllRecipes;
var getRecipe = require('./recipesDB.js').getRecipe;
var updateRecipe = require('./recipesDB.js').updateRecipe;
var addRecipe = require('./recipesDB.js').addRecipe;
var deleteRecipe = require('./recipesDB.js').deleteRecipe;

var staticAssets = express.static('public');
server.use(staticAssets);
server.use(formidable());

server.set('view engine', 'ejs');

server.get('/', function(request, response) {
  var recipes = getAllRecipes();
  response.render('pages/index', { recipes: recipes });
});

server.get('/about', function(request, response) {
  response.render('pages/about');
});

server.get('/admin/recipe/new', function(request, response) {
  var newRecipe = {
    name: '',
    content: ''
  };
  response.render('pages/admin/new', {recipe: newRecipe})
});

server.get('/recipe/:id', function(request, response) {
  var recipe = getRecipe(request.params.id);
  var newRecipe = {
    id: recipe.id,
    name: recipe.name,
    content: marked(recipe.content)
  };
  response.render('pages/recipe', { recipe: newRecipe } );
});

server.get('/admin', function(request, response) {
  var recipes = getAllRecipes();
  response.render('pages/admin/index', {recipes: recipes});
});

server.post('/admin/recipe/new', function(request, response){
  var recipe = {
    name: request.fields.name,
    content: request.fields.content
  };
  addRecipe(recipe);
  response.redirect('/admin');
});

server.get('/admin/recipe/:id/edit', function(request, response) {
  var recipe = getRecipe(request.params.id);
  response.render('pages/admin/edit', {recipe: recipe});
});

server.post('/admin/recipe/:id', function(request, response) {
  updateRecipe({
    id: parseInt(request.params.id),
    name: request.fields.name,
    content: request.fields.content
  });
  response.redirect('/admin');
});

server.get('/admin/recipe/:id/delete', function(request, response){
  deleteRecipe(request.params.id);
  response.redirect('/admin');
});

server.get('/hello', function (request, response) {
  response.send('hello there');
});

server.get('/morning', function (request, response) {
  response.send('Good Morning! How are you?');
});

server.listen(3000, function() {
  console.log('Server has started listening on port 3000.');
});
