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
    talk.abstract = '<p class="pb-3">' + paragraphs.join('</p><p class="pb-3">') + '</p>';
  }

  talk.humanDate = humanizeDate(talk.date);
  
  return talk;
}
