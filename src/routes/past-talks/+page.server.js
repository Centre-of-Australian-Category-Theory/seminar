import fs from 'fs';
import yaml from 'js-yaml';
import katex from 'katex';

function findEndOfMath(delimiter, text, startIndex) {
  let index = startIndex;
  let braceLevel = 0;

  const delimLength = delimiter.length;

  while (index < text.length) {
    const character = text[index];

    if (braceLevel <= 0 &&
        text.slice(index, index + delimLength) === delimiter) {
      return index;
    } else if (character === "\\") {
      index++;
    } else if (character === "{") {
      braceLevel++;
    } else if (character === "}") {
      braceLevel--;
    }

    index++;
  }

  return -1;
};

function renderLaTeX(text) {
  let index;
  let output = "";

  while (true) {
    index = text.search(/(\$\$|\$)/);
    if (index === -1) {
      break;
    }

    if (index > 0) {
      output += text.slice(0, index);
      text = text.slice(index); // now text starts with delimiter
    }

    const display = text.startsWith('$$');
    const delimiter = display ? '$$' : '$';

    index = findEndOfMath(delimiter, text, delimiter.length);
    if (index === -1) {
      break;
    }

    const math = text.slice(delimiter.length, index);

    output += katex.renderToString(math, { displayMode: display, throwOnError: false });
    text = text.slice(index + delimiter.length);
  }

  if (text !== "") {
    output += text;
  }

  return output;
};

function humanizeDate(date) {
  const month = ['January', 'Feburary', 'March', 'April',
                 'May', 'June', 'July', 'August',
                 'September', 'October', 'November', 'December'];
  
  return date.getDate() + " " +
        month[date.getMonth()];
}

function processParts(talks) {
  talks.forEach( (talk) => {
    talk.title = renderLaTeX(talk.title);
    talk.hasAbstract = false;
    let curtalk = talk;
    while (true) {
      if (curtalk.abstract) {
        talk.hasAbstract = true;
        break;
      } else if (curtalk.previous) {
        curtalk = talks.find(x => Number(x.id) == Number(curtalk.previous));
      } else {
        break;
      }
    }
    curtalk = talk;
    curtalk.totalParts = talk.part;
    while (curtalk.previous) {
      curtalk = talks.find(x => Number(x.id) == Number(curtalk.previous));
      curtalk.totalParts = talk.part;
    }
  });
}

function group(data) {
  return data.reduce( (acc, cur) => {
    let key = cur.date.getYear()+1900;
    let subkey = humanizeDate(cur.date);
    if (!acc[key]) acc[key] = {};
    if (!acc[key][subkey]) acc[key][subkey] = [];
    acc[key][subkey].push({ title: cur.title, date: cur.date, speaker: cur.speaker, part: cur.part, totalParts: cur.totalParts, abstract: cur.hasAbstract ? cur.id : undefined});
    return acc;
  }, {});
}

export async function load({ fetch }) {
  let talks = yaml.load(fs.readFileSync('static/talks.yaml').toString());
  processParts(talks);
  talks.sort((a,b) => a.date - b.date);

  return {
    talks: talks,
    grouped: group(talks)
  }
}
