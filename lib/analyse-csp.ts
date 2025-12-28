import parseCSP from "./csp-parser"
import classifyCSP from "./csp-classifier"
import analyseCSP from "./csp-analyser";

const analyse = (header: string) => {
    return analyseCSP(classifyCSP(parseCSP(header)))
}

export default analyse;