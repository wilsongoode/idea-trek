var keystone = require('keystone');
var Idea = keystone.list('Idea');

module.exports = function (req, res) {
  if (!req.body.title || !req.body.description) {
    return res.send({ status: 'incomplete data set' });
  }

  var newIdea = new Idea.model();
  Idea.updateItem(newIdea, req.body, function (error) {
    res.locals.ideaSubmitted = true;
    if (error) res.locals.saveError = true;
    res.render('newIdea');
  });
};