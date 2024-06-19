import fs from 'fs';
import yaml from 'js-yaml';

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
      acc[key].push({ title: cur.title, date: cur.date, speaker: cur.speaker, part: cur.part, totalParts: cur.totalParts, abstract: cur.hasAbstract ? cur.id : false});
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
