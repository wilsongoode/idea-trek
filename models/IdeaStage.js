var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * IdeaStage Model
 * ==================
 */

var IdeaStage = new keystone.List('IdeaStage', {
    autokey: { from: 'name', path: 'key', unique: true },
    defaultSort: 'order'
});

IdeaStage.add({
    name: { type: String, required: true },
    order: { type: Types.Number }
});

IdeaStage.relationship({ ref: 'Idea', path: 'ideas', refPath: 'stage' });

IdeaStage.defaultColumns = 'name, order';
IdeaStage.register();
