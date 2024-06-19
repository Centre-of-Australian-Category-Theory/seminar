import fs from 'fs';
import yaml from 'js-yaml';

export async function load({ fetch }) {
  let talks = yaml.load(fs.readFileSync('static/talks.yaml').toString());
  let ids = [];

  talks.forEach( (talk) => {
    let curtalk = talk;
    while (true) {
      if (curtalk.abstract) {
        ids.push(talk.id);
        break;
      } else if (curtalk.previous) {
        curtalk = talks.find(x => Number(x.id) == Number(curtalk.previous));
      } else {
        break;
      }
    }
  });

  return { ids: ids };
}
