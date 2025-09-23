/*------------------------- DOM Hooks-------------------------*/
document.getElementById('urlForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Use the returned value outside
    fetchData().then((dataJson) => {

        collapse_all(dataJson);
        dataJson = Object.assign(dataJson, { options: { collapsed: false } });
        dataJson.definitions.color.format = "color";
        /*
        schemaTextarea.setValue(JSON.stringify(dataJson.definitions, null, 2).slice(0, 100000));
        schemaTextarea.clearSelection(1);
        */
        editorOptions = Object.assign(editorOptions, { schema: dataJson });
        initJsoneditor();
        CompletedStages(1);
    });
});


//---------  getting import of base json
document.getElementById('fileInput').addEventListener('change', (event) => {
    handleFileSelection(event);
    CompletedStages(2);
});
// -------creating json theme from Form
document.getElementById('create_json').addEventListener('click', function () {
    // Get the value from the editor
    var export_theme = editor.getValue();
    removeEmptyNodes(export_theme);

    outputTextarea.setValue(JSON.stringify(export_theme, null, 2));
    outputTextarea.clearSelection(1);

    CompletedStages(3);

});

// -------export theme
document.getElementById('export_json').addEventListener('click', async function () {
    // Get the value from the editor

    const fileName = document.querySelector('#file_path').textContent || editor.getEditor('root.name').value;
    const fileContent = outputTextarea.getValue();
    await saveFile(fileName, fileContent);
    CompletedStages(4);
});

// -------share theme
document.getElementById('share_json').addEventListener('click', async function () {
    // Get the value from the editor

    const fileName = document.querySelector('#file_path').textContent || editor.getEditor('root.name').value;
    const fileContent = outputTextarea.getValue();
    await shareJson(fileContent, fileName, `${editor.getEditor('root.name').value}`);
    CompletedStages(4);
});