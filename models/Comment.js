var keystone = require("keystone");
var Types = keystone.Field.Types;

/**
 * Idea Model
 * ==========
 */

var Comment = new keystone.List("Comment", {
	map: { name: "author"+"createdAt" },
	autokey: { path: "slug", from: "author"+"createdAt", unique: true },
	defaultSort: "-createdAt",
	drilldown: "author"
});

Comment.add({
	author: { type: Types.Relationship, ref: "User", index: true },
	createdAt: { type: Date, default: Date.now },
	message: { type: Types.Html, wysiwyg: true, height: 150 },
	idea: {
		type: Types.Relationship,
		ref: "Idea",
		many: false
	}
});

// Comment.schema.virtual("content.full").get(function() {
// 	return this.content.extended || this.content.brief;
// });

Comment.defaultColumns =
    "author|20%, createdAt|20%, idea|20%";
    
Comment.register();
