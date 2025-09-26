/*------------------------- DOM Hooks-------------------------*/


// ------- Installation of Power BI desktop External tool
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt FIRED');
    e.preventDefault();
    deferredPrompt = e;
});

document.getElementById('Installer').addEventListener('click', async () => {


    const relatedApps = await navigator.getInstalledRelatedApps();

    // Dump all the returned related apps into a table in the console
    console.table(relatedApps);

    // Search for a specific installed platform-specific app
    const psApp = relatedApps.find((app) => app.url === "https://apanasara.github.io/PBi_Theme_Tool/src/index.html");

    if (psApp) {
        // There's an installed platform-specific app that handles sending push messages
        alert('This feature is under development.');
        return;
    }

    if (psApp && doesVersionSendPushMessages(psApp.version)) {
        // There's an installed platform-specific app that handles sending push messages
        console.log('installed there');
        return;
    }


    const isInstalledPWA = window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        window.matchMedia('(display-mode: standalone)').matches;

    if (!isInstalledPWA) {
        if (deferredPrompt !== null) {
            //deferredPrompt.prompt();
            // const { outcome } = await deferredPrompt.userChoice;
            // if (outcome === 'accepted') {
            //     deferredPrompt = null;
            // }
        }
    } else {
        console.log('installed already');
    }

});

// ------------ Hard Refresh App
document.getElementById('Refresher').addEventListener('click', async () => {
    await HardRefresh();
});

//------- getting schema from Microsoft
document.getElementById('urlForm').addEventListener('submit', async function (event) {
    event.preventDefault();
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