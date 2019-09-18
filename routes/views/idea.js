var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'ideas';
	locals.filters = {
		idea: req.params.idea,
	};
	locals.data = {
        ideas: []
	};

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list('Idea').model.findOne({
			state: 'published',
			slug: locals.filters.idea,
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.data.ideas = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Idea').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.ideas = results;
			next(err);
		});

	});

	// Render the view
	view.render('idea');
};
