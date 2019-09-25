var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'ideas';
	locals.filters = {
		stage: req.params.stage,
	};
	locals.data = {
		ideas: [],
		stages: [],
	};

	// Load all categories
	view.on('init', function (next) {

		keystone.list('IdeaStage').model.find().sort('order').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.stages = results;

			// Load the counts for each category
			async.each(locals.data.stages, function (stage, next) {

				keystone.list('Idea').model.count().where('stage').in([stage.id]).exec(function (err, count) {
					stage.postCount = count;
					console.log(`${stage.name}: ${stage.postCount}`)
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current stage filter
	view.on('init', function (next) {

		if (req.params.stage) {
			keystone.list('IdeaStage').model.findOne({ key: locals.filters.stage }).exec(function (err, result) {
				locals.data.stage = result;
				console.log("this is the stage: ", result);
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the ideas
	view.on('init', function (next) {

		var q = keystone.list('Idea').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				// state: 'draft',
			},
		})
			.sort('-publishedDate')
			.populate('author stage tags');

		if (locals.data.stage) {
			console.log("idea list", 74);
			console.log(locals.data.stage);
			
			q.where('stage').in([locals.data.stage]);
		}

		q.exec(function (err, results) {
			console.log(78);
			console.log(results);
			console.log(80);
			locals.data.ideas = results;
			// console.log(locals.data.ideas)
			next(err);
		});
	});

	// Render the view
	view.render('ideas_list');
};
