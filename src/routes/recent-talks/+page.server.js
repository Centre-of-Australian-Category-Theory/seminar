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

function group(data) {
  let dateNow = Date.now();
  return data.reduce( (acc, cur) => {
    if ((dateNow - cur.date) <= 365* 24* 60* 60 * 1000) {
      let key = humanizeDate(cur.date);
      if (!acc[key]) acc[key] = [];
      acc[key].push({ title: cur.title, speaker: cur.speaker, part: cur.part, abstract: cur.abstract ? cur.id : false});
    }
    return acc;
  }, {});
}

export async function load({ fetch }) {

  let talks = yaml.load(fs.readFileSync('static/talks.yaml').toString());
  talks.sort((a,b) => b.date - a.date);

  return {
    grouped: group(talks)
  }
}
