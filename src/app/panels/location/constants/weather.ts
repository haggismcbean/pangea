// weather ascii art stolen from wttr.in
import hljs from 'highlight.js/lib/highlight';
import * as _ from 'lodash';

const CLOUDY = `
               
      .--.     
   .-(    ).   
  (___.__)__)  
               
`;

const FOGGY = `
               
  _ - _ - _ -  
   _ - _ - _   
  _ - _ - _ -  
               
`;

const HEAVY_RAIN = `
      .-.      
     (   ).    
    (___(__)   
   ‚ʻ‚ʻ‚ʻ‚ʻ    
   ‚ʻ‚ʻ‚ʻ‚ʻ    
`;

const SUNNY = `
     \\   /     
      .-.      
   ~ (   ) ~   
      \`-᾿      
     /   \\     
`;

const PARTLY_CLOUDY = `
    \\  /       
  ~ /"".-.     
    \\_(   ).   
    /(___(__)  
               
`;

const LIGHT_DRIZZLE = `
      .-.      
     (   ).    
    (___(__)   
     ‘ ‘ ‘ ‘   
    ‘ ‘ ‘ ‘    
`;

const LIGHT_RAIN_SHOWER = `
  ~\`/"".-.     
   ,\\_(   ).   
    /(___(__)  
      ‘ ‘ ‘ ‘  
     ‘ ‘ ‘ ‘   
`;

const THUNDER_STORMS = `
       .-.     
      (   ).   
     (___(__)  
     ⚡‘‘⚡‘‘⚡    
     ‘‘‘‘‘‘‘   
`;

const SNOW = `
      .-.      
     (   ).    
    (___(__)   
     * * * *   
    * * * *    
`;

export const weather = {
    CLOUDY: getStyledGlyph(CLOUDY),
    FOGGY: getStyledGlyph(FOGGY),
    HEAVY_RAIN: getStyledGlyph(HEAVY_RAIN),
    SUNNY: getStyledGlyph(SUNNY),
    PARTLY_CLOUDY: getStyledGlyph(PARTLY_CLOUDY),
    LIGHT_DRIZZLE: getStyledGlyph(LIGHT_DRIZZLE),
    LIGHT_RAIN_SHOWER: getStyledGlyph(LIGHT_RAIN_SHOWER),
    THUNDER_STORMS: getStyledGlyph(THUNDER_STORMS),
    SNOW: getStyledGlyph(SNOW)
};

function getStyledGlyph(glyph) {
    const WEATHER_HIGHLIGHTING = {
        lexemes: '.',
        keywords: {
            blue: 'ʻ ‚ ‘',
            grey: '- _',
            yellow: '\\ / " ~ ⚡'
        }
    };

    hljs.registerLanguage('weather', () => WEATHER_HIGHLIGHTING);

    return hljs.highlight('weather', glyph).value;
}
