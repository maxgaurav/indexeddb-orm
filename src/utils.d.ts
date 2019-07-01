/**
 * Retrieves the nested attribute value using dot "." values
 * @param attributeString
 * @param value
 */
export declare function nestedAttributeValue(attributeString: string, value: any): any;
/**
 * Deep merges two object taking first input as reference and second input being the properties to be merged to first.
 * @param object1
 * @param object2
 */
export declare function mergeDeep(object1: {
    [key: string]: any | any[];
}, object2: {
    [key: string]: any | any[];
}): {
    [key: string]: any | any[];
};
