import fs from 'fs';
import yaml from 'js-yaml';

function humanizeDate(date) {
  const month = ['January', 'Feburary', 'March', 'April',
                 'May', 'June', 'July', 'August',
                 'September', 'October', 'November', 'December'];
  
  return date.getDate() + " " +
        month[date.getMonth()];
}

function group(data) {
  return data.reduce( (acc, cur) => {
    let key = cur.date.getYear()+1900;
    let subkey = humanizeDate(cur.date);
    if (!acc[key]) acc[key] = {};
    if (!acc[key][subkey]) acc[key][subkey] = [];
    acc[key][subkey].push({ title: cur.title, speaker: cur.speaker, part: cur.part, abstract: cur.abstract ? cur.id : false});
    return acc;
  }, {});
}

export async function load({ fetch }) {
  let talks = yaml.load(fs.readFileSync('static/talks.yaml').toString());
  talks.sort((a,b) => a.date - b.date);

  return {
    talks: talks,
    grouped: group(talks)
  }
}
