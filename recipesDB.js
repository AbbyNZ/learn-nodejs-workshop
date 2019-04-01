var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');

var adapter = new FileSync('recipesDB.json');
var db = low(adapter);
db.defaults({
  recipes: [
    {
      id: 1,
      name: 'Traditional Cupcakes',
      content: 'content goes here'
    }
  ]
}).write();

function getAllRecipes(){
  var recipes = db.get('recipes').value();
  return recipes;
}

module.exports = {
  deleteRecipe: deleteRecipe,
  addRecipe: addRecipe,
  getAllRecipes: getAllRecipes,
  getRecipe: getRecipe,
  updateRecipe: updateRecipe
};

function getRecipe(id) {
  var recipe = db.get('recipes').find({id: parseInt(id)}).value();
  return recipe;
}

function updateRecipe(recipe) {
  db.get('recipes')
    .find({id: recipe.id})
    .assign({ name: recipe.name, content: recipe.content})
    .write();
}

function getNextId() {
  var recipeWithBiggestId = db.get('recipes').maxBy(function(recipe){
    return recipe.id;
  });
  return recipeWithBiggestId.value().id+1;
}

function addRecipe(name, content){
  var newRecipe = {
    id: getNextId(),
    name: name,
    content: content
  };
  db.get('recipes')
    .push(newRecipe)
    .write();
}

function deleteRecipe(id){
  db.get('recipes')
    .remove({id: parseInt(id)})
    .write();
}
