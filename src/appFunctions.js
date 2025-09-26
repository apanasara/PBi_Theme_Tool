/*------------------ Geting Theme Schema from URL --------------------*/
async function fetchData() {
  var result;
  var url = document.getElementById('urlInput').value;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    result = await response.json()//response.text(); // or response.json() if it's JSON 
  } catch (error) {
    result = `Error: ${error.message}`;
  }

  return result;
}

/*-------------------- exporting theme json---------------------------*/

async function saveFile(filename, content) {
  const opts = { suggestedName: filename, types: [{ description: 'Power BI Theme file', accept: { 'text/plain': ['.json'] } }] };
  try {
    const handle = await window.showSaveFilePicker(opts);
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    alert('File saved successfully!');
  } catch (err) {
    alert("Save failed:", err);
  }
}



/*-------------------- Share button ---------------------------------*/
/// what is file array
async function shareJson(jSonString, shareTitle, shareText) {
  
  let opt = { type: 'text/plain' };
  const jsonBlob = new Blob([jSonString], opt);
  const file = new File([jsonBlob], 'theme_json.txt', opt);
  const filesArray = [file];

  if (navigator.canShare && navigator.canShare({ files: filesArray })) {
    try {
      await navigator.share({
        files: filesArray,
        title: shareTitle,
        text: shareText
      });
      console.log('Shared successfully');
    } catch (error) {
      console.error('Sharing failed', error);
    }
  } else {
    console.log(`System doesn't support sharing.`);
  }
}


/*-------------------- remove blank nodes from json ------------------*/

function removeEmptyNodes(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      removeEmptyNodes(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        if (key == "name") {
          //console.log('breakepoint');
        }
        delete obj[key];
      }
    }
    else if (obj[key] === "" || obj[key] === 0 || obj[key] === "#000000") {
      delete obj[key];
    }
  }
};

/*-------------------------------- collapse all nodes----------------*/
function collapse_all(obj, level = 0, l1 = '') {
  var k;
  if (obj instanceof Object) {
    for (k in obj) {
      if (level === 0) { l1 = k }
      if (obj.hasOwnProperty(k)) {
        if (obj.type === "object" || obj.type === "array") {
          obj.level = level;
          if (obj.type === "array" || (obj.level >= 6 && l1 === "definitions")) {
            obj = Object.assign(obj, { options: { collapsed: true } });
          }
          if (obj.level <= 2 && l1 === "properties") {
            obj = Object.assign(obj, { format: 'categories' });
          }
        }
        if (obj.type === "boolean") {
          obj = Object.assign(obj, { format: 'checkbox' });
        }
        collapse_all(obj[k], level + 1, l1);
      }
    }
  }

};

/* ------------------------ initJsoneditor  ---------------------------*/

var initJsoneditor = function () {
  // destroy old JSONEditor instance if exists
  if (editor) {
    editor.destroy();
    container.innerHTML = "";
  }

  // new instance of JSONEditor
  editor = new window.JSONEditor(container, editorOptions);
  editor.theme.options.object_background = 'bg-dark';


  //--------- editor render complete
  editor.on('ready', PostSchemaFormRender);

};

/*------------------- after form rendering completion------------------------*/
function PostSchemaFormRender() {
  HideUnhideArea.style.display = 'block';

  let shcemaField = editor.getEditor('root.$schema');
  shcemaField.setValue(`${document.getElementById('urlInput').value}`);
  shcemaField.disable();
};
/*----------------------- Base theme json import-----------------------------*/

function handleFileSelection(event) {
  const file = event.target.files[0];
  const filePath = file.name;

  // Validate file existence and type
  if (!file) {
    console.log("No file selected. Please choose a file.", "error");
    return;
  }

  // Read the file
  const reader = new FileReader();
  reader.onload = () => {
    baseTheme = JSON.parse(reader.result);

    if (editor) {
      var theme = editor.getValue();
      baseTheme.$schema = theme.$schema;
      theme = Object.assign(theme, baseTheme);
      editor.setValue(theme);
      editor.getEditor('root.$schema').disable();

      document.querySelector('#file_path').innerHTML = filePath;
    }
  };
  reader.onerror = () => {
    console.log("Error reading the file. Please try again.", "error");
  };
  reader.readAsText(file);
}

/*-------------------------- activating strps of progressbar -------------------------*/
function CompletedStages(stageNo) {
  const olElement = document.querySelector('ol');
  const listItems = olElement.children;

  for (let i = 0; i < listItems.length; i++) {
    let li = listItems[i];
    if (i <= stageNo - 1) {
      if (!li.classList.contains('done')) {
        li.classList.add('done');
      }
    } else {
      if (li.classList.contains('done')) {
        li.classList.remove('done');
      }
    }
  }
}

/*---------------------- App Refresh ------------------------------*/
async function HardRefresh() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
      // Clear caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        // Reload the page
        location.reload(true);
        alert("Tool is updated.");
      });
    });
  }
}

/*--------------- App Installation ----------------------*/
async function PwaInstallation(e) {
  const isInstalledPWA = window.matchMedia('(display-mode: window-controls-overlay)').matches ||
                       window.matchMedia('(display-mode: standalone)').matches;

  if(!isInstalledPWA){
    e.prompt();
  }
  
}