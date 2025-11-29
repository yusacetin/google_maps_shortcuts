/*
This file is part of Custom Shortcuts for Google Maps.

Custom Shortcuts for Google Maps is free software: you can redistribute it
and/or modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at your option)
any later version.

Custom Shortcuts for Google Maps is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Custom Shortcuts
for Google Maps. If not, see <https://www.gnu.org/licenses/>.
*/

//// Constants

const SV_ID = "svKeys";
const BACK_ID = "backKeys";
const MAPSTYLE_ID = "mapStyleKeys"
const IMAGERY_ID = "imageryKeys";

const SV_DEFAULT = "f";
const BACK_DEFAULT = "q,alt+a";
const MAPSTYLE_DEFAULT = "v";
const IMAGERY_DEFAULT = "g";

//// Global variables

// Key combinations
streetViewKeys = SV_DEFAULT.split(",");
backKeys = BACK_DEFAULT.split(",");
//searchKeys = ["s"];
mapStyleKeys = MAPSTYLE_DEFAULT.split(",");
imageryKeys = IMAGERY_DEFAULT.split(",");

// Modifier key pressed conditions
var ctrlDown = false;
var shiftDown = false;
var altDown = false;

//// Callback functions

function toggleStreetView(){
    if (ifStreetViewOnCloseStreetView()) { // if currently viewing street view, exit street view
        return;
    }

    // Being here means we are in map mode, so we toggle the street view highlights
    const prev_state = isStreetViewHighlightOn();
    ifMapModeToggleStreetViewHighlight();
    setTimeout(() => {
        // Double click requirement fix
        const cur_state = isStreetViewHighlightOn();
        if (prev_state == cur_state) {
            ifMapModeToggleStreetViewHighlight();
        }
    }, 50);
}

function goBack() {
    if (ifGlobalSideBarOpenCloseSideBar()) {
        return;
    }

    if (ifItemActiveAndInSearchCloseItem()) {
        return;
    }

    if (ifItemActiveOutsideSearchCloseItem()) {
        return;
    }

    // TODO check if search box is active, close it if it's active

    if (ifStreetViewOnCloseStreetView()) {
        return;
    }

    if (ifStreetViewHighlightOnTurnOff()) {
        return;
    }
}

function toggleMapView() {
    var button = getToggleMapViewButton();
    if (button == null) {
        return;
    }

    const prev_state = button.getAttribute("vet");
    button.click();
    setTimeout(() => {
        const cur_state = button.getAttribute("vet");
        if (prev_state == cur_state) {
            button.click();
        }
    }, 50);
}

// TODO search does not work
function activateSearch() {
    var searchBox = getSearchBox();
    if (searchBox == null) {
        return;
    }
    console.log("Click search")
    searchBox.click();
}

function toggleImagery() {
    var button = getToggleImageryButton();
    if (button == null) {
        return;
    }

    const prev_state = isImageryOn(); // returns true for imagery on, false for imagery off
    button.click();
    const cur_state = isImageryOn();
    if (prev_state == cur_state) {
        // Fix for double click requirement, if the state does not change after one click, click again
        // TODO this fixes the double click, but the imagery bar shows nothing until the map is dragged or zoomed if a double click is performed to open it 
        button.click();
    }
}

//// Functions (other than callback functions)

function getToggleMapViewButton() {
    var buttonSearch = document.getElementsByClassName("yHc72 qk5Wte");
    if (buttonSearch.length > 0) {
        for (let i=0; i<buttonSearch.length; i++) {
            var currentButton = buttonSearch[i];
            if (currentButton.hasAttribute("jsaction")) {
                return currentButton;
            }
        }
    }
    return null;
}

function ifStreetViewOnCloseStreetView() {
    var streetViewExitButton = getStreetViewExitButton();
    if (streetViewExitButton != null) {
        streetViewExitButton.click();

        // Sometimes a double click is required for some reason
        streetViewExitButton = getStreetViewExitButton();
        if (streetViewExitButton != null) {
            streetViewExitButton.click();
        }

        setTimeout(() => {
            const search_box = getSearchBox();
            search_box.blur();
        }, 100);

        return true;
    }
    return false;
}

