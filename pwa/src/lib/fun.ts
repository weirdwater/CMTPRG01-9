
export interface Fun<a, b> {
  (_: a): b
}

export interface Action<a> extends Fun<a,a> {}
