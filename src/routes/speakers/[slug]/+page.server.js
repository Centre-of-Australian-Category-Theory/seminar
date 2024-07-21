import fs from 'fs';
import yaml from 'js-yaml';

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
