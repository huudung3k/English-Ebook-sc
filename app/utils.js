const cheerio = require('cheerio');

export const getSelectedText = (trim = true) => {
    let selectedText = "";
    if (window.getSelection) {
        selectedText = window.getSelection().toString();
        // for Internet Explorer 8 and below. For Blogger, you should use &amp;&amp; instead of &&.
    } else if (document.selection && document.selection.type != "Control") {
        selectedText = document.selection.createRange().text;
    }

    if (trim) selectedText = selectedText.trim()

    return selectedText
}

export const textToSpeech = async (text) => {
    const response = await fetch("/api/tts", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
    })
    const blob = await response.blob()

    return blob;
}

export const splitTextIntoChunks = (text, maxCharsPerRequest) => {
    const chunks = [];
    let startIndex = 0;
    let endIndex = maxCharsPerRequest;

    while (startIndex < text.length) {
        // Find the next space character before the end index
        let spaceIndex = text.lastIndexOf('.', endIndex);

        // If no space character was found, split at the end index
        if (spaceIndex === -1 || spaceIndex < startIndex) {
            spaceIndex = endIndex;
        }

        // Check if the next chunk is too long and split at a space if necessary
        let chunk = text.slice(startIndex, spaceIndex).trim();
        if (chunk.length > maxCharsPerRequest) {
            spaceIndex = startIndex + chunk.lastIndexOf('.', maxCharsPerRequest);
            chunk = text.slice(startIndex, spaceIndex).trim();
        }

        // Add the chunk to the array if it's not empty
        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        // Update the start index and end index
        startIndex = spaceIndex + 1;
        endIndex = startIndex + maxCharsPerRequest;
    }

    return chunks;
}

export function removeHtmlTags(str) {
    const $ = cheerio.load(str);
    return $.text();
}

export function romanize(num) {
    if (isNaN(num))
        return '';
    var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

export function removeNullValuesInObj(obj) {
    Object.keys(obj).forEach(key => {
        if (obj[key] == null) {
            delete obj[key];
        }
    });
}

export function insertRadioInput(sectionData, randomId = null) {
    const regex = /_O_(\w+)_(\w+)_/g
    const matches = [...sectionData.content.matchAll(regex)]
    for (const m of matches) {
        sectionData.content = sectionData.content.replace(m[0], `<label class=\\"form-control\\"><input type=\\"radio\\" name=\\"${m[1] + (randomId ? '_' + randomId : '')}\\" value=\\"${m[2]}\\"/></label>`)
    }
}

export function insertTextInput(sectionData, randomId = null) {
    const regex = /___(\w+)_/g
    const matches = [...sectionData.content.matchAll(regex)]
    for (const m of matches) {
        sectionData.content = sectionData.content.replace(m[0], `<label class=\\"form-control\\"><input type=\\"text\\" name=\\"${m[1] + (randomId ? '_' + randomId : '')}\\" /></label>`)
    }
}

export function insertTextArea(sectionData, randomId = null) {
    const regex = /____(\w+)_/g
    const matches = [...sectionData.content.matchAll(regex)]
    for (const m of matches) {
        sectionData.content = sectionData.content.replace(m[0], `<label class=\\"form-control\\"><textarea rows=\\"4\\" cols=\\"100\\" name=\\"${m[1] + (randomId ? '_' + randomId : '')}\\" ></textarea></label>`)
    }
}

export function insertCheckboxInput(sectionData, randomId = null) {
    const regex = /_X_(\w+)_/g
    const matches = [...sectionData.content.matchAll(regex)]
    for (const m of matches) {
        sectionData.content = sectionData.content.replace(m[0], `<label class=\\"form-control\\"><input type=\\"checkbox\\" name=\\"${m[1] + (randomId ? '_' + randomId : '')}\\" /></label>`)
    }
}

export function countObjectSimilarities(obj1, obj2) {
    let count = 0;

    for (let prop in obj1) {
        if (obj1.hasOwnProperty(prop) && obj2.hasOwnProperty(prop)) {
            if (obj1[prop] === obj2[prop]) {
                count++;
            }
        } else {
            count++;
        }
    }

    return count;
}

export function splitLastOccurrence(str, substring) {
    const lastIndex = str.lastIndexOf(substring);

    const before = str.slice(0, lastIndex);

    const after = str.slice(lastIndex + 1);

    return [before, after];
}

export function toCamelCase(str) {
    const strs = str.split(' ')
    let result = ''
    for (const s of strs) {
        const camelStr = s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase()
        result = result + camelStr + ' '
    }
    result.trim()

    return result;
}