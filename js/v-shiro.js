const WILDCARD_TOKEN = '*'
const PART_DIVIDER_TOKEN = ':'
const SUBPART_DIVIDER_TOKEN = ','

function setParts(wildcardString) {
  const array = []
  wildcardString.split(PART_DIVIDER_TOKEN).forEach(item => {
    const itemArray = item.split(SUBPART_DIVIDER_TOKEN)
    array.push(itemArray)
  })
  return uniq(array)
}

function implies(parts, otherParts) {
  let i = 0
  for (let j = i; j < otherParts.length; i = ++j) {
    const otherPart = otherParts[j]
    if (parts.length - 1 < j) {
      return true
    } else {
      const part = parts[j]
      console.log('i j part otherPart ', i, j, part, otherPart)
      if (!part.includes(WILDCARD_TOKEN) && intersection(part, otherPart).length !== otherPart.length) {
        return false
      }
    }
  }

  for (; i < parts.length; i++) {
    const part = parts[i]
    if (!part.includes(WILDCARD_TOKEN)) {
      return false
    }
  }
  return true
}
