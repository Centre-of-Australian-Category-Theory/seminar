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

function renderString(text) {
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

export function load({ params }) {
  let talks = yaml.load(fs.readFileSync('static/talks.yaml').toString());
  let talk = talks.find(x => Number(x.id) == Number(params.slug));

  talks.forEach( (talk) => {
    let curtalk = talk;
    curtalk.totalParts = talk.part;
    while (curtalk.previous) {
      curtalk = talks.find(x => Number(x.id) == Number(curtalk.previous));
      curtalk.totalParts = talk.part;
    }
  });

  let curtalk = talk;
  let abstract;
  while (true) {
    if (curtalk.abstract) {
      abstract = curtalk.abstract;
      break;
    } else if (curtalk.previous) {
      curtalk = talks.find(x => Number(x.id) == Number(curtalk.previous));
    } else {
      break;
    }
  }

  if (abstract)
  {
    var paragraphs = abstract.split('\n\n');
    abstract = '<p class="pb-3">' + paragraphs.join('</p><p class="pb-3">') + '</p>';
    abstract = abstract.replaceAll(/\((https?[^\s)]*)\)/g, '<a href="$1" class="px-0.5 text-deep-red hover:text-red">(link)</a>');
    abstract = abstract.replaceAll(/([^"])(https?[^\s<)]*)/g, '$1<a href="$2" class="px-0.5 text-deep-red hover:text-red">(link)</a>');
    talk.abstract = renderString(abstract);
  }

  talk.humanDate = humanizeDate(talk.date);
  
  return talk;
}
