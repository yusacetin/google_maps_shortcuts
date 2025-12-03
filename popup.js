/*
This file is part of Google Maps Shortcuts.

Google Maps Shortcuts is free software: you can redistribute it
and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option)
any later version.

Google Maps Shortcuts is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Google Maps Shortcuts.
If not, see <https://www.gnu.org/licenses/>.
*/

const SV_ID = "svKeys";
const BACK_ID = "backKeys";
const MAPSTYLE_ID = "mapStyleKeys"
const IMAGERY_ID = "imageryKeys";

const SV_DEFAULT = "f";
const BACK_DEFAULT = "q,alt+a";
const MAPSTYLE_DEFAULT = "v";
const IMAGERY_DEFAULT = "g";

function saveKeys() {
    const svKeysValue = removeSpaces(document.getElementById("sv-input").value.toLowerCase());
    const backKeysValue = removeSpaces(document.getElementById("back-input").value.toLowerCase());
    const mapStyleKeysValue = removeSpaces(document.getElementById("mapstyle-input").value.toLowerCase());
    const imageryKeysValue = removeSpaces(document.getElementById("imagery-input").value.toLowerCase());

    chrome.storage.local.set({[SV_ID]: svKeysValue});
    chrome.storage.local.set({[BACK_ID]: backKeysValue});
    chrome.storage.local.set({[MAPSTYLE_ID]: mapStyleKeysValue});
    chrome.storage.local.set({[IMAGERY_ID]: imageryKeysValue});
}

function resetKeys(){
    document.getElementById("sv-input").value = SV_DEFAULT;
    document.getElementById("back-input").value = BACK_DEFAULT;
    document.getElementById("mapstyle-input").value = MAPSTYLE_DEFAULT;
    document.getElementById("imagery-input").value = IMAGERY_DEFAULT;
    saveKeys();
}

// Reference: https://stackoverflow.com/a/57551361
async function getAndDisplayStoredValues(){
    return new Promise((resolve, reject)=>{
        try{
            chrome.storage.local.get([
                SV_ID,
                BACK_ID,
                MAPSTYLE_ID,
                IMAGERY_ID
            ],
                function(value){
                    if (value[SV_ID] == undefined){
                        document.getElementById("sv-input").value = SV_DEFAULT;
                        chrome.storage.local.set({SV_ID: SV_DEFAULT});
                    }else{
                        document.getElementById("sv-input").value = value[SV_ID];
                    }

                    if (value[BACK_ID] == undefined){
                        document.getElementById("back-input").value = BACK_DEFAULT;
                        chrome.storage.local.set({BACK_ID: BACK_DEFAULT});
                    }else{
                        document.getElementById("back-input").value = value[BACK_ID];
                    }

                    if (value[MAPSTYLE_ID] == undefined){
                        document.getElementById("mapstyle-input").value = MAPSTYLE_DEFAULT;
                        chrome.storage.local.set({MAPSTYLE_ID: MAPSTYLE_DEFAULT});
                    }else{
                        document.getElementById("mapstyle-input").value = value[MAPSTYLE_ID];
                    }

                    if (value[IMAGERY_ID] == undefined){
                        document.getElementById("imagery-input").value = IMAGERY_DEFAULT;
                        chrome.storage.local.set({IMAGERY_ID: IMAGERY_DEFAULT});
                    }else{
                        document.getElementById("imagery-input").value = value[IMAGERY_ID];
                    }
                });
        } catch(exc) {
            console.log(exc);
        }
    })
}

window.onload = () => {
    document.getElementById("save-button").addEventListener("click", ()=>{
        saveKeys();
    });

    document.getElementById("reset-button").addEventListener("click", ()=>{
        resetKeys();
    });

    getAndDisplayStoredValues();
}

// Helper function
function removeSpaces(str){
    return str.replace(/\s+/g, '');
}