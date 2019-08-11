

// weather ascii art stolen from wttr.in
import hljs from 'highlight.js/lib/highlight';
import * as _ from 'lodash';

const WOMAN = `
      /~~~\\      
     |     |     
     |     |     
    __\\___/__    
  ,'         \`,  
  |  |     |  |  
 |  ,'     \`,  | 
,'  |       |  \`,
|  |         |  |
\`\\,'         \`,/'
  |           |  
  \`-----------'  
     |  |  |     
     |  |  |     
     |  |  |     
     |  |  |     
     |  |  |     `;

const MAN = `
      /~~~\\      
     |     |     
     |     |     
    __\\___/__    
  ,'         \`,  
  |  |     |  |  
 |  ,'     \`,  | 
,'  |       |  \`,
|  | ------- |  |
\`\\,' |  |  | \`,/'
     |  |  |     
     |  |  |     
     |  |  |     
     |  |  |     
     |  |  |     
     |  |  |     
     |  |  |     `;


export const characterGlyph = {
    WOMAN: getStyledGlyph(WOMAN),
    MAN: getStyledGlyph(MAN),
};

function getStyledGlyph(glyph) {
    const PERSON_HIGHLIGHTING = {
        lexemes: '.',
        keywords: {}
    };

    hljs.registerLanguage('character', () => PERSON_HIGHLIGHTING);

    return hljs.highlight('character', glyph).value;
}
