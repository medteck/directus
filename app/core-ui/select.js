//  Select Core UI component
//  Directus 6.0

//  (c) RANGER
//  Directus may be freely distributed under the GNU license.
//  For all details and documentation:
//  http://www.getdirectus.com

define(['app', 'core/UIComponent', 'core/UIView', 'core/t'],function(app, UIComponent, UIView, __t) {

  'use strict';

  var template = '<div class="select-container" style="margin-top: 4px;margin-bottom: 6px;"> \
                    <select name="{{name}}" {{#if readonly}}disabled{{/if}}>{{#if allow_null}}<option value="">{{placeholder_text}}</option>{{/if}}{{#options}}<option value="{{key}}" {{#if selected}}selected{{/if}}>{{value}}</option>{{/options}}</select> \
                    <i class="material-icons select-arrow">arrow_drop_down</i> \
                  </div>';

  var Input = UIView.extend({
    templateSource: template,

    serialize: function() {
      var selectedValue = this.options.value;
      var options = this.options.settings.get('options');

      if (_.isString(options)) {
        options = $.parseJSON(options);
      }

      options = _.map(options, function(value, key) {
        var item = {};

        item.value = value;
        item.key = key;
        item.selected = (item.key == selectedValue);

        return item;
      });

      return {
        options: options,
        name: this.options.name,
        comment: this.options.schema.get('comment'),
        readonly: !this.options.canWrite,
        allow_null: this.options.settings.get('allow_null'),
        placeholder_text: (this.options.settings.get('placeholder_text')) ?  this.options.settings.get('placeholder_text') : __t('select_from_below')
      };
    }
  });

  var Component = UIComponent.extend({
    id: 'select',
    dataTypes: ['VARCHAR', 'INT'],
    variables: [
      {id: 'options', ui: 'textarea', options:{'rows': 25}, comment: __t('select_options_comment')},
      {id: 'allow_null', ui: 'checkbox'},
      {id: 'placeholder_text', ui: 'textinput', char_length: 255, required: false, comment: __t('select_placeholder_text')}
    ],
    Input: Input,
    validate: function(value, options) {
      if (options.schema.isRequired() && _.isEmpty(value)) {
        return __t('this_field_is_required');
      }
    },
    list: function(options) {
      return _.isString(options.value) ? options.value.replace(/<(?:.|\n)*?>/gm, '').substr(0,100) : '';
    }
  });

  return Component;
});
