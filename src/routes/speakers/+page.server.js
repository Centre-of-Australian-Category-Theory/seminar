import fs from 'fs';
import yaml from 'js-yaml';

function surname(name) {
  return String(name).split(" ").slice(-1)[0];
}

function speakers(data) {
  var names = [];
  data.forEach( (cur) => {
    let name = cur.speaker;
    if (Array.isArray(name)) {
      name.forEach( (n) => {
        if (!names.includes(n))
          names.push();
      });
    } else {
      if (!names.includes(name))
        names.push(name);
    }
  });
  names.sort((a,b) => surname(a).localeCompare(surname(b)));
  return names;
}

export async function load({ fetch }) {
  let talks = yaml.load(fs.readFileSync('static/talks.yaml').toString());

  return {
    talks: talks,
    speakers: speakers(talks)
  }
}
