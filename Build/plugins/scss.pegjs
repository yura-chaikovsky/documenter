start
 = d:desc {return d;}
 / .* {return ''}

desc
 = p:("/**" inner* "*/") .* {return p[1].join('')}

inner =  p:(!"*/" .){return p[1]}