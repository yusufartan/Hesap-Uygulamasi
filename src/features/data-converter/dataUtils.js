export const unitOptions = [
  { shortName: 'b', longName: 'Bit', factor: 1 },
  { shortName: 'B', longName: 'Byte', factor: 8 },
  { shortName: 'Kb', longName: 'Kilobit', factor: 1024 },
  { shortName: 'KB', longName: 'Kilobyte', factor: 8 * 1024 },
  { shortName: 'Mb', longName: 'Megabit', factor: 1024 * 1024 },
  { shortName: 'MB', longName: 'Megabyte', factor: 8 * 1024 * 1024 },
  { shortName: 'Gb', longName: 'Gigabit', factor: 1024 * 1024 * 1024 },
  { shortName: 'GB', longName: 'Gigabyte', factor: 8 * 1024 * 1024 * 1024 },
  { shortName: 'Tb', longName: 'Terabit', factor: 1024 * 1024 * 1024 * 1024 },
  { shortName: 'TB', longName: 'Terabyte', factor: 8 * 1024 * 1024 * 1024 * 1024 },
  { shortName: 'Pb', longName: 'Petabit', factor: 1024 * 1024 * 1024 * 1024 * 1024 },
  { shortName: 'PB', longName: 'Petabyte', factor: 8 * 1024 * 1024 * 1024 * 1024 * 1024 },
]

export const convertData = (value, fromFactor, toFactor) => {
  if (!value) return ''
  const num = parseFloat(value)
  if (isNaN(num)) return ''
  const result = num * (fromFactor / toFactor)
  return parseFloat(result.toFixed(10)).toString()
}