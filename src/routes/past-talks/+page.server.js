import fs from 'fs';
import yaml from 'js-yaml';

function humanizeDate(date) {
  const month = ['January', 'Feburary', 'March', 'April',
                 'May', 'June', 'July', 'August',
                 'September', 'October', 'November', 'December'];
  
  return date.getDate() + " " +
        month[date.getMonth()];
}

function processParts(talks) {
  talks.forEach( (talk) => {
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
