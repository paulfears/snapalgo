export = validate20;
declare function validate20(data: any, { instancePath, parentData, parentDataProperty, rootData }?: {
    instancePath?: string | undefined;
    parentData: any;
    parentDataProperty: any;
    rootData?: any;
}): {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    params: {
        missingProperty: string;
    };
    message: string;
}[] | {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    params: {
        additionalProperty: string;
    };
    message: string;
}[] | {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    params: {
        pattern: string;
    };
    message: string;
}[] | {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    params: {
        type: string;
    };
    message: string;
}[] | {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    params: {
        limit: number;
    };
    message: string;
}[] | {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    params: {
        passingSchemas: number | (number | null)[] | null;
    };
    message: string;
}[] | {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    params: {
        allowedValues: string[];
    };
    message: string;
}[] | null;
declare namespace validate20 {
    export { validate20 as default };
}
