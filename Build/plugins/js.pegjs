{
var functions = {};
var buffer = '';
}

start
  =  unit* {return functions;}

unit
  =  func
  /  export
  /  string
  /  multi_line_comment
  /  single_line_comment
  /  any_char

export
  =  m:multi_line_comment spaces? identifier '.' id:identifier {functions[id] = m;}

func
  =  m:multi_line_comment spaces? id:func_signature {functions[id] = m;}

func_signature
  = "function" spaces? id:identifier spaces? "(" ")" {return "function " + id + "()"; }
  / "function" spaces? id:identifier spaces? "(" p:params ")" {return "function " + id + "(" + p + ")";}
  / id:identifier spaces? ":" spaces? "function" spaces? "(" ")" {return "function " + id + "()"; }
  / id:identifier spaces? ":" spaces? "function" spaces? "(" p:params ")" {return "function " + id + "(" + p + ")";}

params
  = p:(spaces? id:identifier spaces? ","? {return id.trim();})+ {return p.join(', ');}

multi_line_comment
  =  "/**"
     ( !{return buffer.match(/\*\//)} c:. {buffer += c;} )*
     {
       var temp = buffer;
       buffer = '';
       return temp.replace(new RegExp('[/*]+$'), "");
     }

single_line_comment
  =  "//" [^\r\n]*

identifier
  =  a:([a-z] / [A-Z] / "_" / "$") b:([a-z] / [A-Z] / [0-9] /"_")* {return a + b.join("");}

spaces
  =  [ \t\r\n]+ {return "";}

string
  =  "\"" ("\\" . / [^"])* "\""
  /  "'" ("\\" . / [^'])* "'"

any_char
  =  .
