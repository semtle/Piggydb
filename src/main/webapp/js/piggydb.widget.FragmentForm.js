(function(module) {
	
	var _messages = piggydb.server.messages;
	
	var _markItUpSettings = {
		nameSpace: 'fragment-editor',
    previewAutoRefresh: false,
    previewParserPath:  '', // path to your Wiki parser
    onShiftEnter:   {keepDefault:false, replaceWith:'\n\n'},
    markupSet: [
      {name: _messages["editor-bold"], key: 'B', openWith: "'''", closeWith: "'''"}, 
      {name: _messages["editor-italic"], key: 'I', openWith: "''", closeWith: "''"}, 
      {name: _messages["editor-strike"], key: 'S', openWith: '__', closeWith: '__'}, 
      {separator: '---------------' },
      {name: _messages["editor-bulleted-list"], openWith: '-'}, 
      {name: _messages["editor-numeric-list"], openWith: '+'}, 
      {separator: '---------------' },
      {name: _messages["editor-link"], key: "L", openWith: "[[![URL:!:http://]!] ", 
        closeWith: ']', placeHolder: _messages["editor-link-label"] },
      {name: _messages["editor-embed-another-fragment"], key: 'E',
        openWith: "fragment:[![" + _messages["editor-fragment-id"] + "]!]:embed "},
      {separator: '---------------' },
      {name: _messages["editor-quote"], openWith: '>', placeHolder: ''},
      {separator: '---------------' },
      {name: _messages["help"]}
    ]
  };
	
	var _wikiHelp = new piggydb.widget.Facebox("facebox-wiki-help");
	
	var _class = function(element) {
		module.Widget.call(this, element);
		this.textarea = this.element.find("textarea.fragment-content");
		this.prepare();
	};
	
	_class.addToolBar = function(textarea, resizeHandle) {
		_markItUpSettings.resizeHandle = resizeHandle;
		textarea.markItUp(_markItUpSettings);
	};
	
	_class.linkToWikiHelp = function(a) {
		a.attr("href", piggydb.server.wikiHelpUrl).click(function() {
	  	_wikiHelp.show(this.href);
	    return false;
	  });
	};
	
	_class.openToCreate = function() {
		jQuery("#dialog-fragment-form").remove();
		jQuery.get("html/fragment-editor.htm", function(html) {
			jQuery("body").append(html);
			var form = new _class(jQuery("#dialog-fragment-form"));
			form.open();
		});
	};
	
	_class.prototype = jQuery.extend({
		
		prepare: function() {
			jQuery.updnWatermark.attachAll();
			this.element.find("input.fragment-as-tag").button({
	      icons: {
	      	primary: "ui-icon-piggydb-tag"
	      },
	      text: false
		  });
			_class.addToolBar(this.textarea, false);
			_class.linkToWikiHelp(this.element.find(".markItUp .markItUpButton9 a"));
		},
		
		open: function() {
			var outer = this;
			
			this.element.dialog({
		    modal: false,
		    width: 600,
		    height: 400,
		    resize: function() {
		    	outer.adjustEditorHeight();
				}
		  });
			
			this.element.find("button.cancel").click(function() {
				outer.element.dialog("close");
			});
			
			this.adjustEditorHeight();
			this.textarea.get(0).focus();
		},
		
		adjustEditorHeight: function() {
			var baseHeight = this.element.find("form").height() 
				- this.element.find("div.title").height()
				- this.element.find("div.buttons").height();
			this.textarea.height(baseHeight - 45);
		}
		
	}, module.Widget.prototype);
	
	module.FragmentForm = _class;

})(piggydb.widget);	
