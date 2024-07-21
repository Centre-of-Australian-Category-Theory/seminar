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
         month[date.getMonth()] + " " +
         Number(date.getYear()+1900);
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
  let dateNow = Date.now();
  return data.reduce( (acc, cur) => {
    if ((dateNow - cur.date) <= 365* 24* 60* 60 * 1000) {
      let key = humanizeDate(cur.date);
      if (!acc[key]) acc[key] = [];
      acc[key].push({ title: cur.title, date: cur.date, speaker: cur.speaker, part: cur.part, totalParts: cur.totalParts, abstract: cur.hasAbstract ? cur.id : undefined});
    }
    return acc;
  }, {});
}

export async function load({ fetch }) {

  let talks = yaml.load(fs.readFileSync('static/talks.yaml').toString());
  processParts(talks);
  talks.sort((a,b) => b.date - a.date);
  let grouped = group(talks);

  Object.keys(grouped).forEach ( (date) => {
    grouped[date].sort((a,b) => a.date - b.date);
    grouped[date].forEach ( (item) => delete item.date );
  });
  
  return grouped;
}
