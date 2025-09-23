var container = document.getElementById('theme_form');
var outputSection = document.getElementById('output-section');
outputSection.style.display = 'none';

var baseTheme = {};

var editor;
var editorOptions = Object.assign({}, JSONEditor.defaults.options, {
    iconlib: 'fontawesome5',
    object_layout: 'normal',
    collapsed: true,
    show_errors: 'interaction',
    theme: 'bootstrap5',
    disable_edit_json: true,
    disable_properties: true,
    remove_empty_properties: true
});

var aceConfig = {
    mode: 'ace/mode/json',
    maxLines: Infinity,
    minLines: 5,
    showFoldWidgets: false,
    showPrintMargin: false
};

var outputTextarea = ace.edit('output-textarea', aceConfig);
//-- var schemaTextarea = ace.edit('schema-textarea', aceConfig);

CompletedStages(0);