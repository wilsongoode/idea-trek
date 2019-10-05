var keystone = require("keystone");

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = "ideas";
	locals.filters = {
		idea: req.params.ideaSlug
	};
	locals.data = {
		idea: [],
		// comments: []
	};

	// Load the current post
	view.on("init", function(next) {
		var q1 = keystone
			.list("Idea")
			.model.findOne({
				// state: 'published',
				slug: locals.filters.idea
			})
			.populate("author")
			.populate({ path: 'comments', populate: { path: 'author' }});

		q1.exec(function(err, result) {
			// console.log(result);

			locals.data.idea = result;
			next(err);
		});

		// var q2 = keystone
		// 	.list("Comment")
		// 	.model.find({ idea: locals.filters.idea })
		// 	.sort("-createdAt")
		// 	.populate("author");

		// q2.exec(function(err, result) {
		// 	// console.log(result);

		// 	locals.data.comments = result;
		// 	next(err);
		// });
	});

	// Load other posts
	// view.on('init', function (next) {

	// 	var q = keystone.list('Idea').model.find().where('state', 'published').sort('-createdAt').populate('author').limit('4');

	// 	q.exec(function (err, results) {
	// 		locals.data.idea = results;
	// 		next(err);
	// 	});

	// });

	// Render the view
	view.render("idea");
};
