export function nestedAttributeValue(attributeString: string, value: any): any {
  const attributes = attributeString.split('.');
  let content = value;

  for (let index = 0; index < attributes.length; index++) {
    if (content[attributes[index]] === undefined) {
      return undefined;
    }

    content = content[attributes[index]];
  }

  return content;
}

export function mergeDeep(
  object1: { [key: string]: any | any[] },
  object2: { [key: string]: any | any[] }): { [key: string]: any | any[] } {
  for (const key in object1) {
    if (object2.hasOwnProperty(key)) {
      if (object2[key] instanceof Object) {
        object1[key] = mergeDeep({}, object2[key]);
      } else {
        object1[key] = object2[key];
      }
    }
  }

  for (const key in object2) {
    if (!object1.hasOwnProperty(key)) {
      object1[key] = object2[key];
    }
  }

  return object1;
}
