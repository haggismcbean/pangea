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

const LIGHT_SNOW = `
      .-.      
     (   ).    
    (___(__)   
     *  *  *   
    *  *   *   
`;

const HEAVY_SNOW = `
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
    LIGHT_SNOW: getStyledGlyph(LIGHT_SNOW),
    HEAVY_SNOW: getStyledGlyph(HEAVY_SNOW),
};

export const getWeatherGlyph = ({ temperature, rainfall }) => {
    switch (temperature) {
        case 0:
        case 1:
        case 2:
            switch (rainfall) {
                case 0:
                case 1:
                case 2:
                    return CLOUDY;
                case 3:
                case 4:
                    return LIGHT_SNOW;
                case 5:
                case 6:
                    return HEAVY_SNOW;
            }
            break;
        case 3:
        case 4:
            switch (rainfall) {
                case 0:
                case 1:
                    return PARTLY_CLOUDY;
                case 2:
                    return FOGGY;
                case 3:
                case 4:
                    return LIGHT_DRIZZLE;
                case 5:
                case 6:
                    return HEAVY_RAIN;
            }
            break;
        case 5:
        case 6:
            switch (rainfall) {
                case 0:
                case 1:
                case 2:
                    return SUNNY;
                case 3:
                case 4:
                    return LIGHT_RAIN_SHOWER;
                case 5:
                case 6:
                    return THUNDER_STORMS;
            }
    }
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
