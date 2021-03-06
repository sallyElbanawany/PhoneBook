let currentEntry = "";

$(document).ready(function () {
    init();

    // Now install the event handlers for buttons the user can click or tap on.
    // 1. The "Add" button (for adding a new entry)...
    $("#add").click(function () {
        currentEntry = "";
        // $("#fullname").val(null);
        let e = new Entry();    // An empty one.
        displayEntry(e);

    });

    // 2. The "Del" button, for deleting an entry...
    $("#del").click(function () {
        if (currentEntry !== "") {
            removeEntry(currentEntry);
            currentEntry = "";
            displayEntryList("#list");
            saveList();
        }
    });

    // 3. The "Update" button, for updating an entry's details...
    $("#update").click(function () {
        updateEntry();
        displayEntryList("#list");
        saveList();
    });

    // 4. The "Save" button, for saving a new entry details...
    $("#save").click(function () {
        currentEntry = addNewEntry();
        console.log("#save",currentEntry);
        displayEntryList("#list");
        saveList();
    });

    // 5. The "Cancel" button, for saving a new entry details...
    $("#cancel").click(function () {
    });
});

$(document).on('click', "#list a", function () {
    currentEntry = $(this).text();                  // The text in the <a> element, which is an Entry's displayName()
    let e = getEntryFromDisplayName(currentEntry);  // This get a reference to the actual Entry
    displayEntry(e);                                // This puts it into the form on the 'entry' page
});

function init() {
    loadList();
    displayEntryList("#list");
}

let Entry = function (name, mobile, gender, email, dob) {
    this.name = name;
    this.mobile = mobile;
    this.gender = gender;
    this.email = email;
    this.dob = new Date(dob);
}

Entry.prototype.displayName = function () {
    let firstnames, surname;
    firstnames = this.name.substring(0, this.name.lastIndexOf(" ")).trim();
    surname = this.name.substring(this.name.lastIndexOf(" ") + 1);
    return firstnames + " " + surname;
}

Entry.prototype.isBirthday = function () {
    let bday = this.dob;
    bday.fullYear = new Date().fullYear;
    if (bday.getDate() === new Date().getDate()) {
        return true;
    } else {
        return false;
    }
}

Entry.prototype.changeName = function (firstnames, surname) {
    this.name = firstnames.trim() + " " + surname.trim();
    return this;
}

let entries = [];		// Start with a simple array

function addEntry(name, mobile, gender, email, dob) {
    let e = new Entry(name, mobile, gender, email, dob);
    console.log("addEntry",e);
    entries.push(e);
    sortEntries();
    return e;
}

function removeEntry(name) {
    let pos = -1, index, entry = null;
    for (index = 0; index < entries.length; index += 1) {
        if (name === entries[index].displayName()) {
            pos = index;
            break;
        }
    }
    if (pos > -1) {
        entry = entries[pos];
        entries.splice(pos, 1);
    }
    return entry;
}

function sortEntries() {
    entries.sort(function (a, b) {
        if (a.displayName() < b.displayName()) {
            return -1;
        }
        if (a.displayName() > b.displayName()) {
            return 1;
        }
        return 0;
    });
    return entries;
}

function entryList() {
    let index, list = "";
    for (index = 0; index < entries.length; index += 1) {
        list += "<li><a href='#entry'>" + entries[index].displayName() + "</a></li>"; // name='item'
    }
    return list;
}

function displayEntryList(listElement) {
    $(listElement).html(entryList()).listview().listview('refresh');
    return $(listElement);
}

function getEntryFromDisplayName(displayName) {
    let index, e;
    for (index = 0; index < entries.length; index += 1) {
        if (entries[index].displayName() === displayName) {
            return entries[index];
        }
    }
    return null;
}

function displayEntry(e) {
    console.table(e);
    $("#fullname").val(e.name);
    $("#mobile").val(e.mobile);
    $("#mobilebutton").attr("href", "tel:" + e.mobile);
    $("#email").val(e.email);
    $("#mailbutton").attr("href", "mailto:" + e.email);
    $("#gender").val(e.gender);
    $("#genderbutton").attr("href", "tel:" + e.gender);
    let bdate = e.dob;
    //tel.js:151 Uncaught TypeError: e.dob.toISOString is not a function
    if (bdate != 'Invalid Date')
        $("#bday").val(e.dob.toISOString().substring(0, 10));
    // $("#name").text(e.name);
}

function updateEntry() {
    let e = getEntryFromDisplayName(currentEntry);
    e.name = $("#fullname").val();
    e.mobile = $("#mobile").val();
    e.gender = $("#gender").val();
    e.email = $("#email").val();
    e.dob = $("#bday").val();
}

function addNewEntry() {
    console.log("fullName",$("#fullname2").val());
    let name = $("#fullname2").val(),
        mobile = $("#mobile2").val(),
        gender = $("#gender2").val(),
        email = $("#email2").val(),
        dob = $("#bday2").val();
        console.log("from new entry",name);
    if (name !== "") {
        return addEntry(name, mobile, gender, email, dob);
    } else {
        return null;
    }
}

function saveList() {
    let strList = JSON.stringify(entries);
    localStorage.phoneBook = strList;
}

function loadList() {
    let strList;
    strList = localStorage.phoneBook;
    if (strList) {
        entries = JSON.parse(strList);
        let proto = new Entry();
        for (e in entries) {
            entries[e].__proto__ = proto;
            entries[e].dob = new Date(entries[e].dob);
        }
    } else {
        entries = [];
    }
}
