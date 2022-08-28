import med from './med.json'

const findMed = (val: string) => {
  const filteredMed = med.filter( e => {
    if (e.fullname.toLowerCase() == val) return true
    if (e.tradename?.toLowerCase() == val) return true
    if (e.abbr?.split(',').some( x => x.toLowerCase().trim() == val)) return true
    return false
  })
  if (filteredMed.length > 0) {
    return filteredMed[0]
  }
  return null
}

interface Order {
  med: string,
  prep?: string,
  conc?: number | string,
  dose: string
  route: string
}

const pasteOrder = (o: Order): string => {
  let out = o.med
  // if (o.prep == 'tab' || o.prep == 'cap') {
  if (o.conc) {
    out += `(${o.conc})`
  }
  out += ' ' + o.dose + ' ' + o.route
  return out
}

const getValues = (o: Order, val: Array<string>): Order => {
  let d = val.filter(e => {
    return (e.includes('tab') ||
      e.includes('cap') ||
      e.includes('ml') ||
      e.includes('*') ||
      e.includes('x'))
  })?.[0]
  if (!d) return o
  // Get index of dose
  const i = val.findIndex(e => e==d)
  let endConc = 1
  // In case it use 'x', '*' for dose
  if (d.includes('x') || d.includes('*')) {
    val[i] = val[i].split('*').join('x')
    endConc = i
  } else {
    // Contain number in dose
    if (/\d/.test(d)) {
      endConc = i

    } else {
      endConc = i-1
    }
  }
  if (endConc != 1) {
    o.conc = val.slice(1, endConc).join(' ')
  }
  o.dose = val.slice(endConc, i+1).join(' ')
  if (i+1 < val.length) o.route = val.slice(i+1).join(' ')
  return o
}

export const transform = (input: string, opt: any = {}) => {
  const rows = input.split('\n')
  let results = rows.map( row => {
    let el = row.split(' ')
    let hasConc = false
    // Split dose from name
    if (el[0].includes('(')) {
      let tmp = el[0].split('(')
      el = [tmp[0], tmp[1].slice(0, -1), ...el.slice(1)]
      hasConc = true
    }
    // Remove () from dose
    if (el[1]?.includes('(')) {
      el[1] = el[1].slice(1, -1)
      hasConc = true
    }
    // Find med name
    let med: any = findMed(el[0].toLowerCase())
    let name = ''
    let prep = ''
    let conc = ''
    let dose = ''
    let route = ''
    // Not found med
    if (med == null) {
      med = el[0]
    } else {
      // Found medication
      name = (opt.generic ? med.fullname : el[0])
      prep = med.prep == '-' ? null : med.prep.split(' ')[0]
      conc = med.prep == '-' ? null : med.prep.split(' ')[1]
      dose = med.defaultdose.split('po')[0]
      route = 'po'+med.defaultdose.split('po')[1]

      let order: Order = {
        med: name,
        prep,
        conc,
        dose,
        route
      }

      order = getValues(order, el)

      return pasteOrder(order)
    }
    // Not found medication
    let order: Order = {
      med,
      prep,
      conc,
      dose,
      route
    }
    order = getValues(order, el)
    // el[0] = med
    // if (hasConc) return `${el[0]}(${el[1]}) `+el.slice(2).join(' ')
    // return el.join(' ')
    return pasteOrder(order)
  })
  return results.join('\n')
}
