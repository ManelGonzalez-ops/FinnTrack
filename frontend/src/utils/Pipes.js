export const camelCasePipe=(text)=>{
    return text.replace(/([A-Z])/g, ' $1').trim()
}