function ifMapModeToggleStreetViewHighlight() {
    var streetViewToggleButton = getStreetViewToggleButton();
    if (streetViewToggleButton != null) {
        streetViewToggleButton.click();
        return true;
    }
    return false;
}

function ifStreetViewHighlightOnTurnOff() {
    if (isStreetViewHighlightOn()) {
        ifMapModeToggleStreetViewHighlight();
    }
}

function isStreetViewHighlightOn() {
    var streetViewButtonSearch = document.getElementsByClassName("WzvKIe FVxzpc");
    return (streetViewButtonSearch.length > 0);
}

function getStreetViewToggleButton() {
    return document.getElementById("q2sIQ");
}

function getStreetViewExitButton() {
    var exitButtonSearch = document.getElementsByClassName("g88MCb S9kvJb");

    if (exitButtonSearch.length <= 0) {
        return null;
    }

    for (let i=0; i<exitButtonSearch.length; i++) {
        var currentButton = exitButtonSearch[i];
        if (currentButton.hasAttribute("jsaction")) {
            if (currentButton.getAttribute("jsaction").includes("imageheader.close")) {
                return currentButton;
            }
        }
    }

    return null;
}

function ifGlobalSideBarOpenCloseSideBar() {
    if (isGlobalSideBarOpen()) {
        // Now we are sure that the side bar is open
        var globalSideBarCloseButton = getGlobalSideBarCloseButton();
        globalSideBarCloseButton.click();
        return true;
    }
    return false;
}

function isGlobalSideBarOpen() {
    var globalSideBarCloseButtonSearch = document.getElementsByClassName("UHOsgd");
    if (globalSideBarCloseButtonSearch.length > 0) {
        // Being here means the side bar was opened at least once. It may or may not be closed.
        var globalSideBarCloseButton = globalSideBarCloseButtonSearch[0];
        return globalSideBarCloseButton.checkVisibility();
    }
    return false;
}

function getGlobalSideBarCloseButton() {
    var globalSideBarCloseButtonSearch = document.getElementsByClassName("UHOsgd");
    if (globalSideBarCloseButtonSearch.length > 0) {
        // Being here means the side bar was opened at least once. It may or may not be closed.
        var globalSideBarCloseButton = globalSideBarCloseButtonSearch[0];
        return globalSideBarCloseButton;
    }
    return null;
}

function ifItemActiveAndInSearchCloseItem() {
    var selectedItemWhenInSearchCloseButtonSearch = document.getElementsByClassName("VfPpkd-icon-LgbsSe yHy1rc eT1oJ mN1ivc");
    if (selectedItemWhenInSearchCloseButtonSearch.length > 0) {
        var selectedItemWhenInSearchCloseButton = selectedItemWhenInSearchCloseButtonSearch[0];
        selectedItemWhenInSearchCloseButton.click();
        return true;
    }
    
    return false;
}

function ifItemActiveOutsideSearchCloseItem() {
    var itemActiveOrSearchCloseButton = getItemActiveOrSearchCloseButton();
    if (itemActiveOrSearchCloseButton != null) {
        itemActiveOrSearchCloseButton.click();

        // Sometimes a double click is required for some reason
        if (getStreetViewExitButton() == null) { // if you double click when street view is on, is exits street view and resets map style for some reason
            var itemActiveOrSearchCloseButton = getItemActiveOrSearchCloseButton();
            if (itemActiveOrSearchCloseButton != null) {
                itemActiveOrSearchCloseButton.click();
            }
        }

        return true;
    }

    return false;
}

function getItemActiveOrSearchCloseButton() {
    var selectedItemCloseButtonSearch = document.getElementsByClassName("yAuNSb vF7Cdb");
    if (selectedItemCloseButtonSearch.length > 0) {
        for (let i=0; i<selectedItemCloseButtonSearch.length; i++) {
            var selectedItemCloseButton = selectedItemCloseButtonSearch[i];
            if (selectedItemCloseButton.hasAttribute("jsaction")) {
                if (selectedItemCloseButton.getAttribute("jsaction").includes("omnibox.clear")) {
                    return selectedItemCloseButton;
                }
            }
        }
    }
    return null;
}

