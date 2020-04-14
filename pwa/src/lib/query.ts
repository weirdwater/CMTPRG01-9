
export interface Serializable {
  toString: () => string
}

export interface QueryParameters {
  [parameter: string]: Serializable | undefined
}

export const createQueryString = (params: QueryParameters): string => `?${Object.entries(params).map(p => p.map(s => encodeURIComponent(s ? s.toString() : 'true')).join('=')).join('&')}`

export const getQueryParams = (query: string): QueryParameters => {
  const startQueryString = query.indexOf('?')
  if (startQueryString === -1) {
    return {}
  }

  const queryString = query.substring(startQueryString + 1)
  if (queryString.length === 0) {
    return {}
  }

  return queryString.split('&')
    .map(p => p.split('='))
    .reduce((o, p) => ({...o, [p[0]]: p[1]}), {})
}
