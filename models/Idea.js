var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Idea Model
 * ==========
 */

var Idea = new keystone.List('Idea', {
	map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true },
    defaultSort: '-createdAt',
    drilldown: 'author'
});

Idea.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    author: { type: Types.Relationship, ref: 'User', index: true },
    createdAt: { type: Date, default: Date.now },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		description: { type: Types.Html, wysiwyg: true, height: 150 },
		fundingStatus: { type: Types.Html, wysiwyg: true, height: 150 },
		problem: { type: Types.Html, wysiwyg: true, height: 150 },
		howSolve: { type: Types.Html, wysiwyg: true, height: 150 },
		stakeholders: { type: Types.Html, wysiwyg: true, height: 150 },
		barriers: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
    },
    tags: { type: Types.Relationship, ref: 'Tag', many: true },
    stage: { type: Types.Relationship, ref: 'IdeaStage', default: 'Intake', many: false }
});

Idea.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Idea.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%, stage';
Idea.register();