function getToggleImageryButton() {
    var buttons = document.getElementsByClassName("GFgdCf waIsr");
    if (buttons.length > 0) {
        return buttons[0];
    }
    return null;
}

function isImageryOn() {
    var elems = document.getElementsByClassName("widgets-above-runway");
    return (elems.length > 0);
}

//// Execute non-native shortcuts

function checkAndRun(e, keyList, starti, callback){
    for (let i=starti; i<keyList.length; i++){
        const shortcutKeys = keyList[i].split("+");
        if (shortcutKeys.length > 1){
            // Combination
            if (shortcutKeys.indexOf("ctrl") >= 0) {
                // Combination contains ctrl
                if (!ctrlDown) {
                    break; // failed to complete combination
                }
            }
            // Reaching here means that the program did not break in the previous line
            if (shortcutKeys.indexOf("shift") >= 0) {
                // Combination contains shift
                if (!shiftDown) {
                    break; // failed to complete combination
                }
            }
            // Last step to check for alt
            if (shortcutKeys.indexOf("alt") >= 0) {
                if (!altDown) {
                    break;
                }
            }
            // Reaching here means all combinatorial modifiers are being pressed
            // all that is left is to check for the letter press
            if (shortcutKeys.indexOf(e.code.toLowerCase().slice(-1)) >= 0) {
                // Success
                callback();
                return;
            }
        } else {
            // Single key
            if (shortcutKeys[0].indexOf(e.key.toLowerCase()) >= 0){
                // Success
                callback();
                return;
            }
        }

    }
}

function getSearchBox() {
    return document.getElementById("searchboxinput");
}

// Reference: https://stackoverflow.com/a/57551361
async function getAndAssignStoredValues(){
    return new Promise((resolve, reject)=>{
        try{
            chrome.storage.local.get([
                SV_ID,
                BACK_ID,
                MAPSTYLE_ID,
                IMAGERY_ID
            ],
                function(value){
                    if (value[SV_ID] != undefined){
                        streetViewKeys = value[SV_ID].split(",");
                    }

                    if (value[BACK_ID] != undefined){
                        backKeys = value[BACK_ID].split(",");
                    }

                    if (value[MAPSTYLE_ID] != undefined){
                        mapStyleKeys = value[MAPSTYLE_ID].split(",");
                    }

                    if (value[IMAGERY_ID] != undefined){
                        imageryKeys = value[IMAGERY_ID].split(",");
                    }
                });
        } catch(exc) {
            console.log(exc);
        }
    })
}

//// Event listeners

document.addEventListener("keyup", (e) => {
    if (e.code == "ControlLeft" || e.code == "ControlRight") {
        ctrlDown = false;
    }else if (e.code == "ShiftLeft" || e.code == "ShiftRight") {
        shiftDown = false;
    }else if (e.code == "AltLeft" || e.code == "AltRight") {
        altDown = false;
    }

    if (document.activeElement == getSearchBox()) {
        return;
    }

    // Check shortcuts and execute corresponding functions
    checkAndRun(e, streetViewKeys, 0, toggleStreetView);
    checkAndRun(e, backKeys, 0, goBack);
    //checkAndRun(e, searchKeys, 0, activateSearch); // does not work
    checkAndRun(e, mapStyleKeys, 0, toggleMapView);
    checkAndRun(e, imageryKeys, 0, toggleImagery);
}, true);

document.addEventListener("keydown", (e) => {
    if (e.code == "ControlLeft" || e.code == "ControlRight") {
        ctrlDown = true;
    }else if (e.code == "ShiftLeft" || e.code == "ShiftRight") {
        shiftDown = true;
    }else if (e.code == "AltLeft" || e.code == "AltRight") {
        altDown = true;
    }
}, true);

window.onload = () => {
    getAndAssignStoredValues();
}