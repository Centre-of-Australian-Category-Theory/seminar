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


function speakerTalks(data,name) {
  let talks = [];
  data.forEach( (cur) => {
    if (cur.speaker == name)
      talks.push(cur);
  });
  return talks.reverse();
}

function group(data) {
  return data.reduce( (acc, cur) => {
    cur.title = renderLaTeX(cur.title);
    let key = cur.date.getYear() + 1900;
    if (!acc[key]) acc[key] = [];
    cur.date = humanizeDate(cur.date);
    acc[key].push(cur);
    return acc;
  }, {});
}

function dates(data) {
  let retval = { };
  data.forEach( (talk) => {
    retval[talk.id] = talk.date;
  });
  return retval;
}

function years(data) {
  let retval = { };
  data.forEach( (talk) => {
    retval[talk.id] = talk.date.getYear() + 1900;
  });
  return retval;
}

export function load({ params }) {
  let talks = yaml.load(fs.readFileSync('static/talks.yaml').toString());
  talks.sort((a,b) => b.date - a.date);
  let theTalks = speakerTalks(talks,params.slug);
  
  return {
    years: years(theTalks),
    talks: group(theTalks),
    dates: dates(theTalks),
    speaker: params.slug
  }
}
