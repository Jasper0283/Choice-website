import { sets } from '../data/sets';

// eenvoudige helper om te checken of een set binnen leeftijd/prijs valt
function ageBucket(ageAnswer) {
  // return minAge bucket
  switch (ageAnswer) {
    case '4-6': return { min: 4, max: 6 };
    case '7-9': return { min: 7, max: 9 };
    case '10-13': return { min: 10, max: 13 };
    case '14-17': return { min: 14, max: 17 };
    case '18+': return { min: 18, max: 99 };
    default: return { min: 4, max: 99 };
  }
}

export function getRecommendations(answers, topN = 3) {
  const age = ageBucket(answers.age);

  // Scoring-regels
  const scored = sets
    .filter(s => s.age <= age.max && s.age >= Math.min(4, age.min)) // globaal binnen range
    .map(s => {
      let score = 0;
      const reasons = [];

      if (s.priceRange === answers.budget) { score += 2; reasons.push('Matcht met jouw budget.'); }
      if (s.theme === answers.theme || (s.themes && s.themes.includes(answers.theme))) {
        score += 2; reasons.push(`Thema: ${answers.theme}.`);
      }

      // doel
      if (s.goal === answers.goal || (answers.goal === 'both' && (s.goal === 'display' || s.goal === 'play'))) {
        score += 1; reasons.push('Past bij je doelgebruik.');
      }

      // bouwtijd/ruimte
      if (s.buildTime === answers.buildTime) { score += 1; reasons.push('Gewenste bouwtijd.'); }
      if (s.space === answers.space) { score += 1; reasons.push('Geschikt voor de beschikbare ruimte.'); }

      // leeftijd: beloon nauwere fit
      if (s.age >= age.min && s.age <= age.max) { score += 1; reasons.push('Leeftijdsrange sluit goed aan.'); }

      // lichte boost voor populaire sets
      if (s.popularity) score += s.popularity;

      return { set: s, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return {
    items: scored.map(x => ({
      set: x.set,
      score: x.score,
      reason: summarize(x.reasons)
    }))
  };
}

function summarize(reasons) {
  // combineer max 3 redenen
  const unique = Array.from(new Set(reasons));
  return unique.slice(0, 3).join(' ');
}